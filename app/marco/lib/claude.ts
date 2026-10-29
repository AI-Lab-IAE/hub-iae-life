import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { z } from "zod";

export const MODELO = "claude-opus-5-5";

const cliente = new Anthropic();

type Esfuerzo = "low" | "medium" | "high";

export class ErrorIA extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export async function pedirJSON<T extends z.ZodType>(opciones: {
  esquema: T;
  sistema: string;
  contenido: Anthropic.Beta.BetaContentBlockParam[];
  esfuerzo: Esfuerzo;
  maxTokens: number;
}): Promise<z.infer<T>> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[claude] falta la variable ANTHROPIC_API_KEY");
    throw new ErrorIA("El servidor no tiene configurada la conexión con la IA.", 500);
  }

  const INTENTOS = 3;
  for (let intento = 1; intento <= INTENTOS; intento++) {
    try {
      const stream = cliente.beta.messages.stream({
        model: MODELO,
        max_tokens: opciones.maxTokens,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        thinking: { type: "adaptive" },
        system: opciones.sistema,
        output_config: {
          effort: opciones.esfuerzo,
          format: betaZodOutputFormat(opciones.esquema),
        },
        messages: [{ role: "user", content: opciones.contenido }],
      });
      const mensaje = await stream.finalMessage();

      console.log(
        `[claude] intento=${intento} stop=${mensaje.stop_reason} in=${mensaje.usage.input_tokens} out=${mensaje.usage.output_tokens}`,
      );

      if (mensaje.stop_reason === "refusal") {
        throw new ErrorIA("La IA no pudo procesar este material. Prueba con otros apuntes.", 422);
      }
      if (mensaje.stop_reason === "max_tokens") {
        throw new ErrorIA("El material es demasiado largo. Súbelo en partes más pequeñas.", 413);
      }
      if (!mensaje.parsed_output) {
        throw new ErrorIA("La respuesta de la IA llegó incompleta. Inténtalo de nuevo.", 502);
      }
      return mensaje.parsed_output as z.infer<T>;
    } catch (error) {
      if (error instanceof ErrorIA) throw error;
      if (error instanceof Anthropic.AuthenticationError) {
        console.error("[claude] API key inválida o ausente");
        throw new ErrorIA("El servidor no tiene configurada la conexión con la IA.", 500);
      }
      if (error instanceof Anthropic.BadRequestError) {
        console.error("[claude] pedido rechazado:", error.message);
        throw new ErrorIA("No pude leer ese material. Revisa que los archivos no estén dañados.", 400);
      }
      if (error instanceof Anthropic.PermissionDeniedError) {
        console.error("[claude] sin permiso para usar este modelo:", error.message);
        throw new ErrorIA("El servidor no tiene permiso para usar la IA. Avisa a soporte.", 500);
      }
      if (error instanceof Anthropic.NotFoundError) {
        console.error("[claude] modelo no encontrado:", error.message);
        throw new ErrorIA("El servidor no tiene configurada la conexión con la IA.", 500);
      }
      // Solo vale la pena reintentar tropiezos momentáneos del lado de Anthropic: límite de
      // uso, errores 5xx/sobrecarga, o cortes de conexión. Un 403 o 404 no se arregla reintentando.
      const reintentable =
        error instanceof Anthropic.RateLimitError ||
        error instanceof Anthropic.InternalServerError ||
        error instanceof Anthropic.APIConnectionError;
      if (reintentable && intento < INTENTOS) {
        console.error(`[claude] intento ${intento} falló (${error.status ?? "?"}), reintentando:`, error.message);
        await new Promise((resolver) => setTimeout(resolver, 1500 * intento));
        continue;
      }
      if (error instanceof Anthropic.RateLimitError) {
        throw new ErrorIA("Hay mucha gente usando EstudIA ahora. Espera un minuto y vuelve a intentar.", 429);
      }
      if (error instanceof Anthropic.APIError) {
        console.error(`[claude] error ${error.status}:`, error.message);
        throw new ErrorIA("La IA no respondió después de varios intentos. Espera un momento y vuelve a intentar.", 502);
      }
      console.error("[claude] error inesperado:", error);
      throw new ErrorIA("Algo falló procesando tu pedido. Inténtalo de nuevo.", 500);
    }
  }
  throw new ErrorIA("Algo falló procesando tu pedido. Inténtalo de nuevo.", 500);
}
