"use client";

import { useState } from "react";
import anim from "../animaciones.module.css";
import { anuncios } from "../datos";
import { diaYMes, formatearFecha } from "../formato";
import { retraso, tarjeta } from "./estilos";
import { Filtros } from "./Filtros";
import { Icono } from "./Icono";

type Filtro = "todos" | "importantes";

// Lista de anuncios con filtro. Cada anuncio se abre al tocarlo para leer el detalle.
export function ListaAnuncios() {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const ordenados = [...anuncios].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const visibles = filtro === "importantes" ? ordenados.filter((a) => a.importante) : ordenados;

  return (
    <div>
      <Filtros
        elegido={filtro}
        alElegir={setFiltro}
        opciones={[
          { valor: "todos", nombre: "Todos", cantidad: ordenados.length },
          { valor: "importantes", nombre: "Importantes", cantidad: ordenados.filter((a) => a.importante).length },
        ]}
      />
      <ul key={filtro} className="mt-4 flex flex-col gap-3">
        {visibles.map((a, i) => {
          const { dia, mes } = diaYMes(a.fecha);
          return (
            <li key={a.titulo} className={anim.aparecer} style={retraso(i)}>
              <details className={`${tarjeta} group overflow-hidden open:ring-2 open:ring-sky-200 dark:open:ring-sky-900`}>
                <summary className="flex cursor-pointer list-none items-start gap-3 p-4 [&::-webkit-details-marker]:hidden">
                  <span className="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl bg-sky-50 leading-none text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                    <span className="text-lg font-bold">{dia}</span>
                    <span className="text-[10px] uppercase">{mes}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    {a.importante && (
                      <span className="mb-1 inline-block rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        Importante
                      </span>
                    )}
                    <span className="block font-semibold">{a.titulo}</span>
                    <span className="mt-0.5 block text-sm text-slate-500 dark:text-slate-400">{a.texto}</span>
                  </span>
                  <Icono nombre="adelante" className="mt-1 size-5 shrink-0 text-slate-400 transition group-open:rotate-90" />
                </summary>
                <div className="border-t border-sky-50 bg-sky-50/50 px-4 py-3 text-sm dark:border-sky-900/40 dark:bg-sky-950/30">
                  <p>{a.detalle}</p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Publicado el {formatearFecha(a.fecha)}</p>
                </div>
              </details>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
