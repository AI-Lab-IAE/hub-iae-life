"use client";

import { useState } from "react";
import { reiniciar } from "../almacen";
import { VistaEstudiante } from "./VistaEstudiante";
import { VistaProfesor } from "./VistaProfesor";

type Vista = "profesor" | "estudiante";

// Las dos caras de AvisoYa en una sola página: quien manda el aviso y quien lo recibe.
export function AvisoYa() {
  const [vista, setVista] = useState<Vista>("profesor");

  return (
    <div className="mt-6 flex flex-col gap-6">
      <div role="tablist" aria-label="Vista" className="grid grid-cols-2 gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
        {(["profesor", "estudiante"] as const).map((v) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={vista === v}
            onClick={() => setVista(v)}
            className={`min-h-11 rounded-lg text-sm font-semibold ${
              vista === v ? "bg-white shadow-sm dark:bg-zinc-950" : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            {v === "profesor" ? "Profesor" : "Estudiante"}
          </button>
        ))}
      </div>

      {vista === "profesor" ? <VistaProfesor /> : <VistaEstudiante />}

      <button
        type="button"
        onClick={reiniciar}
        className="min-h-11 self-start text-sm text-zinc-500 underline"
      >
        Reiniciar la demo
      </button>
    </div>
  );
}
