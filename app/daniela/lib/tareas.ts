"use client";

// Lee (sin cambiar nada) las tareas que guarda la función Tareas en este navegador,
// para que Hoy muestre la misma lista de pendientes. La única lista de pendientes es la de Tareas.
// Misma clave que usa components/TaskUp.jsx: "taskup_state_v2" (+ ":<correo>" con cuenta).
import { useSyncExternalStore } from "react";

export type TareaPendiente = { id: string; nombre: string; materia: string; entrega: string };

const BASE = "taskup_state_v2";
const claveDe = (correo: string | null) => (correo ? `${BASE}:${correo}` : BASE);
const VACIO: TareaPendiente[] = [];
const cache = new Map<string, { texto: string | null; lista: TareaPendiente[] }>();

function leer(correo: string | null): TareaPendiente[] {
  const clave = claveDe(correo);
  let texto: string | null;
  try {
    texto = localStorage.getItem(clave);
  } catch {
    return VACIO;
  }
  const previo = cache.get(clave);
  if (previo && previo.texto === texto) return previo.lista;
  let lista: TareaPendiente[] = VACIO;
  try {
    const datos = texto ? (JSON.parse(texto) as { tasks?: unknown }) : null;
    if (datos && Array.isArray(datos.tasks)) {
      lista = datos.tasks
        .filter(
          (t): t is { id: string; name: string; subject?: string; dueDate?: string; completed?: boolean; delivered?: boolean } =>
            !!t && typeof t === "object" && typeof (t as { name?: unknown }).name === "string",
        )
        .filter((t) => !t.completed && !t.delivered)
        .map((t) => ({ id: String(t.id), nombre: t.name, materia: t.subject ?? "", entrega: t.dueDate ?? "" }))
        .sort((a, b) => (a.entrega || "9999").localeCompare(b.entrega || "9999"));
    }
  } catch {
    lista = VACIO;
  }
  cache.set(clave, { texto, lista });
  return lista;
}

function suscribir(aviso: () => void) {
  const alCambiar = (e: StorageEvent) => {
    if (e.key !== null && !e.key.startsWith(BASE)) return;
    aviso();
  };
  window.addEventListener("storage", alCambiar);
  return () => window.removeEventListener("storage", alCambiar);
}

// Tareas sin terminar, de la más próxima a la más lejana. null mientras carga (en el servidor).
export function useTareasPendientes(correo: string | null): TareaPendiente[] | null {
  return useSyncExternalStore(
    suscribir,
    () => leer(correo),
    () => null,
  );
}
