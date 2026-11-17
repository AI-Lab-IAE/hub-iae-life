"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UserRound } from "lucide-react";
import { funcionDeRuta, funciones } from "./funciones";
import { Marca } from "./Marca";

// Barra de IAE LIFE: fija arriba en todas las pantallas. En computadora muestra Hoy, las funciones y Perfil;
// en celular, la navegación va en la barra de abajo (BarraInferior). Dentro de una función aparece
// una franja con su nombre y quién la creó ("Estudiar · EstudIA de Marco").
// En el HUB (/hub y /coordinador) no se muestra.
export default function Encabezado() {
  const ruta = usePathname();
  if (ruta.startsWith("/hub") || ruta.startsWith("/coordinador")) return null;

  const actual = funcionDeRuta(ruta);
  const enHoy = ruta === "/";
  const enPerfil = ruta.startsWith("/perfil");

  const pestana = (activa: boolean) =>
    `flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
      activa ? "bg-azul-800 text-white" : "text-azul-900/70 hover:bg-azul-50 hover:text-azul-800"
    }`;

  return (
    <div className="sticky top-0 z-40">
      <header className="h-(--alto-encabezado) border-b border-azul-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-7xl items-center gap-4 px-4">
          <Link href="/" aria-label="IAE LIFE, Hoy" className="shrink-0">
            <Marca />
          </Link>

          <nav aria-label="Secciones" className="ml-auto hidden items-center gap-1 lg:flex">
            <Link href="/" aria-current={enHoy ? "page" : undefined} className={pestana(enHoy)}>
              <Home className="size-4" aria-hidden />
              Hoy
            </Link>
            {funciones.map((f) => (
              <Link
                key={f.slug}
                href={f.href}
                aria-current={actual?.slug === f.slug ? "page" : undefined}
                className={pestana(actual?.slug === f.slug)}
              >
                <f.icono className="size-4" aria-hidden />
                {f.funcion}
              </Link>
            ))}
          </nav>

          <Link
            href="/perfil"
            aria-label="Mi perfil"
            aria-current={enPerfil ? "page" : undefined}
            className={`ml-auto grid size-9 place-items-center rounded-full border transition-colors lg:ml-2 ${
              enPerfil ? "border-azul-800 bg-azul-800 text-white" : "border-azul-100 text-azul-800 hover:bg-azul-50"
            }`}
          >
            <UserRound className="size-4" aria-hidden />
          </Link>
        </div>
      </header>

      {actual && (
        <div className="border-b border-azul-100 bg-azul-50/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 text-sm">
            <actual.icono className="size-4 text-azul-700" aria-hidden />
            <span className="font-semibold text-azul-950">{actual.funcion}</span>
            <span className="text-azul-900/40" aria-hidden>
              ·
            </span>
            <span className="truncate text-azul-900/60">
              {actual.proyecto} de {actual.estudiante}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
