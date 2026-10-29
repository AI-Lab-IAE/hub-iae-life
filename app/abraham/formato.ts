const formato = new Intl.DateTimeFormat("es-PA", {
  timeZone: "America/Panama",
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

/** "27 oct, 8:05 a. m." en hora de Panamá. */
export function fechaHora(iso: string): string {
  return formato.format(new Date(iso));
}
