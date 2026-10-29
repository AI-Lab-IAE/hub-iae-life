"use client";

import { useState } from "react";
import { marcarVisto, useAvisos } from "../almacen";
import { estudiantes } from "../datos";
import { fechaHora } from "../formato";

export function VistaEstudiante() {
  const avisos = useAvisos();
  const [yo, setYo] = useState(estudiantes[0].id);

  const mios = avisos.filter((a) => a.destinatarios.includes(yo));
  const sinVer = mios.filter((a) => !a.vistos[yo]).length;

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Entrar como</span>
        <select
          value={yo}
          onChange={(e) => setYo(e.target.value)}
          className="min-h-11 rounded-xl border border-zinc-300 bg-transparent px-3 dark:border-zinc-700"
        >
          {estudiantes.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre} · {e.salon}
            </option>
          ))}
        </select>
      </label>

      <p className="text-sm text-zinc-500" role="status">
        {sinVer ? `Tienes ${sinVer} aviso(s) sin ver.` : "Estás al día."}
      </p>

      <ul className="flex flex-col gap-3">
        {mios.map((a) => {
          const visto = !!a.vistos[yo];
          return (
            <li
              key={a.id}
              className={`rounded-2xl border p-4 ${
                visto
                  ? "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                  : a.urgente
                    ? "border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/40"
                    : "border-blue-300 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
                <span>{fechaHora(a.creado)}</span>
                <span>· {a.audiencia}</span>
                {a.urgente && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-950 dark:text-red-200">
                    Urgente
                  </span>
                )}
              </div>
              <p className="mt-1">{a.texto}</p>
              {visto ? (
                <p className="mt-3 text-sm text-green-700 dark:text-green-400">✓ Visto {fechaHora(a.vistos[yo])}</p>
              ) : (
                <button
                  type="button"
                  onClick={() => marcarVisto(a.id, yo)}
                  className="mt-3 min-h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white"
                >
                  Marcar como visto
                </button>
              )}
            </li>
          );
        })}
        {!mios.length && <li className="text-sm text-zinc-500">No tienes avisos.</li>}
      </ul>
    </div>
  );
}
