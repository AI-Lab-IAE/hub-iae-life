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
        <span className="text-sm font-medium text-azul-900">Ver como (estudiantes de ejemplo)</span>
        <select
          value={yo}
          onChange={(e) => setYo(e.target.value)}
          className="min-h-11 rounded-xl border border-azul-200 bg-white px-3"
        >
          {estudiantes.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre} · {e.salon}
            </option>
          ))}
        </select>
      </label>

      <p className="text-sm text-azul-900/60" role="status">
        {sinVer ? `Tienes ${sinVer} aviso(s) sin ver.` : "Estás al día."}
      </p>

      <ul className="flex flex-col gap-3">
        {mios.map((a) => {
          const visto = !!a.vistos[yo];
          return (
            <li
              key={a.id}
              className={`rounded-3xl border p-5 shadow-sm ${
                visto
                  ? "border-azul-100 bg-white"
                  : a.urgente
                    ? "border-red-300 bg-red-50"
                    : "border-azul-300 bg-azul-50"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2 text-sm text-azul-900/60">
                <span>{fechaHora(a.creado)}</span>
                <span>· {a.audiencia}</span>
                {a.urgente && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                    Urgente
                  </span>
                )}
              </div>
              <p className="mt-1">{a.texto}</p>
              {visto ? (
                <p className="mt-3 text-sm text-green-700">✓ Visto {fechaHora(a.vistos[yo])}</p>
              ) : (
                <button
                  type="button"
                  onClick={() => marcarVisto(a.id, yo)}
                  className="mt-3 min-h-11 rounded-2xl bg-azul-800 px-5 text-sm font-semibold text-white transition hover:bg-azul-900"
                >
                  Marcar como visto
                </button>
              )}
            </li>
          );
        })}
        {!mios.length && <li className="text-sm text-azul-900/60">No tienes avisos.</li>}
      </ul>
    </div>
  );
}
