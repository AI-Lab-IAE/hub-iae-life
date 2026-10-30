import type { ClassItem, Length, Student, Tone } from "./tipos";

/* ---------- Datos base ---------- */
// Todos los datos de ejemplo son inventados. Cada estudiante pone los suyos en Perfil y Horario,
// y se guardan solo en su navegador.

export const DEFAULT_STUDENT: Student = {
  name: "Estudiante Prueba",
  grade: "11°",
  school: "Instituto Alberto Einstein",
  email: "estudiante.prueba@ejemplo.edu",
  parentEmail: "", // se agrega en Perfil
};

// Dominio con el que se autocompletan los correos de los profesores.
export const SCHOOL_DOMAIN = "ejemplo.edu";

/* Días de la semana: números de JavaScript (1 = lunes ... 5 = viernes) */
export const DAYS = [
  { n: 1, short: "Lun", long: "Lunes" },
  { n: 2, short: "Mar", long: "Martes" },
  { n: 3, short: "Mié", long: "Miércoles" },
  { n: 4, short: "Jue", long: "Jueves" },
  { n: 5, short: "Vie", long: "Viernes" },
];
export const ALL_WEEKDAYS = [1, 2, 3, 4, 5];

export const DEFAULT_SCHEDULE: ClassItem[] = [
  { id: "s1", days: [1, 2, 3, 4, 5], start: "08:00", end: "08:50", startLabel: "8:00 AM", endLabel: "8:50 AM", subject: "Matemáticas", teacher: "Profesor Prueba 1", teacherEmail: "profesor1@ejemplo.edu" },
  { id: "s2", days: [1, 3, 5], start: "09:00", end: "09:50", startLabel: "9:00 AM", endLabel: "9:50 AM", subject: "Inglés", teacher: "Profesora Prueba 2", teacherEmail: "profesora2@ejemplo.edu" },
  { id: "s3", days: [1, 2, 4], start: "10:00", end: "10:50", startLabel: "10:00 AM", endLabel: "10:50 AM", subject: "Historia", teacher: "Profesor Prueba 3", teacherEmail: "profesor3@ejemplo.edu" },
  { id: "s4", days: [1, 3, 5], start: "11:00", end: "11:50", startLabel: "11:00 AM", endLabel: "11:50 AM", subject: "Química", teacher: "Profesora Prueba 4", teacherEmail: "profesora4@ejemplo.edu" },
  { id: "s5", days: [1, 2, 3, 4, 5], start: "12:00", end: "12:50", startLabel: "12:00 PM", endLabel: "12:50 PM", subject: "Español", teacher: "Profesora Prueba 5", teacherEmail: "profesora5@ejemplo.edu" },
  { id: "s6", days: [2, 4], start: "13:00", end: "13:50", startLabel: "1:00 PM", endLabel: "1:50 PM", subject: "Educación Física", teacher: "Profesor Prueba 6", teacherEmail: "profesor6@ejemplo.edu" },
  { id: "s7", days: [1, 3, 5], start: "14:00", end: "15:30", startLabel: "2:00 PM", endLabel: "3:30 PM", subject: "Biología", teacher: "Profesora Prueba 7", teacherEmail: "profesora7@ejemplo.edu" },
];

export const REASONS = [
  { id: "actividad", label: "Actividad escolar" },
  { id: "escolar", label: "Competencia escolar" },
  { id: "deportiva", label: "Competencia deportiva" },
  { id: "academico", label: "Evento académico" },
  { id: "enfermedad", label: "Enfermedad" },
  { id: "cita", label: "Cita médica" },
  { id: "viaje", label: "Viaje familiar" },
  { id: "familiar", label: "Motivo familiar" },
  { id: "otro", label: "Otro" },
];

export const REASON_PHRASES: Record<string, string[]> = {
  actividad: ["estaré participando en una actividad oficial del colegio", "tengo un compromiso oficial del colegio"],
  deportiva: ["estaré representando al colegio en una competencia deportiva", "voy a competir representando al colegio"],
  enfermedad: ["no me estoy sintiendo bien", "no me encuentro bien de salud"],
  cita: ["tengo una cita médica programada", "debo asistir a una cita médica"],
  academico: ["estaré participando en un evento académico", "tengo un compromiso académico fuera del salón"],
  escolar: [
    "estaré representando al colegio en una competencia escolar",
    "voy a participar en una competencia escolar en nombre del colegio",
  ],
  viaje: ["estaré de viaje con mi familia", "tengo un viaje familiar programado"],
  // Tema sensible: se mantiene discreto, sin dar detalles.
  familiar: ["tengo un asunto familiar que requiere mi atención", "debo atender un asunto familiar"],
  otro: ["surgió un compromiso que no pude reprogramar"],
};

export const CLOSINGS = [
  "¿Podría indicarme si hay algún trabajo o contenido que deba recuperar?",
  "Le agradecería si me puede compartir qué material voy a perder para ponerme al día.",
  "Quedo atento a cualquier tarea o material que deba revisar al volver.",
];

// De más formal a más informal
export const TONE_ORDER: { id: Tone; label: string }[] = [
  { id: "formal", label: "Formal" },
  { id: "neutral", label: "Neutral" },
  { id: "standard", label: "Cordial" },
  { id: "casual", label: "Casual" },
];
export const LENGTH_ORDER: { id: Length; label: string }[] = [
  { id: "short", label: "Corto" },
  { id: "normal", label: "Normal" },
  { id: "long", label: "Largo" },
];
