import "server-only";
import type { z } from "zod";
import { ErrorIA } from "./claude";
import { ipDe, permitido } from "./limite";

export function errorJSON(mensaje: string, status: number) {
  return Response.json({ error: mensaje }, { status });
}

export async function manejar<T extends z.ZodType>(
  request: Request,
  opciones: { ruta: string; maximoPorHora: number; esquema: T },
  trabajo: (datos: z.infer<T>) => Promise<unknown>,
) {
  if (!permitido(`${opciones.ruta}:${ipDe(request)}`, opciones.maximoPorHora)) {
    return errorJSON("Llegaste al límite de uso por esta hora. Vuelve a intentar más tarde.", 429);
  }

  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return errorJSON("El pedido llegó vacío o dañado. Si subiste archivos muy pesados, prueba con menos.", 400);
  }

  const validado = opciones.esquema.safeParse(cuerpo);
  if (!validado.success) {
    console.error(`[${opciones.ruta}] pedido inválido:`, validado.error.issues.slice(0, 3));
    return errorJSON("El pedido no tiene el formato esperado.", 400);
  }

  try {
    const resultado = await trabajo(validado.data);
    return resultado instanceof Response ? resultado : Response.json(resultado);
  } catch (error) {
    if (error instanceof ErrorIA) return errorJSON(error.message, error.status);
    console.error(`[${opciones.ruta}] error inesperado:`, error);
    return errorJSON("Algo falló en el servidor. Inténtalo de nuevo.", 500);
  }
}
