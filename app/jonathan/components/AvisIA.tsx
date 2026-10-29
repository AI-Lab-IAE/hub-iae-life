"use client";

import { useEffect, useRef, useState } from "react";
import FormularioAusencia, { type Ausencia } from "./FormularioAusencia";

// Une el formulario con el resultado. Por ahora muestra un resumen;
// en los siguientes pasos aquí aparecen los correos por profesor.
export default function AvisIA() {
  const [ausencia, setAusencia] = useState<Ausencia | null>(null);
  const resultado = useRef<HTMLElement>(null);

  // Al generar, baja la página hasta el resultado para que se vea.
  useEffect(() => {
    if (ausencia) resultado.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [ausencia]);

  return (
    <div className="mt-8 space-y-6">
      <FormularioAusencia onEnviar={setAusencia} />

      {ausencia && (
        <section ref={resultado} className="scroll-mt-4 rounded-2xl bg-zinc-100 p-5 dark:bg-zinc-900">
          <h2 className="font-semibold">Resumen</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {ausencia.fecha} · {ausencia.clases.length} clase(s) · {ausencia.motivo}
          </p>
          <ul className="mt-3 list-disc pl-5 text-sm">
            {ausencia.clases.map((c) => (
              <li key={c.inicio}>
                {c.inicio} {c.materia} ({c.profesor.nombre})
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
