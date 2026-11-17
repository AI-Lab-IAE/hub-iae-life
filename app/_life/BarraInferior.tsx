"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { funcionDeRuta, funciones } from "./funciones";

// Barra de abajo en el celular, como en cualquier app: Hoy y las cinco funciones.
// En computadora no se muestra (la navegación está arriba). Tampoco en el HUB.
export default function BarraInferior() {
  const ruta = usePathname();
  if (ruta.startsWith("/hub") || ruta.startsWith("/coordinador")) return null;

  const actual = funcionDeRuta(ruta);
  const items = [
    { clave: "hoy", nombre: "Hoy", href: "/", icono: Home, activa: ruta === "/" },
    ...funciones.map((f) => ({
      clave: f.slug,
      nombre: f.funcion,
      href: f.href,
      icono: f.icono,
      activa: actual?.slug === f.slug,
    })),
  ];

  return (
    <>
      {/* Espacio para que la barra fija no tape el final de la página. */}
      <div className="h-[calc(4.25rem+env(safe-area-inset-bottom))] lg:hidden" aria-hidden />
      <nav
        aria-label="Secciones"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-azul-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      >
        <ul className="mx-auto grid max-w-xl grid-cols-6">
          {items.map((i) => (
            <li key={i.clave}>
              <Link
                href={i.href}
                aria-current={i.activa ? "page" : undefined}
                className={`flex h-[4.25rem] flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                  i.activa ? "text-azul-800" : "text-azul-900/50 hover:text-azul-800"
                }`}
              >
                <span
                  className={`grid h-7 w-12 place-items-center rounded-full transition-colors ${
                    i.activa ? "bg-azul-100" : ""
                  }`}
                >
                  <i.icono className="size-5" aria-hidden />
                </span>
                {i.nombre}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
