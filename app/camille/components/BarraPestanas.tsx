"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icono } from "./Icono";
import { pestanas } from "./pestanas";

// Barra de pestañas fija abajo, solo en celular (como en una app).
export function BarraPestanas() {
  const ruta = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden dark:border-slate-800 dark:bg-slate-950/90">
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {pestanas.map((p) => {
          const activa = ruta === p.href;
          return (
            <li key={p.href}>
              <Link
                href={p.href}
                aria-current={activa ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 pt-2 pb-2 text-[11px] font-medium transition active:scale-90 ${
                  activa ? "font-semibold text-blue-950 dark:text-blue-200" : "text-slate-400 dark:text-slate-500"
                }`}
              >
                <span
                  className={`flex h-7 w-12 items-center justify-center rounded-full transition duration-300 ${
                    activa ? "bg-blue-950 text-amber-300 shadow-sm shadow-blue-950/20 dark:bg-blue-900" : ""
                  }`}
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
