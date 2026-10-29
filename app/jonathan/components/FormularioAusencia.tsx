"use client";

import { useState } from "react";
import { HORARIO, type Clase, type Dia } from "../lib/horario";
import { diaDeFecha, NOMBRES_DIAS } from "../lib/fechas";

export type Ausencia = {
  fecha: string;
  dia: Dia;
  clases: Clase[];
  motivo: string;
};

export default function FormularioAusencia({ onEnviar }: { onEnviar: (a: Ausencia) => void }) {
  const [fecha, setFecha] = useState("");
  // Guarda la hora de inicio de cada clase marcada.
  const [marcadas, setMarcadas] = useState<string[]>([]);
  const [motivo, setMotivo] = useState("");

  const dia = fecha ? diaDeFecha(fecha) : null;
  const clasesDelDia = dia ? HORARIO[dia] : [];
  const todasMarcadas = clasesDelDia.length > 0 && marcadas.length === clasesDelDia.length;
  const listo = dia !== null && marcadas.length > 0 && motivo.trim() !== "";

  function cambiarFecha(nueva: string) {
    setFecha(nueva);
    setMarcadas([]); // cada día tiene otras clases
  }

  function alternar(inicio: string) {
    setMarcadas((m) => (m.includes(inicio) ? m.filter((x) => x !== inicio) : [...m, inicio]));
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!listo) return;
    onEnviar({
      fecha,
      dia,
      clases: clasesDelDia.filter((c) => marcadas.includes(c.inicio)),
      motivo: motivo.trim(),
    });
  }

  return (
    <form onSubmit={enviar} className="space-y-6 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
      <div>
        <label htmlFor="fecha" className="block text-sm font-medium">
          1. ¿Qué día vas a faltar?
        </label>
        <input
          id="fecha"
          type="date"
          value={fecha}
          onChange={(e) => cambiarFecha(e.target.value)}
          className="mt-2 w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
        />
        {fecha && !dia && (
          <p className="mt-2 text-sm text-amber-600">Ese día es fin de semana, no pierdes ninguna clase.</p>
        )}
      </div>

      {dia && (
        <fieldset>
          <div className="flex items-center justify-between gap-2">
            <legend className="text-sm font-medium">2. ¿Qué clases vas a perder el {NOMBRES_DIAS[dia].toLowerCase()}?</legend>
            <button
              type="button"
              onClick={() => setMarcadas(todasMarcadas ? [] : clasesDelDia.map((c) => c.inicio))}
              className="shrink-0 text-sm font-medium text-blue-600 hover:underline"
            >
              {todasMarcadas ? "Desmarcar todas" : "Marcar todas"}
            </button>
          </div>
          <ul className="mt-2 space-y-2">
            {clasesDelDia.map((c) => (
              <li key={c.inicio}>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 px-3 py-2 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 dark:border-zinc-800 dark:has-[:checked]:bg-blue-950">
                  <input
                    type="checkbox"
                    checked={marcadas.includes(c.inicio)}
                    onChange={() => alternar(c.inicio)}
                    className="size-4"
                  />
                  <span className="w-28 shrink-0 text-sm text-zinc-500">
                    {c.inicio} – {c.fin}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium">{c.materia}</span>
                    <span className="block truncate text-sm text-zinc-500">{c.profesor.nombre}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      )}

      <div>
        <label htmlFor="motivo" className="block text-sm font-medium">
          3. ¿Por qué vas a faltar?
        </label>
        <textarea
          id="motivo"
          rows={3}
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Por ejemplo: voy a representar al colegio en una competencia de matemáticas."
          className="mt-2 w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
        />
      </div>

      <button
        type="submit"
        disabled={!listo}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Generar correos
      </button>
    </form>
  );
}
