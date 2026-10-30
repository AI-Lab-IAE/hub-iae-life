// Tipos de datos que usa AvisIA.

export type Student = {
  name: string;
  grade: string;
  school: string;
  email: string;
  parentEmail: string;
};

/* Una clase del horario semanal. days usa los números de JavaScript (1 = lunes ... 5 = viernes). */
export type ClassItem = {
  id: string;
  days: number[];
  start: string; // "HH:MM"
  end: string;
  startLabel: string; // "8:00 AM"
  endLabel: string;
  subject: string;
  teacher: string;
  teacherEmail: string;
};

export type Report = {
  date: string; // "AAAA-MM-DD"
  endDate: string;
  dateLabel: string;
  allDay: boolean;
  fromTime: string;
  toTime: string;
  timeLabel: string;
  reasonId: string;
  reasonLabel: string;
  extra: string;
};

/* Una clase que se pierde en una fecha concreta */
export type Occurrence = ClassItem & {
  occId: string;
  dateISO: string;
  dateText: string;
};

/* Todas las clases que se pierden con un mismo profesor (un solo correo) */
export type TeacherGroup = {
  id: string;
  teacher: string;
  teacherEmail: string;
  occurrences: Occurrence[];
  subject: string;
};

export type Tone = "formal" | "neutral" | "standard" | "casual";
export type Length = "short" | "normal" | "long";

export type EmailOptions = {
  tone: Tone;
  length: Length;
  phraseIdx: number;
  closingIdx: number;
};

export type EmailState = EmailOptions & {
  subject: string;
  body: string;
};

export type SentEmail = {
  teacher: string;
  subject: string;
  body: string;
  cc: string;
};

export type HistoryEntry = {
  id: string;
  dateLabel: string;
  timeLabel: string;
  reasonLabel: string;
  teachers: SentEmail[];
};

export type Page = "inicio" | "reportar" | "historial" | "horario" | "perfil";
