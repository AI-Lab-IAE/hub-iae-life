"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icono } from "./Icono";
import { pestanas } from "./pestanas";

// Barra de pestañas fija abajo, solo en celular (como en una app).
export function BarraPestanas() {
  const ruta = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-sky-100 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden dark:border-sky-900/60 dark:bg-slate-950/90">
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {pestanas.map((p) => {
          const activa = ruta === p.href;
          return (
            <li key={p.href}>
              <Link
                href={p.href}
                aria-current={activa ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 pt-2 pb-2 text-[11px] font-medium transition active:scale-90 ${
                  activa ? "text-sky-600 dark:text-sky-400" : "text-slate-400 dark:text-slate-500"
                }`}
              >
                <span
                  className={`flex h-7 w-12 items-center justify-center rounded-full transition duration-300 ${
                    activa ? "bg-sky-100 dark:bg-sky-950" : ""
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
