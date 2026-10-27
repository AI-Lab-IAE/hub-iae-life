"use client";

import { useState } from "react";
import anim from "../animaciones.module.css";
import { horariosEscolares, porConfirmar } from "../datos";
import { retraso, tarjeta, tocar } from "./estilos";

const colores = {
  rezo: "bg-violet-400",
  clase: "bg-sky-500",
  descanso: "bg-amber-400",
};

// Horario general del día con pestañas para Primaria y Secundaria.
export function HorarioNiveles() {
  const [elegido, setElegido] = useState(0);
  const horario = horariosEscolares[elegido];

  return (
    <div>
      <div role="tablist" className="grid grid-cols-2 gap-1 rounded-xl bg-sky-100/70 p-1 dark:bg-sky-950">
        {horariosEscolares.map((h, i) => (
          <button
            key={h.nivel}
            role="tab"
            aria-selected={i === elegido}
            onClick={() => setElegido(i)}
            className={`${tocar} rounded-lg py-2 text-sm font-semibold ${
              i === elegido
                ? "bg-white text-sky-700 shadow-sm dark:bg-slate-900 dark:text-sky-300"
                : "text-slate-500 hover:text-sky-700 dark:text-slate-400"
            }`}
          >
            {h.nivel}
          </button>
        ))}
      </div>

      {/* La "key" hace que la lista se vuelva a animar al cambiar de pestaña. */}
      <div key={horario.nivel} className={`${tarjeta} mt-3 overflow-hidden`}>
        <p className="bg-sky-50 px-4 py-2 text-xs text-sky-800 dark:bg-sky-950 dark:text-sky-200">
          Las horas pueden cambiar según tu grado o grupo.
        </p>
        <ol className="divide-y divide-sky-50 dark:divide-sky-900/40">
          {horario.bloques.map((b, i) => (
            <li
              key={i}
              className={`flex items-center gap-3 px-4 py-2.5 ${anim.aparecer} ${b.tipo !== "clase" ? "bg-sky-50/50 dark:bg-sky-950/30" : ""}`}
              style={retraso(i * 0.5)}
            >
              <span className={`h-8 w-1 shrink-0 rounded-full ${colores[b.tipo]}`} aria-hidden="true" />
              <span className={`flex-1 text-sm ${b.tipo === "clase" ? "" : "font-semibold"}`}>
                {b.nombre}
                {"soloLunesAJueves" in b && (
                  <span className="ml-2 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    Lun a jue
                  </span>
                )}
              </span>
              <HoraTexto hora={b.hora} />
            </li>
          ))}
        </ol>
        <p className="flex items-center justify-between gap-3 border-t border-sky-100 px-4 py-3 text-sm dark:border-sky-900/60">
          <span className="font-semibold text-sky-700 dark:text-sky-300">Salida del viernes</span>
          <HoraTexto hora={horario.salidaViernes} />
        </p>
      </div>
    </div>
  );
}

// Muestra una hora, o una etiqueta gris si todavía falta el dato.
function HoraTexto({ hora }: { hora: string }) {
  if (hora === porConfirmar) {
    return (
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        {porConfirmar}
      </span>
    );
  }
  return <span className="text-right text-sm text-slate-500 tabular-nums dark:text-slate-400">{hora}</span>;
}
