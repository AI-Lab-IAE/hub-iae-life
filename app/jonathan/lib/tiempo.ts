/* ---------- Horas ---------- */

export function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
export function minutesToTimeStr(min: number): string {
  const h = Math.floor(min / 60),
    m = min % 60;
  return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
}

export function formatTimeLabel(t: string): string {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

/* ---------- Geometría del calendario semanal (arrastrar y soltar) ---------- */
export const CAL_START_MIN = 7 * 60; // 7:00 AM
export const CAL_END_MIN = 15 * 60 + 30; // 3:30 PM
export const CAL_PX_PER_MIN = 1.5;
export const CAL_HEIGHT = (CAL_END_MIN - CAL_START_MIN) * CAL_PX_PER_MIN;
export function calMinToY(min: number) {
  return (min - CAL_START_MIN) * CAL_PX_PER_MIN;
}
export function calYToMin(y: number) {
  return CAL_START_MIN + y / CAL_PX_PER_MIN;
}
export function calSnap5(min: number) {
  return Math.round(min / 5) * 5;
}
export function calClampMin(min: number) {
  return Math.max(CAL_START_MIN, Math.min(CAL_END_MIN, min));
}

/* ---------- Fechas ---------- */

export const WEEKDAYS_ES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MONTHS_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export function isoToDate(iso: string): Date {
  return new Date(iso + "T00:00:00");
}
export function dateToIso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function todayIso(): string {
  return dateToIso(new Date());
}
export function addDaysIso(iso: string, n: number): string {
  const d = isoToDate(iso);
  d.setDate(d.getDate() + n);
  return dateToIso(d);
}
export function labelDate(iso: string): string {
  const d = isoToDate(iso);
  return `${WEEKDAYS_ES[d.getDay()]} ${d.getDate()} de ${MONTHS_ES[d.getMonth()]}`;
}
export function labelDateLong(iso: string): string {
  const d = isoToDate(iso);
  return `${d.getDate()} de ${MONTHS_ES[d.getMonth()]} de ${d.getFullYear()}`;
}
export function dateRange(startIso: string, endIso: string): string[] {
  if (!endIso || endIso <= startIso) return [startIso];
  const out: string[] = [];
  const d = isoToDate(startIso);
  const end = isoToDate(endIso);
  let guard = 0;
  while (d <= end && guard < 45) {
    out.push(dateToIso(d));
    d.setDate(d.getDate() + 1);
    guard++;
  }
  return out;
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
