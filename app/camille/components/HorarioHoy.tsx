"use client";

import Link from "next/link";
import anim from "../animaciones.module.css";
import { retraso, tarjeta } from "./estilos";
import { aMinutos, filasDelDia } from "./horario";
import { useAhora, useHoy } from "./hoy";
import { Icono } from "./Icono";
import { esSecundaria, usePerfil } from "./perfil";

// "13:30" → "1:30", para la columna de horas.
function horaCorta(hora: string) {
  const [h, m] = hora.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")}`;
}

// Línea de tiempo del horario de hoy, con el bloque que toca ahora resaltado.
export function HorarioHoy() {
  const hoy = useHoy();
  const ahora = useAhora();
  const { perfil } = usePerfil();

  if (!hoy || ahora == null) return <div className={`${tarjeta} h-96 animate-pulse`} />;

  const diaSemana = new Date(`${hoy}T12:00:00`).getDay();
  const finDeSemana = diaSemana === 0 || diaSemana === 6;

  if (perfil && !esSecundaria(perfil)) {
    return <Mensaje texto="El horario de primaria estará disponible pronto." />;
  }
  if (finDeSemana) {
    return <Mensaje texto="Hoy no hay clases. ¡Buen fin de semana!" />;
  }

  const filas = filasDelDia(diaSemana - 1);
  const inicio = aMinutos(filas[0].desde);
  const fin = aMinutos(filas.at(-1)!.hasta);
  const estado = ahora < inicio ? "Antes de clases" : ahora >= fin ? "Clases terminadas" : "En clases";

  return (
    <div className={`${tarjeta} p-4`}>
      <p className="mb-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Secundaria · {filas.filter((f) => f.clase).length} clases</span>
        <span className="rounded-full bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
          {estado}
        </span>
      </p>
      <ol className="flex flex-col gap-2">
        {filas.map((b, i) => {
          const desde = aMinutos(b.desde);
          const hasta = aMinutos(b.hasta);
          const esAhora = ahora >= desde && ahora < hasta;
          const yaPaso = ahora >= hasta;
          // Cuánto lleva el bloque actual, de 0 a 100.
          const avance = esAhora ? ((ahora - desde) / (hasta - desde)) * 100 : 0;
          return (
            <li
              key={b.nombre}
              className={`flex gap-3 transition-opacity duration-500 ${anim.aparecer} ${yaPaso ? "opacity-50" : ""}`}
              style={retraso(i * 0.6)}
            >
              <span className="w-10 shrink-0 pt-2.5 text-right text-xs text-slate-400 tabular-nums">{horaCorta(b.desde)}</span>
              <span
                className={`relative flex flex-1 items-start justify-between gap-2 overflow-hidden rounded-xl px-3 py-2 transition duration-300 ${
                  esAhora
                    ? "scale-[1.02] bg-indigo-600 text-white shadow-lg shadow-indigo-500/40"
                    : b.clase
                      ? "bg-slate-50 dark:bg-slate-800/60"
                      : "border border-dashed border-slate-200 dark:border-slate-700"
                }`}
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{b.clase ? `Clase número ${b.clase}` : b.nombre}</span>
                  <span className={`block text-xs ${esAhora ? "text-indigo-100" : "text-slate-500 dark:text-slate-400"}`}>
                    {b.clase ? `${b.nombre} · ` : ""}
                    {b.hora}
                  </span>
                </span>
                {esAhora && (
                  <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold">
                    <span className={`size-1.5 rounded-full bg-white ${anim.latido}`} aria-hidden="true" />
                    Ahora
                  </span>
                )}
                {/* Barra que avanza mientras pasa la clase. */}
                {esAhora && (
                  <span className="absolute inset-x-0 bottom-0 h-1 bg-white/15" aria-hidden="true">
                    <span className="block h-full rounded-r-full bg-white/70 transition-[width] duration-1000" style={{ width: `${avance}%` }} />
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ol>
      <Link
        href="/camille/informacion"
        className="mt-3 flex items-center justify-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
      >
        Ver horario de la semana <Icono nombre="adelante" className="size-4" />
      </Link>
    </div>
  );
}

function Mensaje({ texto }: { texto: string }) {
  return (
    <div className={`${tarjeta} flex flex-col items-center gap-2 p-6 text-center text-sm text-slate-500 dark:text-slate-400`}>
      <Icono nombre="reloj" className="size-8 text-indigo-300" />
      {texto}
      <Link href="/camille/informacion" className="font-medium text-indigo-600 dark:text-indigo-400">
        Ver horario de la semana
      </Link>
    </div>
  );
}
