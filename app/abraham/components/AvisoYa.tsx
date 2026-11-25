"use client";

import { useState } from "react";
import { useCuenta } from "../../_life/cuenta";
import { Pestanas } from "../../_life/Pantalla";
import { reiniciar } from "../almacen";
import { VistaEstudiante } from "./VistaEstudiante";
import { VistaProfesor } from "./VistaProfesor";

type Vista = "profesor" | "estudiante";

// Las dos caras de Avisos en una sola página: quien manda el aviso y quien lo recibe.
// Abre en la vista que corresponde a tu cuenta de IAE LIFE (profesor o estudiante).
export function AvisoYa() {
  const cuenta = useCuenta();
  const [elegida, setVista] = useState<Vista | null>(null);
  const vista: Vista = elegida ?? (cuenta?.rol === "profesor" ? "profesor" : "estudiante");

  return (
    <div className="flex flex-col gap-6">
      <Pestanas
        etiqueta="Vista"
        opciones={[
          { id: "estudiante", texto: "Estudiante" },
          { id: "profesor", texto: "Profesor" },
        ]}
        valor={vista}
        onCambio={setVista}
      />

      {vista === "profesor" ? <VistaProfesor /> : <VistaEstudiante />}

      <button type="button" onClick={reiniciar} className="min-h-11 self-start text-sm text-azul-900/60 underline">
        Reiniciar la demo
      </button>
    </div>
  );
}
