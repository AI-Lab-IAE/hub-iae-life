"use client";

import Link from "next/link";
import { useState } from "react";
import type { Club } from "../datos";
import { tocar } from "./estilos";
import { Icono } from "./Icono";
import { agregarPendiente, usePendientes } from "./pendientes";

// Anota en "Mis pendientes" hablar con el encargado: para intentar unirse o, si está cerrado, para preguntar.
export function BotonUnirme({ club }: { club: Club }) {
  const { listo, pendientes } = usePendientes();
  const [error, setError] = useState(false);
  const titulo = club.abierto ? `Intentar unirme a ${club.nombre}` : `Preguntar cuándo abre ${club.nombre}`;

  if (!listo) return <div className="h-12 animate-pulse rounded-xl bg-indigo-100 dark:bg-slate-800" />;

  if (pendientes.some((p) => p.titulo === titulo)) {
    return (
      <Link
        href="/camille/pendientes"
        className={`${tocar} flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200`}
      >
        <Icono nombre="check" className="size-5" /> Ya está en tus pendientes
      </Link>
    );
  }

  function anotar() {
    const guardado = agregarPendiente({
      titulo,
      materia: "Clubes",
      tipo: "Otro",
      fecha: "",
      notas: `${club.abierto ? "Preguntarle" : "Por ahora no recibe integrantes. Preguntarle"} a ${club.encargado} ${club.abierto ? "si hay cupo" : "cuándo vuelve a abrir"}. Se reúnen los ${club.dia.toLowerCase()} a las ${club.hora} en ${club.lugar}.`,
    });
    setError(!guardado);
  }

  return (
    <>
      <button
        onClick={anotar}
        className={`${tocar} flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-700`}
      >
        <Icono nombre="mas" className="size-5" /> {club.abierto ? "Quiero intentar unirme" : "Preguntar cuándo abre"}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-400">
          Tu navegador no dejó guardar. Revisa que no estés en modo privado.
        </p>
      )}
    </>
  );
}
