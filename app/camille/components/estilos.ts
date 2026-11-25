import type { CSSProperties } from "react";
import type { RutaSeccion } from "../secciones";

// Estilos de Colegio, con los colores de IAE LIFE.
// La misma tarjeta que el resto de IAE LIFE (app/_life/Pantalla.tsx).
export { tarjeta } from "../../_life/Pantalla";

// Efecto al tocar un botón: se encoge un poco, como en una app.
export const tocar = "transition duration-300 ease-out active:scale-[0.96]";

// Efecto al pasar el mouse: la tarjeta se eleva y se ilumina el borde.
export const elevar =
  "hover:-translate-y-1 hover:border-azul-300 hover:shadow-lg hover:shadow-azul-200/60";

// Retraso de la animación para que los elementos aparezcan uno tras otro.
export function retraso(posicion: number): CSSProperties {
  return { "--retraso": `${posicion * 60}ms` } as CSSProperties;
}

// Color propio de cada sección (ícono y fondo suave), para reconocerla de un vistazo.
export const colorSeccion: Record<RutaSeccion, string> = {
  mapa: "bg-emerald-50 text-emerald-700",
  contactos: "bg-sky-50 text-sky-700",
  clubes: "bg-pink-50 text-pink-700",
  calendario: "bg-violet-50 text-violet-700",
  informacion: "bg-azul-50 text-azul-900",
};
