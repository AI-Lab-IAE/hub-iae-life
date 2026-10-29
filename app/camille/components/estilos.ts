import type { CSSProperties } from "react";
import type { RutaSeccion } from "../secciones";

// Estilos comunes del módulo (índigo, lila y blanco).
export const tarjeta =
  "rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none";

// Efecto al tocar un botón: se encoge un poco, como en una app.
export const tocar = "transition duration-300 ease-out active:scale-[0.96]";

// Efecto al pasar el mouse: la tarjeta se eleva y se ilumina el borde.
export const elevar =
  "hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-200/60 dark:hover:border-indigo-700";

// Retraso de la animación para que los elementos aparezcan uno tras otro.
export function retraso(posicion: number): CSSProperties {
  return { "--retraso": `${posicion * 60}ms` } as CSSProperties;
}

// Color propio de cada sección (ícono y fondo suave), para reconocerla de un vistazo.
export const colorSeccion: Record<RutaSeccion, string> = {
  mapa: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  contactos: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
  documentos: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  calendario: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  anuncios: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  informacion: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
};
