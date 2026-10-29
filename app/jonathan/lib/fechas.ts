import type { Dia } from "./horario";

const DIAS_POR_NUMERO: (Dia | null)[] = [null, "lunes", "martes", "miercoles", "jueves", "viernes", null];

export const NOMBRES_DIAS: Record<Dia, string> = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
};

// Convierte "AAAA-MM-DD" (el valor de un <input type="date">) en el día de clases.
// Devuelve null si es sábado o domingo.
export function diaDeFecha(fecha: string): Dia | null {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  // Se arma la fecha en hora local para que no cambie de día por la zona horaria.
  return DIAS_POR_NUMERO[new Date(anio, mes - 1, dia).getDay()];
}
