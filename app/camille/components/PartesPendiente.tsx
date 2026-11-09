"use client";

import { diaYMes } from "../formato";
import { tocar } from "./estilos";
import { useHoy } from "./hoy";
import { Icono } from "./Icono";
import { cambiarHecho, entrega, type Pendiente } from "./pendientes";

// Círculo para marcar un pendiente como hecho.
export function BotonHecho({ pendiente }: { pendiente: Pendiente }) {
  return (
    <button
      type="button"
      aria-pressed={pendiente.hecho}
      aria-label={`Marcar como hecho: ${pendiente.titulo}`}
      onClick={() => cambiarHecho(pendiente.id)}
      className={`${tocar} flex size-7 shrink-0 items-center justify-center rounded-full border-2 ${
        pendiente.hecho
          ? "border-emerald-500 bg-emerald-500 text-white"
          : "border-slate-300 text-transparent hover:border-indigo-400 dark:border-slate-600"
      }`}
    >
      <Icono nombre="check" className="size-4" />
    </button>
  );
}

// Fecha de entrega con color según lo cerca que está.
export function EtiquetaEntrega({ pendiente }: { pendiente: Pendiente }) {
  const hoy = useHoy();
  if (!hoy || !pendiente.fecha) return null;

  const { texto, dias } = entrega(hoy, pendiente.fecha);
  const { dia, mes } = diaYMes(pendiente.fecha);
  const color = pendiente.hecho
    ? "text-slate-400"
    : dias < 0
      ? "text-rose-600 dark:text-rose-400"
      : dias <= 1
        ? "text-amber-700 dark:text-amber-400"
        : "text-indigo-700 dark:text-indigo-300";

  return (
    <span className={`inline-flex items-center gap-1 font-medium ${color}`}>
      <Icono nombre="reloj" className="size-3.5" />
      {dia} {mes}
      {!pendiente.hecho && ` · ${texto}`}
    </span>
  );
}
