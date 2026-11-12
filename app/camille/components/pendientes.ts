import { useMemo, useSyncExternalStore } from "react";
import { diasHasta, textoFaltan } from "./hoy";

// Checklist personal del estudiante. Igual que el perfil, se guarda SOLO en el navegador de este
// dispositivo (localStorage): no se sube al repositorio ni a ningún servidor, y nadie más lo puede ver.

export const tiposPendiente = ["Tarea", "Examen", "Proyecto", "Otro"] as const;
export type TipoPendiente = (typeof tiposPendiente)[number];

export type Pendiente = {
  id: string;
  titulo: string;
  materia: string;
  tipo: TipoPendiente;
  // Fecha de entrega como "2026-11-10", o "" si no tiene.
  fecha: string;
  notas: string;
  hecho: boolean;
};
export type DatosPendiente = Omit<Pendiente, "id" | "hecho">;

const CLAVE = "iae-school-guide:pendientes";
const oyentes = new Set<() => void>();

function suscribir(oyente: () => void) {
  oyentes.add(oyente);
  // "storage" avisa si la lista cambió en otra pestaña.
  window.addEventListener("storage", oyente);
  return () => {
    oyentes.delete(oyente);
    window.removeEventListener("storage", oyente);
  };
}

// El navegador puede bloquear localStorage (por ejemplo, en modo privado); entonces la lista está vacía.
function leer() {
  try {
    return localStorage.getItem(CLAVE);
  } catch {
    return null;
  }
}

function convertir(texto: string | null | undefined): Pendiente[] {
  if (!texto) return [];
  try {
    const lista = JSON.parse(texto);
    if (!Array.isArray(lista)) return [];
    return lista
      .filter((p) => typeof p?.id === "string" && typeof p?.titulo === "string")
      .map((p) => ({
        id: p.id,
        titulo: p.titulo,
        materia: typeof p.materia === "string" ? p.materia : "",
        tipo: tiposPendiente.includes(p.tipo) ? p.tipo : "Otro",
        fecha: typeof p.fecha === "string" ? p.fecha : "",
        notas: typeof p.notas === "string" ? p.notas : "",
        hecho: p.hecho === true,
      }));
  } catch {
    return [];
  }
}

// Primero lo que falta, de la entrega más cercana a la más lejana; los que no tienen fecha van después.
function ordenar(a: Pendiente, b: Pendiente) {
  if (a.hecho !== b.hecho) return a.hecho ? 1 : -1;
  return (a.fecha || "9999").localeCompare(b.fecha || "9999");
}

// En el servidor no hay lista todavía: "listo" es false hasta que el navegador la lee.
export function usePendientes() {
  const texto = useSyncExternalStore(suscribir, leer, () => undefined);
  const pendientes = useMemo(() => convertir(texto).sort(ordenar), [texto]);
  return { listo: texto !== undefined, pendientes };
}

// Devuelve false si el navegador no dejó guardar.
function guardar(lista: Pendiente[]) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(lista));
  } catch {
    return false;
  }
  oyentes.forEach((oyente) => oyente());
  return true;
}

export function agregarPendiente(datos: DatosPendiente) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return guardar([...convertir(leer()), { ...datos, id, hecho: false }]);
}

export function editarPendiente(id: string, datos: DatosPendiente) {
  return guardar(convertir(leer()).map((p) => (p.id === id ? { ...p, ...datos } : p)));
}

export function cambiarHecho(id: string) {
  guardar(convertir(leer()).map((p) => (p.id === id ? { ...p, hecho: !p.hecho } : p)));
}

export function borrarPendiente(id: string) {
  guardar(convertir(leer()).filter((p) => p.id !== id));
}

// Texto y urgencia de una entrega: "Atrasado", "Hoy", "Mañana" o "En 5 días".
export function entrega(hoy: string, fecha: string) {
  const dias = diasHasta(hoy, fecha);
  return { texto: dias < 0 ? "Atrasado" : textoFaltan(dias), dias };
}
