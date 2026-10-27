"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { info } from "../info";
import { secciones } from "../secciones";
import { Icono } from "./Icono";
import { pestanas } from "./pestanas";

// Barra fija de arriba: logo en el inicio, flecha para regresar dentro de una sección.
export function BarraSuperior() {
  const ruta = usePathname();
  const seccion = secciones.find((s) => ruta === `/camille/${s.ruta}`);

  return (
    <header className="sticky top-0 z-20 border-b border-sky-100 bg-white/80 backdrop-blur-md dark:border-sky-900/60 dark:bg-slate-950/80">
      <div className="mx-auto flex h-14 w-full max-w-4xl items-center gap-2 px-4">
        {seccion ? (
          <Link
            href="/camille"
            aria-label="Volver al inicio"
            className="-ml-2 flex size-9 items-center justify-center rounded-full text-sky-600 transition hover:bg-sky-50 active:scale-90 dark:text-sky-400 dark:hover:bg-sky-950"
          >
            <Icono nombre="atras" />
          </Link>
        ) : (
          <span className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-sky-400 to-sky-600 text-xs font-bold text-white shadow-sm shadow-sky-500/30">
            IAE
          </span>
        )}
        <span className="font-semibold">{seccion ? seccion.nombre : info.proyecto}</span>

        {/* En computadora, las pestañas van aquí arriba. */}
        <nav className="ml-auto hidden gap-1 sm:flex">
          {pestanas.map((p) => {
            const activa = ruta === p.href;
            return (
              <Link
                key={p.href}
                href={p.href}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  activa
                    ? "bg-sky-500 text-white shadow-sm shadow-sky-500/30"
                    : "text-slate-500 hover:bg-sky-50 hover:text-sky-700 dark:text-slate-400 dark:hover:bg-sky-950 dark:hover:text-sky-300"
                }`}
              >
                {p.nombre}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
