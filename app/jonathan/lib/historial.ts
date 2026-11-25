"use client";

// Historial de ausencias avisadas (idea de Jonathan), guardado solo en este navegador y por cuenta
// con la clave "avisia:historial:<correo>". Sin cuenta no se guarda nada.
import { useSyncExternalStore } from "react";
import type { Registro } from "./tipos";

const EVENTO = "avisia:historial";
const clave = (correo: string) => `avisia:historial:${correo}`;
const MAXIMO = 30;
const VACIO: Registro[] = [];
const cache = new Map<string, { texto: string | null; lista: Registro[] }>();

function esRegistro(r: unknown): r is Registro {
  if (!r || typeof r !== "object") return false;
  const x = r as Partial<Registro>;
  return typeof x.id === "string" && typeof x.fecha === "string" && Array.isArray(x.correos);
}

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
    if (Array.isArray(datos)) lista = datos.filter(esRegistro);
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

function escribir(correo: string, lista: Registro[]) {
  try {
    if (lista.length) localStorage.setItem(clave(correo), JSON.stringify(lista));
    else localStorage.removeItem(clave(correo));
  } catch {
    // sin espacio o modo privado: el historial no se guarda
  }
  window.dispatchEvent(new Event(EVENTO));
}

export function agregarAlHistorial(correo: string, registro: Registro) {
  escribir(correo, [registro, ...leer(correo)].slice(0, MAXIMO));
}

export function borrarDelHistorial(correo: string, id: string) {
  escribir(
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
