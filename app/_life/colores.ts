// Color e ícono de cada materia, para que el horario no se vea todo igual.
// Las clases van escritas completas para que Tailwind las encuentre.
import {
  Atom,
  BookOpen,
  BookText,
  Calculator,
  Dumbbell,
  FlaskConical,
  Landmark,
  Languages,
  type LucideIcon,
} from "lucide-react";

export type Estilo = { Icono: LucideIcon; suave: string; chip: string; barra: string };

const ESTILOS: Record<string, Estilo> = {
  Matemáticas: { Icono: Calculator, suave: "bg-sky-50", chip: "bg-sky-100 text-sky-700", barra: "bg-sky-500" },
  Español: { Icono: BookOpen, suave: "bg-rose-50", chip: "bg-rose-100 text-rose-700", barra: "bg-rose-500" },
  Inglés: { Icono: Languages, suave: "bg-violet-50", chip: "bg-violet-100 text-violet-700", barra: "bg-violet-500" },
  Física: { Icono: Atom, suave: "bg-amber-50", chip: "bg-amber-100 text-amber-700", barra: "bg-amber-500" },
  Química: {
    Icono: FlaskConical,
    suave: "bg-emerald-50",
    chip: "bg-emerald-100 text-emerald-700",
    barra: "bg-emerald-500",
  },
  Historia: { Icono: Landmark, suave: "bg-orange-50", chip: "bg-orange-100 text-orange-700", barra: "bg-orange-500" },
  Hebreo: { Icono: BookText, suave: "bg-fuchsia-50", chip: "bg-fuchsia-100 text-fuchsia-700", barra: "bg-fuchsia-500" },
  "Ed. Física": { Icono: Dumbbell, suave: "bg-teal-50", chip: "bg-teal-100 text-teal-700", barra: "bg-teal-500" },
};

const NEUTRO: Estilo = {
  Icono: BookOpen,
  suave: "bg-azul-50",
  chip: "bg-azul-100 text-azul-800",
  barra: "bg-azul-500",
};

export function estiloDe(nombre: string): Estilo {
  return ESTILOS[nombre] ?? NEUTRO;
}
