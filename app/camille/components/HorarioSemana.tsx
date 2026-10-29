"use client";

import { useState } from "react";
import anim from "../animaciones.module.css";
import { horarioSecundaria, semanaSecundaria } from "../datos";
import { filasDelDia } from "./horario";
import { retraso, tarjeta, tocar } from "./estilos";

const colores = {
  rezo: "bg-violet-400",
  clase: "bg-indigo-600",
  descanso: "bg-amber-400",
};

// Horario de clases de secundaria, con una pestaña por día.
export function HorarioSemana() {
  const [elegido, setElegido] = useState(0);
  const dia = semanaSecundaria[elegido];
  const esViernes = dia.dia === "Viernes";

  const filas = filasDelDia(elegido);

  return (
    <div>
      <div role="tablist" className="grid grid-cols-5 gap-1 rounded-xl bg-indigo-100/70 p-1 dark:bg-indigo-950">
        {semanaSecundaria.map((d, i) => (
          <button
            key={d.dia}
            role="tab"
            aria-selected={i === elegido}
            aria-label={d.dia}
            onClick={() => setElegido(i)}
            className={`${tocar} rounded-lg py-2 text-sm font-semibold ${
              i === elegido
                ? "bg-white text-indigo-700 shadow-sm dark:bg-slate-900 dark:text-indigo-300"
                : "text-slate-500 hover:text-indigo-700 dark:text-slate-400"
            }`}
          >
            {d.corto}
          </button>
        ))}
      </div>

      {/* La "key" hace que la lista se vuelva a animar al cambiar de día. */}
      <div key={dia.dia} className={`${tarjeta} mt-3 overflow-hidden`}>
        <p className="bg-amber-50 px-4 py-2 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          Cada grupo tiene sus propias materias; aquí solo van las horas de clase.
        </p>
        <ol className="divide-y divide-slate-100 dark:divide-slate-800">
          {filas.map((b, i) => (
            <li
              key={b.nombre}
              className={`flex items-center gap-3 px-4 py-2.5 ${anim.aparecer} ${b.clase ? "" : "bg-indigo-50/50 dark:bg-indigo-950/30"}`}
              style={retraso(i * 0.5)}
            >
              <span className={`h-9 w-1 shrink-0 rounded-full ${colores[b.tipo]}`} aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{b.clase ? `Clase número ${b.clase}` : b.nombre}</span>
                {b.clase && <span className="block text-xs text-slate-500 dark:text-slate-400">{b.nombre}</span>}
              </span>
              <span className="shrink-0 text-right text-xs text-slate-500 tabular-nums sm:text-sm dark:text-slate-400">
                {b.hora}
              </span>
            </li>
          ))}
        </ol>
        <p className="flex items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm dark:border-slate-800">
          <span className="font-semibold text-indigo-700 dark:text-indigo-300">Salida</span>
          <span className="tabular-nums">{esViernes ? horarioSecundaria.salidaViernes : horarioSecundaria.salida}</span>
        </p>
      </div>
    </div>
  );
}
