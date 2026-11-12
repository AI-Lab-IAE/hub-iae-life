"use client";

import { useEffect, useRef, useState } from "react";
import FormularioAusencia, { type Ausencia } from "./FormularioAusencia";
import TarjetaCorreo from "./TarjetaCorreo";
import { fechaEnPalabras, generarCorreos } from "../lib/correos";

// Une el formulario con los correos generados.
export default function AvisIA() {
  const [ausencia, setAusencia] = useState<Ausencia | null>(null);
  const resultado = useRef<HTMLElement>(null);

  // Al generar, baja la página hasta el resultado para que se vea.
  useEffect(() => {
    if (ausencia) resultado.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [ausencia]);

  const correos = ausencia ? generarCorreos(ausencia) : [];

  return (
    <div className="mt-8 space-y-6">
      <FormularioAusencia onEnviar={setAusencia} />

      {ausencia && (
        <section ref={resultado} className="scroll-mt-20 space-y-4">
          <div>
            <h2 className="text-xl font-bold">
              {correos.length === 1 ? "1 correo listo" : `${correos.length} correos listos`}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Para tu ausencia del {fechaEnPalabras(ausencia.fecha)}. Copia cada uno y envíalo desde tu correo.
            </p>
          </div>
          {correos.map((c) => (
            <TarjetaCorreo key={c.profesor.correo} correo={c} />
          ))}
        </section>
      )}
    </div>
  );
}
