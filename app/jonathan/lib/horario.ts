import { ALL_WEEKDAYS, DAYS, SCHOOL_DOMAIN } from "./datos";
import { dateRange, isoToDate, labelDate, timeToMinutes } from "./tiempo";
import type { ClassItem, Occurrence, Report, TeacherGroup } from "./tipos";

export function normalizeSchoolEmail(raw: string): string {
  const val = (raw || "").trim();
  if (!val) return "";
  if (val.includes("@")) return val;
  return `${val}@${SCHOOL_DOMAIN}`;
}

/* Genera el usuario de correo (sin @dominio) a partir del nombre del profesor:
   "Ana Pérez" -> "ana.perez"; "Mr. Pérez" -> "perez"; "Coach Ruiz" -> "ruiz". */
const TEACHER_TITLES = /^(mr|mrs|ms|miss|mx|dr|dra|prof|profe|profesor|profesora|coach|sr|sra|srta|lic)\.?\s+/i;
function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}
export function emailUserFromTeacherName(name: string): string {
  let clean = (name || "").trim().replace(TEACHER_TITLES, "").trim();
  clean = stripAccents(clean)
    .toLowerCase()
    .replace(/[^a-z\s-]/g, "");
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0];
  return `${words[0]}.${words[words.length - 1]}`;
}

/* Los horarios guardados sin "days" se toman como clases de lunes a viernes. */
export function normalizeSchedule(list: ClassItem[]): ClassItem[] {
  return list.map((c) => ({
    ...c,
    days: Array.isArray(c.days) && c.days.length ? c.days : ALL_WEEKDAYS,
  }));
}
export function sortSchedule(list: ClassItem[]): ClassItem[] {
  return [...list].sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
}
export function classDays(s: ClassItem): number[] {
  return Array.isArray(s.days) && s.days.length ? s.days : ALL_WEEKDAYS;
}
export function classesOnDay(schedule: ClassItem[], weekday: number): ClassItem[] {
  return sortSchedule(schedule.filter((s) => classDays(s).includes(weekday)));
}
export function daysSummary(days: number[]): string {
  const list = (days || []).slice().sort((a, b) => a - b);
  if (list.length === 5) return "Lun–Vie";
  return list.map((n) => (DAYS.find((d) => d.n === n) || { short: "?" }).short).join(" · ");
}

/* Cruce automático: fecha(s) + horas de ausencia + horario semanal
   -> clases que el estudiante realmente va a perder */
export function computeOccurrences(schedule: ClassItem[], report: Report): Occurrence[] {
  const out: Occurrence[] = [];
  dateRange(report.date, report.endDate).forEach((iso) => {
    const weekday = isoToDate(iso).getDay();
    schedule.forEach((s) => {
      if (!classDays(s).includes(weekday)) return;
      if (!report.allDay) {
        const from = timeToMinutes(report.fromTime);
        const to = timeToMinutes(report.toTime);
        if (!(timeToMinutes(s.start) < to && timeToMinutes(s.end) > from)) return;
      }
      out.push({ ...s, occId: `${s.id}_${iso}`, dateISO: iso, dateText: labelDate(iso) });
    });
  });
  out.sort((a, b) => {
    if (a.dateISO !== b.dateISO) return a.dateISO < b.dateISO ? -1 : 1;
    return timeToMinutes(a.start) - timeToMinutes(b.start);
  });
  return out;
}

/* Un solo correo por profesor, aunque pierda varias de sus clases */
export function groupByTeacher(occurrences: Occurrence[]): TeacherGroup[] {
  const map = new Map<string, Omit<TeacherGroup, "subject">>();
  occurrences.forEach((o) => {
    const key = (o.teacherEmail || o.teacher).toLowerCase();
    if (!map.has(key)) map.set(key, { id: key, teacher: o.teacher, teacherEmail: o.teacherEmail, occurrences: [] });
    map.get(key)!.occurrences.push(o);
  });
  return Array.from(map.values()).map((g) => ({
    ...g,
    subject: Array.from(new Set(g.occurrences.map((o) => o.subject))).join(" / "),
  }));
}

/* Profesores únicos del horario (para la pantalla Perfil) */
export function uniqueTeachers(schedule: ClassItem[]): { teacher: string; teacherEmail: string }[] {
  const map = new Map<string, { teacher: string; teacherEmail: string }>();
  schedule.forEach((s) => {
    const key = (s.teacherEmail || s.teacher).toLowerCase();
    if (!map.has(key)) map.set(key, { teacher: s.teacher, teacherEmail: s.teacherEmail });
  });
  return Array.from(map.values());
}

/* Próxima clase de la semana (hoy si aún queda alguna; si no, el siguiente día con clases) */
export function findNextClass(schedule: ClassItem[], now: Date) {
  const nowMin = now.getHours() * 60 + now.getMinutes();
  for (let off = 0; off < 8; off++) {
    const d = new Date(now);
    d.setDate(d.getDate() + off);
    const list = classesOnDay(schedule, d.getDay());
    const cand = off === 0 ? list.find((s) => timeToMinutes(s.start) >= nowMin) : list[0];
    if (cand) return { cls: cand, off, weekday: d.getDay() };
  }
  return null;
}
