"use client";

import { useSyncExternalStore } from "react";
import { avisosIniciales, type Aviso } from "./datos";

// El HUB no tiene base de datos: los avisos se guardan en el navegador
// (localStorage). Así la demo se puede probar abriendo la vista de profesor
// y la de estudiante en la misma computadora.

const CLAVE = "avisoya_avisos";
const oyentes = new Set<() => void>();
let cache: Aviso[] | null = null;

// Si ya había avisos guardados de antes, se agregan los de ejemplo que falten (por id),
// por ejemplo los anuncios que pasaron de Colegio a Avisos. Los que el usuario ya tenía no se tocan.
function conEjemplosQueFaltan(guardados: Aviso[]): Aviso[] {
  const ids = new Set(guardados.map((a) => a.id));
  const faltan = avisosIniciales.filter((a) => !ids.has(a.id));
  if (!faltan.length) return guardados;
  return [...guardados, ...faltan].sort((a, b) => b.creado.localeCompare(a.creado));
}

function leer(): Aviso[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(CLAVE);
    const datos: unknown = raw ? JSON.parse(raw) : null;
    cache = Array.isArray(datos) ? conEjemplosQueFaltan(datos as Aviso[]) : avisosIniciales;
  } catch {
    cache = avisosIniciales;
  }
  return cache;
}

function guardar(avisos: Aviso[]) {
  cache = avisos;
  try {
    localStorage.setItem(CLAVE, JSON.stringify(avisos));
  } catch {
    // Sin almacenamiento (ventana privada): la demo sigue funcionando en memoria.
  }
  oyentes.forEach((o) => o());
}

function suscribir(o: () => void) {
  oyentes.add(o);
  // Otra pestaña cambió los avisos (por ejemplo, la vista de estudiante).
  const alCambiar = (e: StorageEvent) => {
    if (e.key !== CLAVE) return;
    cache = null;
    o();
  };
  window.addEventListener("storage", alCambiar);
  return () => {
    oyentes.delete(o);
    window.removeEventListener("storage", alCambiar);
  };
}

export function useAvisos(): Aviso[] {
  return useSyncExternalStore(suscribir, leer, () => avisosIniciales);
}

export function publicar(aviso: Omit<Aviso, "id" | "vistos" | "creado">) {
  const nuevo: Aviso = { ...aviso, id: crypto.randomUUID(), vistos: {}, creado: new Date().toISOString() };
  guardar([nuevo, ...leer()]);
}

export function marcarVisto(avisoId: string, estudianteId: string) {
  guardar(
    leer().map((a) =>
      a.id === avisoId && !a.vistos[estudianteId]
        ? { ...a, vistos: { ...a.vistos, [estudianteId]: new Date().toISOString() } }
        : a
    )
  );
}

export function reiniciar() {
  guardar(avisosIniciales);
}
