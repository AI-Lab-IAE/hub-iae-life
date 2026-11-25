"use client";

// Historial de ausencias avisadas (idea de Jonathan), guardado solo en este navegador y por cuenta
// con la clave "avisia:historial:<correo>". Sin cuenta no se guarda nada.
// Solo datos mínimos: fecha, profesores y materias, categoría del motivo y cuántos correos.
// Nunca el texto de los correos ni lo escrito a mano.
import { useSyncExternalStore } from "react";
import type { Registro } from "./tipos";

const EVENTO = "avisia:historial";
const clave = (correo: string) => `avisia:historial:${correo}`;
const MAXIMO = 30;
const VACIO: Registro[] = [];
const cache = new Map<string, { texto: string | null; lista: Registro[] }>();

// Se queda solo con los campos mínimos (lo guardado por una versión vieja puede traer más).
function limpiar(r: unknown): Registro | null {
  if (!r || typeof r !== "object") return null;
  const x = r as Partial<Registro>;
  if (typeof x.id !== "string" || typeof x.fecha !== "string" || !Array.isArray(x.profesores)) return null;
  const profesores = x.profesores
    .filter((p) => p && typeof p.profesor === "string" && typeof p.materias === "string")
    .map((p) => ({ profesor: p.profesor, materias: p.materias }));
  return {
    id: x.id,
    fecha: x.fecha,
    motivo: typeof x.motivo === "string" ? x.motivo : "Sin motivo",
    profesores,
    total: typeof x.total === "number" ? x.total : profesores.length,
    creado: typeof x.creado === "number" ? x.creado : 0,
  };
}

// Una sola vez al cargar: lo guardado por la versión vieja (con el texto de los correos y la copia)
// se reescribe al momento solo con los campos mínimos.
function migrarHistoriales() {
  let claves: string[] = [];
  try {
    claves = Object.keys(localStorage).filter((c) => c.startsWith("avisia:historial:"));
  } catch {
    return;
  }
  for (const c of claves) {
    try {
      const original = localStorage.getItem(c); // se lee una sola vez
      const datos: unknown = JSON.parse(original ?? "null");
      if (!Array.isArray(datos)) continue;
      const limpio = JSON.stringify(datos.map(limpiar).filter((r) => r !== null));
      // Solo se escribe si nadie lo cambió mientras tanto. Queda una ventana mínima entre leer y escribir
      // (localStorage no tiene transacciones); es aceptable: la migración corre una sola vez y es instantánea.
      if (limpio !== original && localStorage.getItem(c) === original) localStorage.setItem(c, limpio);
    } catch {
      // un registro dañado no frena a los demás
    }
  }
}
if (typeof window !== "undefined") migrarHistoriales();

function leer(correo: string): Registro[] {
  let texto: string | null;
  try {
    texto = localStorage.getItem(clave(correo));
  } catch {
    return VACIO; // modo privado
  }
  const previo = cache.get(correo);
  if (previo && previo.texto === texto) return previo.lista;
  let lista: Registro[] = VACIO;
  try {
    const datos: unknown = texto ? JSON.parse(texto) : null;
    if (Array.isArray(datos)) lista = datos.map(limpiar).filter((r): r is Registro => r !== null);
  } catch {
    lista = VACIO;
  }
  cache.set(correo, { texto, lista });
  return lista;
}

function suscribir(aviso: () => void) {
  const alCambiar = (e: Event) => {
    if (e instanceof StorageEvent && e.key !== null && !e.key.startsWith("avisia:historial:")) return;
    aviso();
  };
  window.addEventListener("storage", alCambiar);
  window.addEventListener(EVENTO, alCambiar);
  return () => {
    window.removeEventListener("storage", alCambiar);
    window.removeEventListener(EVENTO, alCambiar);
  };
}

// Devuelve true solo si quedó guardado en el navegador.
function escribir(correo: string, lista: Registro[]): boolean {
  let ok = false;
  try {
    if (lista.length) localStorage.setItem(clave(correo), JSON.stringify(lista));
    else localStorage.removeItem(clave(correo));
    ok = true;
  } catch {
    // sin espacio o modo privado: el historial no se guarda
  }
  window.dispatchEvent(new Event(EVENTO));
  return ok;
}

export function agregarAlHistorial(correo: string, registro: Registro): boolean {
  return escribir(correo, [registro, ...leer(correo)].slice(0, MAXIMO));
}

export function borrarDelHistorial(correo: string, id: string): boolean {
  return escribir(
    correo,
    leer(correo).filter((r) => r.id !== id),
  );
}

// Historial de la cuenta (vacío sin cuenta y en el servidor).
export function useHistorial(correo: string | null): Registro[] {
  return useSyncExternalStore(
    suscribir,
    () => (correo ? leer(correo) : VACIO),
    () => VACIO,
  );
}
