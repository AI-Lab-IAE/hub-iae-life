import { useSyncExternalStore } from "react";

const sinCambios = () => () => {};

// Fecha de hoy en este dispositivo, como "2026-11-10". En el servidor es null,
// así la página no muestra una fecha distinta a la del celular.
function fechaLocal() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

export function useHoy() {
  return useSyncExternalStore(sinCambios, fechaLocal, () => null);
}

// Días que faltan desde hoy hasta una fecha (negativo si ya pasó).
export function diasHasta(hoy: string, fecha: string) {
  const dia = 24 * 60 * 60 * 1000;
  return Math.round((Date.parse(`${fecha}T12:00:00`) - Date.parse(`${hoy}T12:00:00`)) / dia);
}

export function textoFaltan(dias: number) {
  if (dias === 0) return "Hoy";
  if (dias === 1) return "Mañana";
  if (dias < 0) return "Ya pasó";
  return `En ${dias} días`;
}
