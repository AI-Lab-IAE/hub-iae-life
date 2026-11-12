"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, Users, X } from "lucide-react";
import { funciones, type Funcion } from "./funciones";
import { Marca } from "./Marca";

// Barra de IAE LIFE: fija arriba en todas las funciones. En computadora muestra las funciones;
// en celular, un botón abre el menú. En el HUB (/hub y /coordinador) no se muestra.
export default function Encabezado() {
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);
  const [rutaDelMenu, setRutaDelMenu] = useState(ruta);

  // Al cambiar de página se cierra el menú.
  if (rutaDelMenu !== ruta) {
    setRutaDelMenu(ruta);
    setAbierto(false);
  }

  useEffect(() => {
    if (!abierto) return;
    const cerrarConEsc = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("keydown", cerrarConEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", cerrarConEsc);
      document.body.style.overflow = "";
    };
  }, [abierto]);

  if (ruta.startsWith("/hub") || ruta.startsWith("/coordinador")) return null;

  const activa = (f: Funcion) => ruta === f.href || ruta.startsWith(`${f.href}/`);

  return (
    <>
      <header className="sticky top-0 z-40 h-(--alto-encabezado) border-b border-azul-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-7xl items-center gap-4 px-4">
          <Link href="/" aria-label="IAE LIFE, inicio" className="shrink-0">
            <Marca />
          </Link>

          <nav aria-label="Funciones" className="ml-auto hidden items-center gap-1 lg:flex">
            {funciones.map((f) =>
              f.estado === "lista" ? (
                <Link
                  key={f.slug}
                  href={f.href}
                  aria-current={activa(f) ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    activa(f) ? "bg-azul-800 text-white" : "text-azul-900/70 hover:bg-azul-50 hover:text-azul-800"
                  }`}
                >
                  <f.icono className="size-4" aria-hidden />
                  {f.proyecto}
                </Link>
              ) : (
                <span key={f.slug} className="flex items-center gap-2 px-3 py-1.5 text-sm text-azul-900/35">
                  <f.icono className="size-4" aria-hidden />
                  {f.proyecto}
                  <span className="rounded-full bg-azul-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-azul-600">
                    Pronto
                  </span>
                </span>
              ),
            )}
          </nav>

          <button
            type="button"
            onClick={() => setAbierto((a) => !a)}
            aria-expanded={abierto}
            aria-controls="menu-funciones"
            className="ml-auto flex items-center gap-2 rounded-full border border-azul-100 px-3 py-1.5 text-sm font-medium text-azul-800 transition-colors hover:bg-azul-50 lg:hidden"
          >
            {abierto ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
            Funciones
          </button>
        </div>
      </header>

      {abierto && (
        <div className="fixed inset-0 top-(--alto-encabezado) z-40 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar el menú"
            onClick={() => setAbierto(false)}
            className="absolute inset-0 bg-azul-950/40 backdrop-blur-sm"
          />
          <nav
            id="menu-funciones"
            aria-label="Funciones"
            className="life-entrar relative max-h-full overflow-y-auto rounded-b-3xl bg-white p-4 shadow-2xl shadow-azul-950/20"
          >
            <ul className="grid gap-2 sm:grid-cols-2">
              {funciones.map((f) => (
                <li key={f.slug}>
                  <ElementoMenu f={f} activa={activa(f)} />
                </li>
              ))}
            </ul>
            <Link
              href="/creditos"
              className="mt-3 flex items-center justify-between rounded-2xl bg-azul-50 px-4 py-3 text-sm font-medium text-azul-800"
            >
              <span className="flex items-center gap-2">
                <Users className="size-4" aria-hidden /> Quién creó cada función
              </span>
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}

function ElementoMenu({ f, activa }: { f: Funcion; activa: boolean }) {
  const contenido = (
    <>
      <span
        className={`grid size-11 shrink-0 place-items-center rounded-xl ${
          f.estado === "lista" ? "bg-azul-800 text-white" : "bg-azul-50 text-azul-400"
        }`}
      >
        <f.icono className="size-5" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2 font-semibold text-azul-950">
          {f.proyecto}
          {f.estado === "proximamente" && (
            <span className="rounded-full bg-azul-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-azul-600">
              Pronto
            </span>
          )}
        </span>
        <span className="block truncate text-sm text-azul-900/60">{f.resumen}</span>
      </span>
    </>
  );

  if (f.estado !== "lista") {
    return <div className="flex items-center gap-3 rounded-2xl p-3 opacity-70">{contenido}</div>;
  }
  return (
    <Link
      href={f.href}
      aria-current={activa ? "page" : undefined}
      className={`flex items-center gap-3 rounded-2xl p-3 transition-colors ${
        activa ? "bg-azul-50 ring-1 ring-azul-200" : "hover:bg-azul-50"
      }`}
    >
      {contenido}
    </Link>
  );
}
