// Paleta propia de EstudIA. No se tocan los tokens de Tailwind compartidos (@theme en app/globals.css,
// que mantiene Jose David): aquí se usan valores Tailwind "arbitrary value" con el color fijo.
export const COLOR = {
  tinta: "#15203b",
  tinta2: "#4a5475",
  tinta3: "#7c849e",
  papel: "#faf7f0",
  papel2: "#f3eee2",
  blanco: "#fffdf8",
  linea: "#e4dccb",
  linea2: "#d6ccb6",
  resaltador: "#ffe45c",
  rojo: "#e0492f",
  rojoSuave: "#fde6df",
  azul: "#3e5bd8",
  azulSuave: "#e3e8fc",
  ambar: "#d98a0f",
  ambarSuave: "#fcefd6",
  verde: "#1f9466",
  verdeSuave: "#dcf2e7",
};

// OJO: Tailwind escanea el texto literal de este archivo para saber qué clases generar, así que
// las clases de "arbitrary value" van escritas tal cual (no armadas con variables ni template strings).
const boton =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all active:translate-y-px active:scale-[0.99] disabled:opacity-45 disabled:cursor-not-allowed";

export const botonPrimario = `${boton} bg-[#15203b] text-[#faf7f0] shadow-[0_6px_0_-2px_#ffe45c] hover:shadow-[0_8px_0_-2px_#ffe45c] hover:-translate-y-px`;
export const botonSecundario = `${boton} bg-[#fffdf8] text-[#15203b] border border-[#d6ccb6] hover:bg-[#f3eee2]`;
export const botonSimple = boton;

export const tarjeta =
  "bg-[#fffdf8] border border-[#e4dccb] rounded-[20px] shadow-[0_1px_0_rgba(21,32,59,0.04),0_12px_32px_-18px_rgba(21,32,59,0.18)]";
