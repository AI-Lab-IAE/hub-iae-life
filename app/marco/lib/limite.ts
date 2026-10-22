import "server-only";

// En memoria por instancia: es aproximado (se reinicia en cold start). El tope real de gasto
// se configura en la consola de Anthropic.
const registros = new Map<string, number[]>();
const HORA = 60 * 60 * 1000;

export function ipDe(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export function permitido(clave: string, maximoPorHora: number): boolean {
  const ahora = Date.now();
  const recientes = (registros.get(clave) ?? []).filter((t) => ahora - t < HORA);
  if (recientes.length >= maximoPorHora) {
    registros.set(clave, recientes);
    return false;
  }
  recientes.push(ahora);
  registros.set(clave, recientes);
  return true;
}
