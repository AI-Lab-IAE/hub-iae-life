"use client";

import { useState } from "react";
import anim from "../animaciones.module.css";
import { bloquesSecundaria, horarioSecundaria, salonDeEjemplo, semanaSecundaria } from "../datos";
import { retraso, tarjeta, tocar } from "./estilos";

const colores = {
  rezo: "bg-violet-400",
  clase: "bg-sky-500",
  descanso: "bg-amber-400",
};

// Horario de clases de secundaria, con una pestaña por día.
export function HorarioSemana() {
  const [elegido, setElegido] = useState(0);
  const dia = semanaSecundaria[elegido];
  const esViernes = dia.dia === "Viernes";

  // Reparte las materias del día en los periodos de clase, en orden.
  let siguiente = 0;
  const filas = bloquesSecundaria
    .map((b) => (b.tipo === "clase" ? { ...b, materia: dia.materias[siguiente++] } : { ...b, materia: undefined }))
    .filter((b) => b.tipo !== "clase" || b.materia)
    .filter((b) => !(esViernes && b.nombre === "Almuerzo"));

  return (
    <div>
      <div role="tablist" className="grid grid-cols-5 gap-1 rounded-xl bg-sky-100/70 p-1 dark:bg-sky-950">
        {semanaSecundaria.map((d, i) => (
          <button
            key={d.dia}
            role="tab"
            aria-selected={i === elegido}
            aria-label={d.dia}
            onClick={() => setElegido(i)}
            className={`${tocar} rounded-lg py-2 text-sm font-semibold ${
              i === elegido
                ? "bg-white text-sky-700 shadow-sm dark:bg-slate-900 dark:text-sky-300"
                : "text-slate-500 hover:text-sky-700 dark:text-slate-400"
            }`}
          >
            {d.corto}
          </button>
        ))}
      </div>

      {/* La "key" hace que la lista se vuelva a animar al cambiar de día. */}
      <div key={dia.dia} className={`${tarjeta} mt-3 overflow-hidden`}>
        <p className="bg-amber-50 px-4 py-2 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          Materias y salones de ejemplo: cada grupo tiene su propio horario.
        </p>
        <ol className="divide-y divide-sky-50 dark:divide-sky-900/40">
          {filas.map((b, i) => (
            <li
              key={b.nombre}
              className={`flex items-center gap-3 px-4 py-2.5 ${anim.aparecer} ${b.materia ? "" : "bg-sky-50/50 dark:bg-sky-950/30"}`}
              style={retraso(i * 0.5)}
            >
              <span className={`h-9 w-1 shrink-0 rounded-full ${colores[b.tipo]}`} aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{b.materia ?? b.nombre}</span>
                {b.materia && (
                  <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                    {b.nombre} · {salonDeEjemplo[b.materia]}
                  </span>
                )}
              </span>
              <span className="shrink-0 text-right text-xs text-slate-500 tabular-nums sm:text-sm dark:text-slate-400">
                {b.hora}
              </span>
            </li>
          ))}
        </ol>
        <p className="flex items-center justify-between gap-3 border-t border-sky-100 px-4 py-3 text-sm dark:border-sky-900/60">
          <span className="font-semibold text-sky-700 dark:text-sky-300">Salida</span>
          <span className="tabular-nums">{esViernes ? horarioSecundaria.salidaViernes : horarioSecundaria.salida}</span>
        </p>
      </div>
    </div>
  );
}
