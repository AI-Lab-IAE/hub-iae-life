"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatearFecha } from "../formato";
import { secciones } from "../secciones";
import { Avatar } from "./Avatar";
import { useHoy } from "./hoy";
import { Icono } from "./Icono";
import { LogoApp } from "./LogoApp";
import { usePerfil } from "./perfil";

// Barra de arriba: la fecha de hoy en el inicio (o el nombre de la sección con la flecha
// para regresar) y, a la derecha, una cápsula con el nombre y el círculo del perfil.
export function BarraSuperior() {
  const ruta = usePathname();
  const { perfil } = usePerfil();
  const hoy = useHoy();
  const enPerfil = ruta === "/camille/perfil";
  const enClub = ruta.startsWith("/camille/clubes/");
  const titulo = enPerfil ? "Mi perfil" : enClub ? "Club" : secciones.find((s) => ruta === `/camille/${s.ruta}`)?.nombre;

  const dia = hoy ? new Date(`${hoy}T12:00:00`).toLocaleDateString("es-PA", { weekday: "long" }) : "";
  const fecha = hoy ? formatearFecha(hoy).replace(/ de \d{4}$/, "") : "";

  return (
    <header className="sticky top-14 z-20 bg-indigo-50/80 backdrop-blur-md dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-8">
        {titulo ? (
          <>
            <Link
              href={enClub ? "/camille/clubes" : "/camille"}
              aria-label={enClub ? "Volver a Clubes" : "Volver al inicio"}
              className="-ml-2 flex size-9 items-center justify-center rounded-full bg-white text-indigo-700 shadow-sm transition hover:bg-indigo-100 active:scale-90 dark:bg-slate-900 dark:text-indigo-300"
            >
              <Icono nombre="atras" className="size-5" />
            </Link>
            <span className="truncate text-lg font-bold tracking-tight">{titulo}</span>
          </>
        ) : (
          <>
            {/* En celular no hay menú lateral: el logo va aquí. */}
            <LogoApp className="size-8 sm:hidden" />
            <span className="truncate text-sm sm:text-base">
              {hoy ? (
                <>
                  <strong className="font-bold capitalize">{dia},</strong> {fecha}
                </>
              ) : (
                <strong className="font-bold">IAE School Guide</strong>
              )}
            </span>
          </>
        )}

        <Link
          href="/camille/perfil"
          aria-label={perfil ? `Mi perfil: ${perfil.nombre}` : "Crear mi perfil"}
          className={`ml-auto flex shrink-0 items-center gap-2 rounded-full bg-white p-1 shadow-sm sm:pl-3 transition hover:shadow-md active:scale-95 dark:bg-slate-900 ${
            enPerfil ? "ring-2 ring-indigo-400" : ""
          }`}
        >
          <span className="hidden max-w-36 truncate text-sm font-semibold sm:block">{perfil ? perfil.nombre : "Mi perfil"}</span>
          <Avatar perfil={perfil} className="size-8 text-xs" />
        </Link>
      </div>
    </header>
  );
}
