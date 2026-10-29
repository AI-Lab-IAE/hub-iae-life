// Convierte una fecha "2026-11-10" en texto como "10 de noviembre de 2026".
export function formatearFecha(fecha: string) {
  return new Date(`${fecha}T12:00:00`).toLocaleDateString("es-PA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Separa una fecha "2026-11-10" en día ("10") y mes corto ("nov"), para las insignias de fecha.
export function diaYMes(fecha: string) {
  const d = new Date(`${fecha}T12:00:00`);
  return {
    dia: d.getDate(),
    mes: d.toLocaleDateString("es-PA", { month: "short" }).replace(".", ""),
  };
}
