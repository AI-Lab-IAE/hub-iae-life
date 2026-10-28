"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NombreIcono } from "./Icono";
import { Icono } from "./Icono";

// Menú lateral oscuro, solo en computadora. En celular se usa la barra de pestañas de abajo.
const opciones: { href: string; nombre: string; icono: NombreIcono }[] = [
  { href: "/camille", nombre: "Inicio", icono: "inicio" },
  { href: "/camille/anuncios", nombre: "Anuncios", icono: "anuncios" },
  { href: "/camille/calendario", nombre: "Calendario", icono: "calendario" },
  { href: "/camille/contactos", nombre: "Contactos", icono: "contactos" },
  { href: "/camille/documentos", nombre: "Documentos", icono: "documentos" },
  { href: "/camille/mapa", nombre: "Mapa", icono: "mapa" },
  { href: "/camille/informacion", nombre: "Información", icono: "informacion" },
  { href: "/camille/perfil", nombre: "Perfil", icono: "perfil" },
];

export function MenuLateral() {
  const ruta = usePathname();

  return (
    <nav className="fixed inset-y-0 left-0 z-30 hidden w-24 flex-col items-center overflow-y-auto rounded-r-3xl bg-indigo-950 py-5 sm:flex">
      {/* Espacio para el logo del IAE: se cambia por la imagen oficial cuando el coordinador lo autorice. */}
      <Link href="/camille" aria-label="Inicio" className="mb-6 flex flex-col items-center gap-1 text-white">
        <Icono nombre="birrete" className="size-8" />
        <span className="text-[10px] font-bold tracking-widest">IAE</span>
      </Link>
      <ul className="flex w-full flex-col gap-1 px-2">
        {opciones.map((o) => {
          const activa = ruta === o.href;
          return (
            <li key={o.href}>
              <Link
                href={o.href}
                aria-current={activa ? "page" : undefined}
                className={`flex flex-col items-center gap-1 rounded-2xl py-3 text-[11px] font-medium transition ${
                  activa ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30" : "text-indigo-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icono nombre={o.icono} className="size-5" />
                {o.nombre}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
