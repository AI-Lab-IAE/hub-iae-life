"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { funciones } from "./funciones";

// Barra común de IAE LIFE arriba de cada función. Va en el flujo de la página (no fija)
// para no taparse con los menús propios de cada módulo. En el inicio y en /coordinador no se muestra,
// porque esas páginas tienen su propia barra.
export default function BarraLife() {
  const ruta = usePathname();
  if (ruta === "/" || ruta.startsWith("/coordinador") || ruta.startsWith("/creditos")) return null;

  return (
    <nav
      aria-label="IAE LIFE"
      className="relative z-40 flex h-11 shrink-0 items-center gap-1 overflow-x-auto bg-[#04050d] px-3 text-sm text-white/70 [scrollbar-width:none]"
    >
      <Link href="/" className="mr-2 shrink-0 font-bold tracking-wide text-white">
        IAE <span className="text-cyan-300">LIFE</span>
      </Link>
      {funciones.map((f) => {
        const activa = ruta === f.href || ruta.startsWith(`${f.href}/`);
        if (f.estado === "proximamente") {
          return (
            <span key={f.slug} className="flex shrink-0 items-center gap-1.5 px-3 py-1 text-white/35">
              {f.proyecto}
              <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide">Pronto</span>
            </span>
          );
        }
        return (
          <Link
            key={f.slug}
            href={f.href}
            aria-current={activa ? "page" : undefined}
            className={`shrink-0 rounded-full px-3 py-1 transition-colors ${
              activa ? "bg-white/15 text-white" : "hover:text-white"
            }`}
          >
            {f.proyecto}
          </Link>
        );
      })}
    </nav>
  );
}
