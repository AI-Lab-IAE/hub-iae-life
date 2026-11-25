// Tipos que comparten el formulario, los correos y el historial de AvisIA.
import type { Clase, Dia } from "./horario";

export type MotivoId = "enfermedad" | "cita" | "competencia" | "viaje" | "otro";

// Lo que el estudiante reporta en el formulario.
export type Ausencia = {
  nombre: string;
  fecha: string; // "AAAA-MM-DD"
  dia: Dia;
  clases: Clase[];
  motivo: MotivoId | null; // opcional
  detalle: string; // texto libre, opcional
};

// De más formal a más relajado (idea de Jonathan).
export type Tono = "formal" | "neutral" | "estandar" | "casual";
export type Largo = "corto" | "medio" | "largo";

// Cómo está escrito cada correo: con estas opciones siempre sale el mismo texto.
export type Opciones = {
  tono: Tono;
  largo: Largo;
  frase: number; // qué frase del motivo se usa
  cierre: number; // qué cierre se usa
};

// Un correo por profesor, con todas sus clases perdidas ese día.
export type Correo = Opciones & {
  id: string; // el correo del profesor
  profesor: { nombre: string; correo: string };
  clases: Clase[];
  asunto: string;
  cuerpo: string;
};

// Lo que queda en el historial al terminar.
export type Registro = {
  id: string;
  fecha: string; // "AAAA-MM-DD" de la ausencia
  motivo: string;
  cc: string;
  correos: { profesor: string; materias: string; asunto: string; cuerpo: string }[];
  creado: number; // Date.now()
};
