"use client";

// Horario semanal de IAE LIFE. Hoy, Ausencia y Tareas dependen de él.
// Datos de ejemplo de Jonathan (docs/datos.md): profesores y correos INVENTADOS.
// Cada estudiante puede cambiar sus materias; los cambios se guardan solo en este navegador.
import { useSyncExternalStore } from "react";

export const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] as const;
export const DIAS_CORTOS = ["Lun", "Mar", "Mié", "Jue", "Vie"] as const;

export type Materia = { nombre: string; profesor: string; correo: string };

export const MATERIAS: Materia[] = [
  { nombre: "Matemáticas", profesor: "Carlos Ejemplo", correo: "carlos.ejemplo@iae.edu" },
  { nombre: "Español", profesor: "Laura Ejemplo", correo: "laura.ejemplo@iae.edu" },
  { nombre: "Inglés", profesor: "Andrés Ejemplo", correo: "andres.ejemplo@iae.edu" },
  { nombre: "Física", profesor: "Elena Ejemplo", correo: "elena.ejemplo@iae.edu" },
  { nombre: "Química", profesor: "Pablo Ejemplo", correo: "pablo.ejemplo@iae.edu" },
  { nombre: "Historia", profesor: "Marta Ejemplo", correo: "marta.ejemplo@iae.edu" },
  { nombre: "Hebreo", profesor: "David Ejemplo", correo: "david.ejemplo@iae.edu" },
  { nombre: "Ed. Física", profesor: "Paula Ejemplo", correo: "paula.ejemplo@iae.edu" },
];

export function materia(nombre: string | null): Materia | null {
  return MATERIAS.find((m) => m.nombre === nombre) ?? null;
}

export type Bloque = { desde: string; hasta: string };

export const BLOQUES: Bloque[] = [
  { desde: "8:05", hasta: "8:45" },
  { desde: "8:50", hasta: "9:30" },
  { desde: "9:55", hasta: "10:35" },
  { desde: "10:40", hasta: "11:20" },
  { desde: "11:25", hasta: "12:05" },
  { desde: "12:10", hasta: "12:50" },
  { desde: "13:30", hasta: "14:05" },
  { desde: "14:10", hasta: "14:50" },
  { desde: "14:55", hasta: "15:30" },
];

// Pausas que se muestran entre bloques (después del índice indicado).
export const PAUSAS: Record<number, string> = {
  1: "Recreo · 9:30–9:55",
  5: "Almuerzo · 12:50–13:25",
};

export const NOTA_DIA = "Rezo de 7:15 a 8:00. El viernes se sale a las 12:50.";

// HORARIO_EJEMPLO[bloque][día] = nombre de la materia (null = no hay clase).
const M = "Matemáticas", E = "Español", I = "Inglés", F = "Física", Q = "Química", H = "Historia", He = "Hebreo", EF = "Ed. Física";
export type Horario = (string | null)[][];
export const HORARIO_EJEMPLO: Horario = [
  [M, E, I, M, He],
  [M, F, He, E, M],
  [E, I, M, Q, I],
  [I, H, F, I, E],
  [F, M, Q, H, F],
  [He, Q, E, He, H],
  [H, He, EF, F, null],
  [Q, EF, H, EF, null],
  [EF, E, I, M, null],
];

// El viernes solo hay clases hasta las 12:50 (bloques 0 a 5).
export function hayBloque(bloque: number, dia: number) {
  return !(dia === 4 && bloque >= 6);
}

export function aMinutos(hora: string) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

// --- Guardado en el navegador ---
const CLAVE = "iae-life:horario";
const EVENTO = "iae-life:horario";
let cacheTexto: string | null | undefined;
let cacheHorario: Horario = HORARIO_EJEMPLO;
let enMemoria: string | null = null;
let usarMemoria = false;

function valido(h: unknown): h is Horario {
  return (
    Array.isArray(h) &&
    h.length === BLOQUES.length &&
    h.every(
      (fila) =>
        Array.isArray(fila) && fila.length === DIAS.length && fila.every((c) => c === null || materia(c) !== null),
    )
  );
}

function obtener(): Horario {
  let texto = enMemoria;
  if (!usarMemoria) {
    try {
      texto = localStorage.getItem(CLAVE);
    } catch {
      usarMemoria = true;
    }
  }
  if (texto !== cacheTexto) {
    cacheTexto = texto;
    let h: unknown = null;
    try {
      h = texto ? JSON.parse(texto) : null;
    } catch {
      h = null;
    }
    cacheHorario = valido(h) ? h : HORARIO_EJEMPLO;
  }
  return cacheHorario;
}

function suscribir(aviso: () => void) {
  const alCambiar = (e: Event) => {
    if (e instanceof StorageEvent && e.key !== CLAVE) return;
    aviso();
  };
  window.addEventListener("storage", alCambiar);
  window.addEventListener(EVENTO, alCambiar);
  return () => {
    window.removeEventListener("storage", alCambiar);
    window.removeEventListener(EVENTO, alCambiar);
  };
}

// Devuelve true si quedó guardado en el navegador; false si solo en memoria.
export function guardarHorario(h: Horario | null): boolean {
  const texto = h ? JSON.stringify(h) : null;
  enMemoria = texto;
  let ok = false;
  if (!usarMemoria) {
    try {
      if (texto) localStorage.setItem(CLAVE, texto);
      else localStorage.removeItem(CLAVE);
      ok = true;
    } catch {
      usarMemoria = true;
    }
  }
  window.dispatchEvent(new Event(EVENTO));
  return ok;
}

// null mientras carga (en el servidor).
export function useHorario(): Horario | null {
  return useSyncExternalStore(suscribir, obtener, () => null);
}

export function esEjemplo(h: Horario) {
  return JSON.stringify(h) === JSON.stringify(HORARIO_EJEMPLO);
}
