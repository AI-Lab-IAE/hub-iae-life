import type { CSSProperties } from "react";

// Estilos comunes del módulo (colores celeste y blanco).
export const tarjeta =
  "rounded-2xl border border-sky-100 bg-white shadow-sm shadow-sky-100/60 dark:border-sky-900/60 dark:bg-slate-900 dark:shadow-none";

// Efecto al tocar un botón: se encoge un poco, como en una app.
export const tocar = "transition duration-200 active:scale-[0.97]";

// Efecto al pasar el mouse: la tarjeta se eleva y se ilumina el borde.
export const elevar =
  "hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md hover:shadow-sky-200/60 dark:hover:border-sky-700";

// Retraso de la animación para que los elementos aparezcan uno tras otro.
export function retraso(posicion: number): CSSProperties {
  return { "--retraso": `${posicion * 60}ms` } as CSSProperties;
}
