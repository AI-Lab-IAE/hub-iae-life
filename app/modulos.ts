// Lista de módulos del HUB. La mantiene Jose David.
// Cada estudiante edita los datos de su tarjeta en app/<nombre>/info.ts.
import { info as abraham } from "./abraham/info";
import { info as camille } from "./camille/info";
import { info as daniela } from "./daniela/info";
import { info as jonathan } from "./jonathan/info";
import { info as marco } from "./marco/info";

export const modulos = [
  { slug: "marco", ...marco },
  { slug: "camille", ...camille },
  { slug: "abraham", ...abraham },
  { slug: "jonathan", ...jonathan },
  { slug: "daniela", ...daniela },
];

const TEXTO_PLANTILLA = "Escribe aquí";

// Una tarjeta está completa cuando el estudiante ya cambió el texto de la plantilla en su info.ts.
export function tarjetaCompleta(m: { proyecto: string; descripcion: string }) {
  return m.proyecto !== "Por definir" && !m.descripcion.startsWith(TEXTO_PLANTILLA);
}
