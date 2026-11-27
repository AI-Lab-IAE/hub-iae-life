// Botones y tarjetas de Estudiar: los mismos de todo IAE LIFE (app/_life/Pantalla.tsx).
import { botonPrimario as primario, botonSecundario as secundario } from "../../_life/Pantalla";

// Los botones de Estudiar se usan con su propio tamaño (px-6 py-3...), así que aquí van sin alto mínimo fijo.
const boton =
  "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed";

export const botonPrimario = `${primario} ${boton}`;
export const botonSecundario = `${secundario} ${boton}`;
export const botonSimple = boton;

export { tarjeta } from "../../_life/Pantalla";
