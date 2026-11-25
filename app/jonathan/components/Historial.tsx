"use client";

import { useState } from "react";
import { Archive, ChevronDown, Trash } from "lucide-react";
import { fechaEnPalabras } from "../lib/correos";
import { borrarDelHistorial, useHistorial } from "../lib/historial";

// Ausencias ya avisadas por esta cuenta (solo en este navegador).
export default function Historial({ correo }: { correo: string }) {
  const historial = useHistorial(correo);
  const [abierto, setAbierto] = useState<string | null>(null);

  if (historial.length === 0) return null;

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-azul-900/5">
      <h2 className="flex items-center gap-2 font-bold text-azul-950">
        <Archive className="size-5 text-azul-700" aria-hidden />
        Ausencias que ya avisaste
      </h2>
      <ul className="mt-2 divide-y divide-azul-100">
        {historial.map((r) => {
          const ver = abierto === r.id;
          return (
            <li key={r.id} className="py-2">
              <button
                type="button"
                onClick={() => setAbierto(ver ? null : r.id)}
                aria-expanded={ver}
                className="flex min-h-12 w-full items-center gap-3 rounded-xl text-left"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-azul-950 first-letter:uppercase">
                    {fechaEnPalabras(r.fecha)}
                  </span>
                  <span className="block truncate text-xs text-azul-900/60">
                    {r.motivo} · {r.total} {r.total === 1 ? "correo" : "correos"}
                  </span>
                </span>
                <ChevronDown
                  className={`size-5 shrink-0 text-azul-700 transition-transform ${ver ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
              {ver && (
                <div className="mt-2 space-y-2">
                  <ul className="space-y-1 rounded-xl bg-azul-50/70 px-3 py-2 text-sm">
                    {r.profesores.map((p, i) => (
                      <li key={i} className="text-azul-900">
                        <span className="font-medium">{p.profesor}</span>
                        <span className="text-azul-900/60"> · {p.materias}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => borrarDelHistorial(correo, r.id)}
                    className="flex min-h-10 items-center gap-1.5 rounded-xl px-2 text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    <Trash className="size-4" aria-hidden />
                    Borrar del historial
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
