import { useMemo, useSyncExternalStore } from "react";

// Perfil del estudiante que usa la guía. Se guarda SOLO en el navegador de este dispositivo
// (localStorage): no se sube al repositorio ni a ningún servidor, y nadie más lo puede ver.

// Grados agrupados por nivel, como en el sistema educativo de Panamá.
export const niveles = [
  { nombre: "Primaria", grados: [1, 2, 3, 4, 5, 6] },
  { nombre: "Premedia", grados: [7, 8, 9] },
  { nombre: "Media", grados: [10, 11, 12] },
];

// Colores que se pueden elegir para el círculo con las iniciales.
export const coloresAvatar = {
  celeste: "from-sky-400 to-sky-600",
  violeta: "from-violet-400 to-violet-600",
  verde: "from-emerald-400 to-emerald-600",
  ambar: "from-amber-400 to-amber-600",
  rosa: "from-rose-400 to-rose-600",
};
export type ColorAvatar = keyof typeof coloresAvatar;

export type Perfil = {
  nombre: string;
  grado: number;
  color: ColorAvatar;
};

const CLAVE = "iae-school-guide:perfil";
const oyentes = new Set<() => void>();

function avisar() {
  oyentes.forEach((oyente) => oyente());
}

function suscribir(oyente: () => void) {
  oyentes.add(oyente);
  // "storage" avisa si el perfil cambió en otra pestaña.
  window.addEventListener("storage", oyente);
  return () => {
    oyentes.delete(oyente);
    window.removeEventListener("storage", oyente);
  };
}

// El navegador puede bloquear localStorage (por ejemplo, en modo privado); entonces no hay perfil.
function leer() {
  try {
    return localStorage.getItem(CLAVE);
  } catch {
    return null;
  }
}

function convertir(texto: string | null | undefined): Perfil | null {
  if (!texto) return null;
  try {
    const p = JSON.parse(texto);
    if (typeof p?.nombre !== "string" || !(p.grado >= 1 && p.grado <= 12)) return null;
    return {
      nombre: p.nombre,
      grado: p.grado,
      color: p.color in coloresAvatar ? p.color : "celeste",
    };
  } catch {
    return null;
  }
}

// En el servidor no hay perfil todavía: "listo" es false hasta que el navegador lo lee.
export function usePerfil() {
  const texto = useSyncExternalStore(suscribir, leer, () => undefined);
  const perfil = useMemo(() => convertir(texto), [texto]);
  return { listo: texto !== undefined, perfil };
}

export function guardarPerfil(perfil: Perfil) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(perfil));
  } catch {
    // Si el navegador no deja guardar, la app sigue funcionando sin perfil.
  }
  avisar();
}

export function borrarPerfil() {
  try {
    localStorage.removeItem(CLAVE);
  } catch {
    // Nada que borrar.
  }
  avisar();
}

export function nivelDe(grado: number) {
  return niveles.find((n) => n.grados.includes(grado))!.nombre;
}

// Premedia y media forman la secundaria, que es el horario que tenemos.
export function esSecundaria(perfil: Perfil | null) {
  return perfil != null && perfil.grado >= 7;
}

export function iniciales(nombre: string) {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  return (partes[0]?.[0] ?? "?").concat(partes[1]?.[0] ?? "").toUpperCase();
}

// Texto corto debajo del nombre, por ejemplo "Estudiante de 9.º grado · Premedia".
export function descripcionPerfil(perfil: Perfil) {
  return `Estudiante de ${perfil.grado}.º grado · ${nivelDe(perfil.grado)}`;
}
