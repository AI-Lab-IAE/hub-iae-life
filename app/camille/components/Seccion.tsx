import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, CalendarDays, Info, Map as Mapa, Star, Users, type LucideIcon } from "lucide-react";
import { Pantalla, tarjeta } from "../../_life/Pantalla";
import anim from "../animaciones.module.css";
import { secciones, type RutaSeccion } from "../secciones";

// Ícono de cada sección, del mismo juego de íconos que el resto de IAE LIFE.
export const iconoSeccion: Record<RutaSeccion, LucideIcon> = {
  mapa: Mapa,
  contactos: Users,
  clubes: Star,
  calendario: CalendarDays,
  informacion: Info,
};

// Marco de cada sección de Colegio: la misma franja de IAE LIFE, un enlace para volver a Colegio
// y una explicación corta de cómo se usa.
export function Seccion({ ruta, volver, children }: { ruta: RutaSeccion; volver?: { href: string; texto: string }; children: ReactNode }) {
  const s = secciones.find((x) => x.ruta === ruta)!;
  const atras = volver ?? { href: "/camille", texto: "Colegio" };
  return (
    <Pantalla icono={iconoSeccion[ruta]} titulo={s.nombre} texto={s.descripcion}>
      <div className={`${tarjeta} p-4 ${anim.entrar}`}>
        <Link
          href={atras.href}
          className="-ml-1 inline-flex min-h-9 items-center gap-1.5 rounded-xl px-1 text-sm font-semibold text-azul-700 hover:text-azul-900"
        >
          <ArrowLeft className="size-4" aria-hidden /> {atras.texto}
        </Link>
        <p className="mt-1 text-sm text-azul-900/70">
          <strong className="font-semibold text-azul-950">Cómo se usa: </strong>
          {s.explicacion}
        </p>
        <span className="mt-3 inline-block rounded-full bg-azul-50 px-2.5 py-0.5 text-[11px] font-medium text-azul-800 ring-1 ring-azul-100">
          Datos de ejemplo, ficticios
        </span>
      </div>
      <div className="mt-6">{children}</div>
    </Pantalla>
  );
}
