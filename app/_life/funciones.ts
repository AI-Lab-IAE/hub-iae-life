// Funciones de IAE LIFE. La mantiene Jose David.
// El nombre y la descripción salen del info.ts de cada módulo; aquí solo se decide el orden y si ya está lista.
import { modulos } from "../modulos";

export type Estado = "lista" | "proximamente";

const ESTADOS: Record<string, Estado> = {
  marco: "lista",
  camille: "lista",
  daniela: "lista",
  abraham: "lista",
  jonathan: "proximamente",
};

const ORDEN = ["camille", "marco", "daniela", "abraham", "jonathan"];

export const funciones = ORDEN.map((slug) => {
  const m = modulos.find((x) => x.slug === slug)!;
  return { ...m, href: `/${slug}`, estado: ESTADOS[slug] ?? "proximamente" };
});
