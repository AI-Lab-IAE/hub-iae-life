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
    <header className="sticky top-0 z-20 border-b-2 border-amber-400 bg-blue-950 text-white shadow-md shadow-blue-950/20">
      <div className="mx-auto flex h-16 w-full max-w-4xl items-center gap-3 px-4">
        {titulo ? (
          <Link
            href="/camille"
            aria-label="Volver al inicio"
            className="-ml-2 flex size-9 items-center justify-center rounded-full text-white transition hover:bg-white/10 active:scale-90"
          >
            <Icono nombre="atras" />
          </Link>
        ) : (
          // Espacio para el logo del IAE: se cambia por la imagen oficial cuando el coordinador lo autorice.
          <span className="flex size-10 items-center justify-center rounded-xl border border-amber-400/70 bg-white/5 font-serif text-sm font-bold tracking-wide text-amber-300">
            IAE
          </span>
        )}
        <span className="min-w-0 truncate leading-tight">
          <span className="block font-semibold tracking-tight">{titulo ?? info.proyecto}</span>
          <span className="block text-[11px] tracking-wide text-blue-200 uppercase">
            {titulo ? info.proyecto : "Instituto Alberto Einstein"}
          </span>
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
                    activa ? "bg-amber-400 text-blue-950" : "text-blue-100 hover:bg-white/10 hover:text-white"
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
          className={`ml-auto shrink-0 rounded-full transition active:scale-90 sm:ml-2 ${enPerfil ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-blue-950" : ""}`}
        >
          <Avatar perfil={perfil} />
        </Link>
      </div>
    </header>
  );
}
