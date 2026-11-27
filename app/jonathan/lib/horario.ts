// Faltar usa el único horario de IAE LIFE (app/_life/horario.ts): aquí solo se convierte a clases de un día.
// Los profesores y correos de ese horario son de ejemplo (inventados).
import { BLOQUES, hayBloque, materia, type Horario as HorarioLife } from "../../_life/horario";

export type Dia = "lunes" | "martes" | "miercoles" | "jueves" | "viernes";

export type Profesor = {
  nombre: string;
  correo: string;
};

export type Clase = {
  inicio: string; // formato "HH:MM"
  fin: string;
  materia: string;
  profesor: Profesor;
};

export const ORDEN_DIAS: Dia[] = ["lunes", "martes", "miercoles", "jueves", "viernes"];

// Convierte el horario de Horario de IAE LIFE (bloques × días) en las clases de un día.
export function clasesDeIAELife(horario: HorarioLife, dia: Dia): Clase[] {
  const d = ORDEN_DIAS.indexOf(dia); // 0 = lunes … 4 = viernes
  const clases: Clase[] = [];
  BLOQUES.forEach((b, i) => {
    if (!hayBloque(i, d)) return;
    const m = materia(horario[i][d]);
    if (!m) return;
    clases.push({
      inicio: b.desde,
      fin: b.hasta,
      materia: m.nombre,
      profesor: { nombre: m.profesor, correo: m.correo },
    });
  });
  return clases;
}
