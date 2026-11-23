"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import { iniciales, useCuenta } from "./cuenta";

// Arriba a la derecha: "Entrar" si nadie entró, o tu foto/iniciales para ir a tu perfil.
export default function BotonCuenta() {
  const cuenta = useCuenta();

  if (cuenta === undefined) return <span className="block size-9" aria-hidden />;

  if (!cuenta) {
    return (
      <Link
        href="/entrar"
        className="flex items-center gap-2 rounded-full bg-azul-800 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-azul-900"
      >
        <LogIn className="size-4" aria-hidden /> Entrar
      </Link>
    );
  }

  return (
    <Link href="/perfil" aria-label={`Mi perfil: ${cuenta.nombre}`} title={cuenta.nombre} className="block rounded-full">
      {cuenta.foto ? (
        // eslint-disable-next-line @next/next/no-img-element -- la foto viene de Google y cambia por usuario
        <img src={cuenta.foto} alt="" referrerPolicy="no-referrer" className="size-9 rounded-full ring-2 ring-azul-100" />
      ) : (
        <span
          className="grid size-9 place-items-center rounded-full text-sm font-bold text-white ring-2 ring-azul-100"
          style={{ backgroundColor: cuenta.color ?? "#1d3a8a" }}
        >
          {iniciales(cuenta.nombre)}
        </span>
      )}
    </Link>
  );
}
