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
  5: "Almuerzo · 12:50–13:30",
};

export const NOTA_DIA = "Rezo de 7:15 a 8:00. El viernes se sale a las 12:50.";

// HORARIO_EJEMPLO[bloque][día] = nombre de la materia (null = no hay clase).
const M = "Matemáticas",
  E = "Español",
  I = "Inglés",
  F = "Física",
  Q = "Química",
  H = "Historia",
  He = "Hebreo",
  EF = "Ed. Física";
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

// --- Guardado en el navegador, uno por cuenta ---
const EVENTO = "iae-life:horario";
const clave = (correo: string) => `iae-life:horario:${correo}`;
const cache = new Map<string, { texto: string | null; horario: Horario }>();
const enMemoria = new Map<string, string | null>();
let usarMemoria = false; // el navegador no deja leer (modo privado)
const soloMemoria = new Set<string>(); // cuentas cuyo último guardado falló

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

function obtener(correo: string): Horario {
  const k = clave(correo);
  let texto = enMemoria.get(k) ?? null;
  if (!usarMemoria && !soloMemoria.has(k)) {
    try {
      texto = localStorage.getItem(k);
    } catch {
      usarMemoria = true;
    }
  }
  const previo = cache.get(k);
  if (previo && previo.texto === texto) return previo.horario;
  let h: unknown = null;
  try {
    h = texto ? JSON.parse(texto) : null;
  } catch {
    h = null;
  }
  const horario = valido(h) ? h : HORARIO_EJEMPLO;
  cache.set(k, { texto, horario });
  return horario;
}

function suscribir(aviso: () => void) {
  const alCambiar = (e: Event) => {
    if (e instanceof StorageEvent) {
      if (e.storageArea !== localStorage) return;
      if (e.key !== null && !e.key.startsWith("iae-life:horario:")) return;
      // Otra pestaña sí pudo guardar: volver a leer lo guardado.
      if (e.key === null) soloMemoria.clear();
      else soloMemoria.delete(e.key);
    }
    aviso();
  };
  window.addEventListener("storage", alCambiar);
  window.addEventListener(EVENTO, alCambiar);
  return () => {
    window.removeEventListener("storage", alCambiar);
    window.removeEventListener(EVENTO, alCambiar);
  };
}

// Lo último guardado de esa cuenta (para editar sobre lo más reciente, aunque otra pestaña haya cambiado algo).
export function horarioGuardado(correo: string): Horario {
  return obtener(correo);
}

// Guarda el horario de una cuenta (null = volver al de ejemplo).
// Devuelve true si quedó guardado en el navegador; false si solo en memoria (se pierde al cerrar).
export function guardarHorario(correo: string, h: Horario | null): boolean {
  const k = clave(correo);
  const texto = h ? JSON.stringify(h) : null;
  enMemoria.set(k, texto);
  let ok = false;
  if (!usarMemoria) {
    try {
      if (texto) localStorage.setItem(k, texto);
      else localStorage.removeItem(k);
      ok = true;
      soloMemoria.delete(k);
    } catch {
      soloMemoria.add(k);
    }
  }
  window.dispatchEvent(new Event(EVENTO));
  return ok;
}

// Horario de la cuenta; sin cuenta, el de ejemplo. null mientras carga (en el servidor).
export function useHorario(correo: string | null): Horario | null {
  return useSyncExternalStore(
    suscribir,
    () => (correo ? obtener(correo) : HORARIO_EJEMPLO),
    () => null,
  );
}

export function esEjemplo(h: Horario) {
  return JSON.stringify(h) === JSON.stringify(HORARIO_EJEMPLO);
}

// Día de la semana (0 = lunes … 4 = viernes; null el fin de semana) y minuto del día, en hora de Panamá.
const FORMATO_PANAMA = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Panama",
  weekday: "short",
  hour: "numeric",
  minute: "numeric",
  hourCycle: "h23",
});
const DIAS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export function momentoEnPanama(fecha: Date): { dia: number | null; ahora: number } {
  const partes = Object.fromEntries(FORMATO_PANAMA.formatToParts(fecha).map((p) => [p.type, p.value]));
  const dia = DIAS_EN.indexOf(partes.weekday);
  return { dia: dia === -1 ? null : dia, ahora: Number(partes.hour) * 60 + Number(partes.minute) };
}

// La clase de ahora y la que sigue hoy (solo materias, sin huecos). Devuelve números de bloque.
export function resumenDelDia(horario: Horario, dia: number, ahora: number) {
  let actual: number | null = null;
  let siguiente: number | null = null;
  BLOQUES.forEach((b, i) => {
    if (!hayBloque(i, dia) || !horario[i][dia]) return;
    if (ahora >= aMinutos(b.desde) && ahora < aMinutos(b.hasta)) actual = i;
    else if (aMinutos(b.desde) > ahora && siguiente === null) siguiente = i;
  });
  return { actual, siguiente };
}
