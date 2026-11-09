import type { Club } from "../datos";
import { Icono } from "./Icono";

const colores: Record<Club["color"], string> = {
  sky: "from-sky-400 to-sky-600",
  amber: "from-amber-400 to-amber-600",
  rose: "from-rose-400 to-rose-600",
  violet: "from-violet-400 to-violet-600",
  emerald: "from-emerald-400 to-emerald-600",
  indigo: "from-indigo-400 to-indigo-600",
};

// Logo inventado de un club: un dibujo sobre un círculo de color.
export function LogoClub({ club, className = "size-14", icono = "size-7" }: { club: Club; className?: string; icono?: string }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-linear-to-br text-white shadow-md ${colores[club.color]} ${className}`}>
      <Icono nombre={club.logo} className={icono} />
    </span>
  );
}
