import type { Ausencia } from "../components/FormularioAusencia";
import type { Clase, Profesor } from "./horario";

export type Correo = {
  profesor: Profesor;
  asunto: string;
  cuerpo: string;
};

// "2026-10-30" -> "viernes 30 de octubre"
export function fechaEnPalabras(fecha: string): string {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const d = new Date(anio, mes - 1, dia);
  const nombreDia = d.toLocaleDateString("es", { weekday: "long" });
  const nombreMes = d.toLocaleDateString("es", { month: "long" });
  return `${nombreDia} ${dia} de ${nombreMes}`;
}

// ["a", "b", "c"] -> "a, b y c"
function unir(partes: string[]): string {
  if (partes.length <= 1) return partes.join("");
  return `${partes.slice(0, -1).join(", ")} y ${partes[partes.length - 1]}`;
}

// Junta las clases de cada profesor, para mandarle un solo correo aunque pierdas varias horas con él.
function agruparPorProfesor(clases: Clase[]): Map<string, Clase[]> {
  const grupos = new Map<string, Clase[]>();
  for (const clase of clases) {
    const clave = clase.profesor.correo;
    grupos.set(clave, [...(grupos.get(clave) ?? []), clase]);
  }
  return grupos;
}

function escribirCorreo(clases: Clase[], ausencia: Ausencia): Correo {
  const profesor = clases[0].profesor;
  const fecha = fechaEnPalabras(ausencia.fecha);
  const materias = unir([...new Set(clases.map((c) => c.materia))]);
  const horas = unir(clases.map((c) => `${c.inicio} – ${c.fin}`));
  const varias = clases.length > 1;

  const cuerpo = `Buenos días, ${profesor.nombre}:

Le escribo para avisarle que el ${fecha} no podré asistir a ${varias ? "sus clases" : "su clase"} de ${materias} (${horas}).

Motivo: ${ausencia.motivo}

Me pondré al día con lo que vean en clase. Si hay alguna tarea o material que deba revisar, le agradecería que me lo hiciera saber.

Saludos,
${ausencia.nombre}`;

  return {
    profesor,
    asunto: `Ausencia el ${fecha} – ${ausencia.nombre}`,
    cuerpo,
  };
}

// Un correo por cada profesor cuyas clases se pierden, en el orden del horario.
export function generarCorreos(ausencia: Ausencia): Correo[] {
  return [...agruparPorProfesor(ausencia.clases).values()].map((clases) => escribirCorreo(clases, ausencia));
}
