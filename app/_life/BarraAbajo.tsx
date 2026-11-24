"use client";

// Barra de abajo en el celular (boceto de Camille): Hoy, Estudiar, Tareas, Avisos y Perfil.
// En computadora no sale; ahí se usa la barra de arriba. En el HUB (/hub y /coordinador) tampoco.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ClipboardCheck, Home, Megaphone, UserRound } from "lucide-react";

const PESTANAS = [
  { href: "/hoy", texto: "Hoy", icono: Home },
  { href: "/marco", texto: "Estudiar", icono: BookOpen },
  { href: "/daniela", texto: "Tareas", icono: ClipboardCheck },
  { href: "/abraham", texto: "Avisos", icono: Megaphone },
  { href: "/perfil", texto: "Perfil", icono: UserRound },
];

export default function BarraAbajo() {
  const ruta = usePathname();
  if (ruta.startsWith("/hub") || ruta.startsWith("/coordinador")) return null;

  return (
    <>
      <div className="h-[calc(4.5rem+env(safe-area-inset-bottom))] md:hidden" aria-hidden />
      <nav
        aria-label="Principal"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-azul-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-5">
          {PESTANAS.map((p) => {
            const activa = ruta === p.href || ruta.startsWith(`${p.href}/`);
            return (
              <li key={p.href}>
                <Link
                  href={p.href}
                  aria-current={activa ? "page" : undefined}
                  className={`flex flex-col items-center gap-1 pb-2 pt-2.5 text-xs font-medium ${
                    activa ? "text-azul-800" : "text-azul-900/55"
                  }`}
                >
                  <p.icono className="size-6" strokeWidth={activa ? 2.4 : 1.8} aria-hidden />
                  {p.texto}
                  <span className={`h-1 w-8 rounded-full ${activa ? "bg-azul-800" : "bg-transparent"}`} aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
