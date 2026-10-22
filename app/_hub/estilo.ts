import { Space_Grotesk } from "next/font/google";

// Tipografía y colores de las páginas del HUB (inicio y coordinador). No afectan a los módulos.
export const fuenteHub = Space_Grotesk({ subsets: ["latin"], variable: "--font-hub" });

const COLORES: Record<string, string> = {
  marco: "#22d3ee",
  camille: "#a78bfa",
  abraham: "#f472b6",
  jonathan: "#34d399",
  daniela: "#fbbf24",
};
const OTROS = ["#60a5fa", "#fb7185", "#2dd4bf", "#c084fc"];

export function colorDe(slug: string, i: number) {
  return COLORES[slug] ?? OTROS[i % OTROS.length];
}
