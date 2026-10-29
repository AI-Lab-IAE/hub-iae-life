"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icono } from "./Icono";
import { pestanas } from "./pestanas";

// Barra de pestañas fija abajo, solo en celular (como en una app).
export function BarraPestanas() {
  const ruta = usePathname();
  const indice = pestanas.findIndex((p) => p.href === ruta);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden dark:border-slate-800 dark:bg-slate-950/90">
      <ul className="relative mx-auto grid max-w-md grid-cols-5">
        {/* Cápsula que se desliza hasta la pestaña activa. */}
        {indice >= 0 && (
          <li
            aria-hidden="true"
            className="pointer-events-none absolute top-2 left-0 flex w-1/5 justify-center transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
            style={{ transform: `translateX(${indice * 100}%)` }}
          >
            <span className="h-7 w-12 rounded-full bg-indigo-600 shadow-md shadow-indigo-500/40" />
          </li>
        )}
        {pestanas.map((p) => {
          const activa = ruta === p.href;
          return (
            <li key={p.href}>
              <Link
                href={p.href}
                aria-current={activa ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 pt-2 pb-2 text-[11px] font-medium transition active:scale-90 ${
                  activa ? "font-semibold text-indigo-700 dark:text-indigo-300" : "text-slate-400 dark:text-slate-500"
                }`}
              >
                <span
                  className={`relative flex h-7 w-12 items-center justify-center transition duration-300 ${activa ? "scale-110 text-white" : ""}`}
                >
                  <Icono nombre={p.icono} className="size-5" />
                </span>
                {p.nombre}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
