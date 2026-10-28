"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { info } from "../info";
import { secciones } from "../secciones";
import { Avatar } from "./Avatar";
import { Icono } from "./Icono";
import { usePerfil } from "./perfil";
import { pestanas } from "./pestanas";

// Barra fija de arriba: logo en el inicio, flecha para regresar dentro de una sección
// y el círculo del perfil a la derecha.
export function BarraSuperior() {
  const ruta = usePathname();
  const { perfil } = usePerfil();
  const enPerfil = ruta === "/camille/perfil";
  const titulo = enPerfil ? "Mi perfil" : secciones.find((s) => ruta === `/camille/${s.ruta}`)?.nombre;

  return (
    <header className="sticky top-0 z-20 border-b border-sky-100 bg-white/80 backdrop-blur-md dark:border-sky-900/60 dark:bg-slate-950/80">
      <div className="mx-auto flex h-14 w-full max-w-4xl items-center gap-2 px-4">
        {titulo ? (
          <Link
            href="/camille"
            aria-label="Volver al inicio"
            className="-ml-2 flex size-9 items-center justify-center rounded-full text-sky-600 transition hover:bg-sky-50 active:scale-90 dark:text-sky-400 dark:hover:bg-sky-950"
          >
            <Icono nombre="atras" />
          </Link>
        ) : (
          // Espacio para el logo del IAE: se cambia por la imagen oficial cuando el coordinador lo autorice.
          <span className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-sky-400 to-sky-600 text-xs font-bold text-white shadow-sm shadow-sky-500/30">
            IAE
          </span>
        )}
        <span className="min-w-0 truncate leading-tight">
          <span className="block font-semibold">{titulo ?? info.proyecto}</span>
          {!titulo && <span className="block text-[11px] text-slate-500 dark:text-slate-400">Instituto Alberto Einstein</span>}
        </span>

        {/* En computadora, las pestañas van aquí arriba. Perfil se abre con el círculo. */}
        <nav className="ml-auto hidden gap-1 sm:flex">
          {pestanas
            .filter((p) => p.href !== "/camille/perfil")
            .map((p) => {
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

        <Link
          href="/camille/perfil"
          aria-label={perfil ? `Mi perfil: ${perfil.nombre}` : "Crear mi perfil"}
          className={`ml-auto shrink-0 rounded-full transition active:scale-90 sm:ml-2 ${enPerfil ? "ring-2 ring-sky-400 ring-offset-2 dark:ring-offset-slate-950" : ""}`}
        >
          <Avatar perfil={perfil} />
        </Link>
      </div>
    </header>
  );
}
