"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, Home, Settings, Menu, Users, X } from "lucide-react";
import { funciones, type Funcion } from "./funciones";
import { Marca } from "./Marca";
import BotonCuenta from "./BotonCuenta";

// Barra de IAE LIFE: fija arriba en todas las funciones. Las funciones se abren desde el inicio
// o con el botón "Funciones" (sin repetirlas en la barra, para que no confunda). En el HUB (/hub y /coordinador) no se muestra.
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

  // En el inicio no hay barras: las funciones se abren con sus botones (pedido de Daniela, 24-nov).
  if (ruta === "/" || ruta.startsWith("/hub") || ruta.startsWith("/coordinador")) return null;

  const activa = (f: Funcion) => ruta === f.href || ruta.startsWith(`${f.href}/`);

  return (
    <>
      <header className="sticky top-0 z-40 h-(--alto-encabezado) border-b border-azul-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-7xl items-center gap-4 px-4">
          <Link href="/" aria-label="IAE LIFE, inicio" className="shrink-0">
            <Marca />
          </Link>

          <div className="ml-auto">
            <BotonCuenta />
          </div>

          <button
            type="button"
            onClick={() => setAbierto((a) => !a)}
            aria-expanded={abierto}
            aria-controls="menu-funciones"
            className="flex items-center gap-2 rounded-full border border-azul-100 px-3 py-1.5 text-sm font-medium text-azul-800 transition-colors hover:bg-azul-50"
          >
            {abierto ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
            Funciones
          </button>
        </div>
      </header>

      {abierto && (
        <div className="fixed inset-0 top-(--alto-encabezado) z-50">
          <button
            type="button"
            aria-label="Cerrar el menú"
            onClick={() => setAbierto(false)}
            className="absolute inset-0 bg-azul-950/40 backdrop-blur-sm"
          />
          <nav
            id="menu-funciones"
            aria-label="Funciones"
            className="life-entrar relative mx-auto max-h-full max-w-3xl overflow-y-auto rounded-b-3xl bg-white p-4 shadow-2xl shadow-azul-950/20"
          >
            <ul className="grid gap-2 sm:grid-cols-2">
              {funciones.map((f) => (
                <li key={f.slug}>
                  <ElementoMenu f={f} activa={activa(f)} alCerrar={() => setAbierto(false)} />
                </li>
              ))}
            </ul>
            <Link
              href="/hoy"
              onClick={() => setAbierto(false)}
              className="mt-3 flex items-center justify-between rounded-2xl bg-azul-800 px-4 py-3 text-sm font-medium text-white"
            >
              <span className="flex items-center gap-2">
                <Home className="size-4" aria-hidden /> Hoy
              </span>
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/horario"
              onClick={() => setAbierto(false)}
              className="mt-3 flex items-center justify-between rounded-2xl bg-azul-50 px-4 py-3 text-sm font-medium text-azul-800"
            >
              <span className="flex items-center gap-2">
                <CalendarDays className="size-4" aria-hidden /> Mi horario
              </span>
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/perfil#ajustes"
              onClick={() => setAbierto(false)}
              className="mt-3 flex items-center justify-between rounded-2xl bg-azul-50 px-4 py-3 text-sm font-medium text-azul-800"
            >
              <span className="flex items-center gap-2">
                <Settings className="size-4" aria-hidden /> Ajustes
              </span>
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/creditos"
              onClick={() => setAbierto(false)}
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

function ElementoMenu({ f, activa, alCerrar }: { f: Funcion; activa: boolean; alCerrar: () => void }) {
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
      onClick={alCerrar}
      aria-current={activa ? "page" : undefined}
      className={`flex items-center gap-3 rounded-2xl p-3 transition-colors ${
        activa ? "bg-azul-50 ring-1 ring-azul-200" : "hover:bg-azul-50"
      }`}
    >
      {contenido}
    </Link>
  );
}
