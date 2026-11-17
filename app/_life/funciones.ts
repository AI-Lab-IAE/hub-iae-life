// Funciones de IAE LIFE. La mantiene Jose David.
// IAE LIFE es UNA sola app: cada función tiene su nombre (Estudiar, Tareas…) y su ruta propia.
// El proyecto y el estudiante salen del info.ts de cada módulo y siguen visibles ("EstudIA de Marco").
// Mientras se hace la unión real, cada ruta nueva muestra el módulo de siempre (ver rewrites en next.config.ts).
import { Brain, CalendarCheck, Compass, Mail, Megaphone, type LucideIcon } from "lucide-react";
import { modulos } from "../modulos";

export type Estado = "lista" | "proximamente";

type Extra = { funcion: string; ruta: string; icono: LucideIcon; resumen: string; estado: Estado };

const EXTRAS: Record<string, Extra> = {
  marco: { funcion: "Estudiar", ruta: "/estudiar", icono: Brain, resumen: "Encuentra lo que no sabes antes del examen", estado: "lista" },
  daniela: { funcion: "Tareas", ruta: "/tareas", icono: CalendarCheck, resumen: "Organiza tus tareas en tu horario", estado: "lista" },
  abraham: { funcion: "Avisos", ruta: "/avisos", icono: Megaphone, resumen: "Avisos que sí llegan a cada estudiante", estado: "lista" },
  jonathan: { funcion: "Ausencia", ruta: "/ausencia", icono: Mail, resumen: "Avisa tu ausencia a cada profesor", estado: "lista" },
  camille: { funcion: "Colegio", ruta: "/colegio", icono: Compass, resumen: "Mapa, contactos, clubes y calendario", estado: "lista" },
};

const ORDEN = ["marco", "daniela", "abraham", "jonathan", "camille"];

export const funciones = ORDEN.map((slug) => {
  const m = modulos.find((x) => x.slug === slug)!;
  const extra = EXTRAS[slug];
  // href es la ruta nueva; base es la carpeta del estudiante, que sigue funcionando por dentro.
  return { ...m, ...extra, href: extra.ruta, base: `/${slug}` };
});

export type Funcion = (typeof funciones)[number];

// La función abierta según la ruta (sirve para /estudiar y también para /marco/...).
export function funcionDeRuta(ruta: string): Funcion | undefined {
  const dentro = (p: string) => ruta === p || ruta.startsWith(`${p}/`);
  return funciones.find((f) => dentro(f.href) || dentro(f.base));
}
