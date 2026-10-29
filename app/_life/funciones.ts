// Funciones de IAE LIFE. La mantiene Jose David.
// El nombre y la descripción salen del info.ts de cada módulo; aquí se decide el orden, el ícono,
// el resumen corto para el menú y si ya está lista.
import { Brain, CalendarCheck, Compass, Mail, Megaphone, type LucideIcon } from "lucide-react";
import { modulos } from "../modulos";

export type Estado = "lista" | "proximamente";

type Extra = { icono: LucideIcon; resumen: string; estado: Estado };

const EXTRAS: Record<string, Extra> = {
  camille: { icono: Compass, resumen: "Mapa, horario, contactos y avisos", estado: "lista" },
  marco: { icono: Brain, resumen: "Encuentra lo que no sabes antes del examen", estado: "lista" },
  daniela: { icono: CalendarCheck, resumen: "Organiza tus tareas en tu horario", estado: "lista" },
  abraham: { icono: Megaphone, resumen: "Avisos que sí llegan a cada estudiante", estado: "lista" },
  jonathan: { icono: Mail, resumen: "Avisa tu ausencia a cada profesor", estado: "lista" },
};

const ORDEN = ["camille", "marco", "daniela", "abraham", "jonathan"];

export const funciones = ORDEN.map((slug) => {
  const m = modulos.find((x) => x.slug === slug)!;
  return { ...m, ...EXTRAS[slug], href: `/${slug}` };
});

export type Funcion = (typeof funciones)[number];
