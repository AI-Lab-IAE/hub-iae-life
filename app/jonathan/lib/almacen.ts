import { DEFAULT_SCHEDULE, DEFAULT_STUDENT } from "./datos";
import { normalizeSchedule } from "./horario";
import type { ClassItem, HistoryEntry, Student } from "./tipos";

/* ---------- Persistencia: todo se guarda solo en el navegador del estudiante ---------- */

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function loadStudent(): Student {
  return { ...DEFAULT_STUDENT, ...load<Partial<Student>>("avisia_student", {}) };
}
export function saveStudent(s: Student) {
  save("avisia_student", s);
}

export function loadSchedule(): ClassItem[] {
  return normalizeSchedule(load("avisia_schedule", DEFAULT_SCHEDULE));
}
export function saveSchedule(s: ClassItem[]) {
  save("avisia_schedule", s);
}

export function loadHistory(): HistoryEntry[] {
  return load<HistoryEntry[]>("avisia_history", []);
}
export function saveHistory(h: HistoryEntry[]) {
  save("avisia_history", h);
}
