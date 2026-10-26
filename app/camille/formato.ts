// Convierte una fecha "2026-11-10" en texto como "10 de noviembre de 2026".
export function formatearFecha(fecha: string) {
  return new Date(`${fecha}T12:00:00`).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
