// Horario semanal de ejemplo. Los profesores y correos son inventados.
// Solo se usa cuando no hay cuenta: con cuenta de estudiante, AvisIA lee el horario real de IAE LIFE.
// Para cambiar una clase, edita la lista del día correspondiente.
import { BLOQUES, hayBloque, materia, type Horario as HorarioLife } from "../../_life/horario";

export type Dia = "lunes" | "martes" | "miercoles" | "jueves" | "viernes";

export type Profesor = {
  nombre: string;
  correo: string;
};

export type Clase = {
  inicio: string; // formato "HH:MM"
  fin: string;
  materia: string;
  profesor: Profesor;
};

// Un profesor por materia.
const PROFESORES = {
  matematicas: { nombre: "Profesor Prueba 1", correo: "profesor1@ejemplo.com" },
  espanol: { nombre: "Profesora Prueba 2", correo: "profesora2@ejemplo.com" },
  ingles: { nombre: "Profesor Prueba 3", correo: "profesor3@ejemplo.com" },
  ciencias: { nombre: "Profesora Prueba 4", correo: "profesora4@ejemplo.com" },
  historia: { nombre: "Profesor Prueba 5", correo: "profesor5@ejemplo.com" },
  hebreo: { nombre: "Profesora Prueba 6", correo: "profesora6@ejemplo.com" },
  educacionFisica: { nombre: "Profesor Prueba 7", correo: "profesor7@ejemplo.com" },
  informatica: { nombre: "Profesora Prueba 8", correo: "profesora8@ejemplo.com" },
} satisfies Record<string, Profesor>;

// Las 6 horas de clase del día.
const HORAS = [
  { inicio: "07:00", fin: "07:45" },
  { inicio: "07:45", fin: "08:30" },
  { inicio: "08:30", fin: "09:15" },
  { inicio: "09:45", fin: "10:30" },
  { inicio: "10:30", fin: "11:15" },
  { inicio: "11:15", fin: "12:00" },
];

type ClaveMateria = keyof typeof PROFESORES;

const NOMBRES_MATERIAS: Record<ClaveMateria, string> = {
  matematicas: "Matemáticas",
  espanol: "Español",
  ingles: "Inglés",
  ciencias: "Ciencias",
  historia: "Historia",
  hebreo: "Hebreo",
  educacionFisica: "Educación Física",
  informatica: "Informática",
};

// Arma las clases de un día a partir de sus materias, en el orden de HORAS.
function dia(materias: ClaveMateria[]): Clase[] {
  return materias.map((clave, i) => ({
    ...HORAS[i],
    materia: NOMBRES_MATERIAS[clave],
    profesor: PROFESORES[clave],
  }));
}

export const HORARIO: Record<Dia, Clase[]> = {
  lunes: dia(["matematicas", "matematicas", "espanol", "ingles", "ciencias", "hebreo"]),
  martes: dia(["historia", "ciencias", "matematicas", "educacionFisica", "espanol", "ingles"]),
  miercoles: dia(["ingles", "hebreo", "historia", "matematicas", "informatica", "ciencias"]),
  jueves: dia(["espanol", "matematicas", "ciencias", "ingles", "historia", "educacionFisica"]),
  viernes: dia(["hebreo", "informatica", "matematicas", "espanol", "ciencias", "historia"]),
};

export const ORDEN_DIAS: Dia[] = ["lunes", "martes", "miercoles", "jueves", "viernes"];

// Convierte el horario de "Mi horario" de IAE LIFE (bloques × días) en las clases de un día.
export function clasesDeIAELife(horario: HorarioLife, dia: Dia): Clase[] {
  const d = ORDEN_DIAS.indexOf(dia); // 0 = lunes … 4 = viernes
  const clases: Clase[] = [];
  BLOQUES.forEach((b, i) => {
    if (!hayBloque(i, d)) return;
    const m = materia(horario[i][d]);
    if (!m) return;
    clases.push({
      inicio: b.desde,
      fin: b.hasta,
      materia: m.nombre,
      profesor: { nombre: m.profesor, correo: m.correo },
    });
  });
  return clases;
}
