import Link from "next/link";
import type { Club } from "../datos";
import { tocar } from "./estilos";
import { Icono } from "./Icono";

// Anota en Tareas (la única lista de pendientes de IAE LIFE) hablar con el encargado:
// abre "Agregar trabajo" en Tareas con el nombre y la materia ya escritos.
export function BotonUnirme({ club }: { club: Club }) {
  const titulo = club.abierto ? `Intentar unirme a ${club.nombre}` : `Preguntar cuándo abre ${club.nombre}`;
  const href = `/daniela?${new URLSearchParams({ nueva: titulo, materia: "Clubes" })}`;

  return (
    <Link
      href={href}
      className={`${tocar} flex w-full items-center justify-center gap-2 rounded-2xl bg-azul-800 py-3 font-semibold text-white hover:bg-azul-900`}
    >
      <Icono nombre="mas" className="size-5" /> {club.abierto ? "Quiero intentar unirme" : "Preguntar cuándo abre"}
    </Link>
  );
}
