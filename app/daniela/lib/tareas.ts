"use client";

// Lee (sin cambiar nada) las tareas que guarda la función Tareas en este navegador,
// para que Hoy muestre la misma lista de pendientes. La única lista de pendientes es la de Tareas.
// Misma clave que usa components/TaskUp.jsx: "taskup_state_v2:<correo>". Sin cuenta no hay tareas.
import { useSyncExternalStore } from "react";

export type TareaPendiente = { id: string; nombre: string; materia: string; entrega: string }; // entrega: "AAAA-MM-DD" o ""

const BASE = "taskup_state_v2";
const claveDe = (correo: string) => `${BASE}:${correo}`;
const VACIO: TareaPendiente[] = [];
// Solo fechas "AAAA-MM-DD" que existen; cualquier otra cosa queda sin fecha (así Hoy no se rompe al mostrarla).
function fechaValida(v: unknown): string {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return "";
  const [a, m, d] = v.split("-").map(Number);
  const f = new Date(Date.UTC(a, m - 1, d));
  return f.getUTCFullYear() === a && f.getUTCMonth() === m - 1 && f.getUTCDate() === d ? v : "";
}

const cache = new Map<string, { texto: string | null; lista: TareaPendiente[] }>();

function leer(correo: string | null): TareaPendiente[] {
  if (!correo) return VACIO;
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
        .map((t) => ({
          id: String(t.id),
          nombre: t.name,
          materia: typeof t.subject === "string" ? t.subject : "",
          entrega: fechaValida(t.dueDate),
        }))
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
