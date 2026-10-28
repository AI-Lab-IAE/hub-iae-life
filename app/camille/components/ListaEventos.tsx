"use client";

import { useState } from "react";
import anim from "../animaciones.module.css";
import { eventos } from "../datos";
import { diaYMes } from "../formato";
import { retraso, tarjeta } from "./estilos";
import { Filtros } from "./Filtros";
import { diasHasta, textoFaltan, useHoy } from "./hoy";

type Tipo = (typeof eventos)[number]["tipo"];

const estilos: Record<Tipo, { fecha: string; etiqueta: string; plural: string }> = {
  Examen: {
    fecha: "bg-blue-900 text-white",
    etiqueta: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
    plural: "Exámenes",
  },
  Evento: {
    fecha: "bg-emerald-500 text-white",
    etiqueta: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
    plural: "Eventos",
  },
  Vacaciones: {
    fecha: "bg-violet-500 text-white",
    etiqueta: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
    plural: "Vacaciones",
  },
};

// Calendario agrupado por mes, con filtro por tipo y cuántos días faltan.
export function ListaEventos() {
  const [filtro, setFiltro] = useState<Tipo | "todos">("todos");
  const hoy = useHoy();

  const ordenados = [...eventos].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const visibles = filtro === "todos" ? ordenados : ordenados.filter((e) => e.tipo === filtro);

  // Agrupa por mes: "noviembre de 2026" → [eventos].
  const meses = new Map<string, typeof visibles>();
  for (const e of visibles) {
    const mes = new Date(`${e.fecha}T12:00:00`).toLocaleDateString("es-PA", { month: "long", year: "numeric" });
    meses.set(mes, [...(meses.get(mes) ?? []), e]);
  }

  const tipos = Object.keys(estilos) as Tipo[];

  return (
    <div>
      <Filtros
        elegido={filtro}
        alElegir={setFiltro}
        opciones={[
          { valor: "todos", nombre: "Todos", cantidad: ordenados.length },
          ...tipos.map((t) => ({ valor: t, nombre: estilos[t].plural, cantidad: ordenados.filter((e) => e.tipo === t).length })),
        ]}
      />

      <div key={filtro}>
        {[...meses].map(([mes, lista], m) => (
          <section key={mes} className={`mt-6 ${anim.aparecer}`} style={retraso(m)}>
            <h2 className="mb-3 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">{mes}</h2>
            <ol className="flex flex-col gap-3">
              {lista.map((e) => {
                const { dia, mes: mesCorto } = diaYMes(e.fecha);
                const faltan = hoy ? diasHasta(hoy, e.fecha) : null;
                return (
                  <li key={e.titulo} className={`${tarjeta} flex items-center gap-3 p-3 ${faltan != null && faltan < 0 ? "opacity-60" : ""}`}>
                    <span className={`flex size-12 shrink-0 flex-col items-center justify-center rounded-xl leading-none shadow-sm ${estilos[e.tipo].fecha}`}>
                      <span className="text-lg font-bold">{dia}</span>
                      <span className="text-[10px] uppercase">{mesCorto}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{e.titulo}</span>
                      <span className="block text-sm text-slate-500 dark:text-slate-400">{e.descripcion}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${estilos[e.tipo].etiqueta}`}>{e.tipo}</span>
                        {faltan != null && (
                          <span className="text-xs font-medium text-blue-900 dark:text-blue-400">{textoFaltan(faltan)}</span>
                        )}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
