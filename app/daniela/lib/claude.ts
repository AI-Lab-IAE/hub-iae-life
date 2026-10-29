import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { z } from "zod";

export const MODELO = "claude-opus-5";

const cliente = new Anthropic();

export class ErrorIA extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

type Pedido = {
  sistema: string;
  mensajes: Anthropic.Beta.BetaMessageParam[];
  esfuerzo: "low" | "medium" | "high";
  maxTokens: number;
};

// Hace la llamada con reintentos y convierte los errores de la API en mensajes para el estudiante.
async function llamar(pedido: Pedido, formato?: Anthropic.Beta.BetaJSONOutputFormat) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[taskup] falta la variable ANTHROPIC_API_KEY");
    throw new ErrorIA("El servidor no tiene configurada la conexión con la IA.", 500);
  }

  const INTENTOS = 3;
  for (let intento = 1; intento <= INTENTOS; intento++) {
    try {
      const stream = cliente.beta.messages.stream({
        model: MODELO,
        max_tokens: pedido.maxTokens,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        thinking: { type: "adaptive" },
        system: pedido.sistema,
        output_config: { effort: pedido.esfuerzo, ...(formato ? { format: formato } : {}) },
        messages: pedido.mensajes,
      });
      const mensaje = await stream.finalMessage();
      console.log(
        `[taskup] intento=${intento} stop=${mensaje.stop_reason} in=${mensaje.usage.input_tokens} out=${mensaje.usage.output_tokens}`,
      );

      if (mensaje.stop_reason === "refusal") {
        throw new ErrorIA("La IA no pudo responder a eso. Prueba de otra forma.", 422);
      }
      if (mensaje.stop_reason === "max_tokens") {
        throw new ErrorIA("La respuesta quedó demasiado larga. Prueba con menos material.", 413);
      }
      return mensaje;
    } catch (error) {
      if (error instanceof ErrorIA) throw error;
      if (error instanceof Anthropic.AuthenticationError) {
        console.error("[taskup] API key inválida o ausente");
        throw new ErrorIA("El servidor no tiene configurada la conexión con la IA.", 500);
      }
      if (error instanceof Anthropic.BadRequestError) {
        console.error("[taskup] pedido rechazado:", error.message);
        throw new ErrorIA("No pude leer ese material. Prueba con otra imagen o con texto.", 400);
      }
      const reintentable = error instanceof Anthropic.RateLimitError || error instanceof Anthropic.APIError;
      if (reintentable && intento < INTENTOS) {
        console.error(`[taskup] intento ${intento} falló (${error.status ?? "?"}), reintentando:`, error.message);
        await new Promise((resolver) => setTimeout(resolver, 1500 * intento));
        continue;
      }
      if (error instanceof Anthropic.APIError) {
        console.error(`[taskup] error ${error.status}:`, error.message);
        throw new ErrorIA("La IA no respondió. Espera un momento y vuelve a intentar.", 502);
      }
      console.error("[taskup] error inesperado:", error);
      throw new ErrorIA("Algo falló procesando tu pedido. Inténtalo de nuevo.", 500);
    }
  }
  throw new ErrorIA("Algo falló procesando tu pedido. Inténtalo de nuevo.", 500);
}

export async function pedirTexto(pedido: Pedido): Promise<string> {
  const mensaje = await llamar(pedido);
  return mensaje.content
    .map((bloque) => (bloque.type === "text" ? bloque.text : ""))
    .join("\n")
    .trim();
}

export async function pedirJSON<T extends z.ZodType>(pedido: Pedido & { esquema: T }): Promise<z.infer<T>> {
  const mensaje = await llamar(pedido, betaZodOutputFormat(pedido.esquema));
  if (!mensaje.parsed_output) {
    throw new ErrorIA("La respuesta de la IA llegó incompleta. Inténtalo de nuevo.", 502);
  }
  return mensaje.parsed_output as z.infer<T>;
}
