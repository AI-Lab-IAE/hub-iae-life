// Funciones de IAE LIFE. La mantiene Jose David.
// Cada función se llama por lo que hace (Estudiar, Tareas, Avisos...). El nombre del proyecto
// y quién lo hizo salen del info.ts de cada módulo, pero solo se muestran en Créditos.
import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Compass,
  Mail,
  Megaphone,
  type LucideIcon,
} from "lucide-react";
import { modulos } from "../modulos";

export type Funcion = {
  slug: string;
  nombre: string; // lo que se ve en la app: "Estudiar", "Tareas"...
  resumen: string;
  icono: LucideIcon;
  href: string;
  // Solo para Créditos:
  proyecto?: string;
  estudiante?: string;
  descripcion?: string;
  logo?: string; // imagen que hizo el estudiante (public/img/logos)
};

type Base = Omit<Funcion, "href" | "proyecto" | "estudiante" | "descripcion">;

const MODULOS: (Base & { slug: string })[] = [
  { slug: "marco", nombre: "Estudiar", resumen: "Encuentra lo que no sabes antes del examen", icono: BookOpen, logo: "/img/logos/marco.png" },
  { slug: "daniela", nombre: "Tareas", resumen: "Tus pendientes repartidos en tu semana", icono: ClipboardCheck },
  { slug: "abraham", nombre: "Avisos", resumen: "Los avisos del colegio y quién los vio", icono: Megaphone },
  { slug: "jonathan", nombre: "Faltar", resumen: "Avisa tu ausencia a cada profesor", icono: Mail },
  { slug: "camille", nombre: "Colegio", resumen: "Mapa, contactos, clubes y calendario", icono: Compass, logo: "/img/logos/camille.png" },
];

export const funciones: Funcion[] = [
  ...MODULOS.map((f) => {
    const m = modulos.find((x) => x.slug === f.slug)!;
    return { ...f, href: `/${f.slug}`, proyecto: m.proyecto, estudiante: m.estudiante, descripcion: m.descripcion };
  }),
  {
    slug: "horario",
    nombre: "Horario",
    resumen: "Qué clase tienes ahora y cuál sigue",
    icono: CalendarDays,
    href: "/horario",
  },
];

export function funcionDe(slug: string): Funcion {
  return funciones.find((f) => f.slug === slug)!;
}
