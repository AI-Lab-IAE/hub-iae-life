"use client";

import { useState } from "react";
import { borrarTodo } from "../lib/almacen";
import { botonSecundario } from "./estilos";

export function BorrarDatos() {
  const [paso, setPaso] = useState<"inicio" | "confirmar" | "listo">("inicio");

  return (
    <div className="mt-10 rounded-[20px] border border-[#d6ccb6] bg-[#f3eee2] p-6 sm:p-8">
      <h2 className="font-serif text-2xl">Borrar mis datos</h2>
      <p className="mt-2 text-[#4a5475]">Elimina todos tus diagnósticos y repasos guardados en este navegador.</p>
      {paso === "inicio" && (
        <button onClick={() => setPaso("confirmar")} className={`${botonSecundario} mt-5 px-5 py-2.5`}>
          Borrar todo
        </button>
      )}
      {paso === "confirmar" && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium">¿Seguro? No se puede deshacer.</span>
          <button
            onClick={() => {
              borrarTodo();
              setPaso("listo");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-semibold text-white"
            style={{ background: "#e0492f" }}
          >
            Sí, borrar
          </button>
          <button onClick={() => setPaso("inicio")} className={`${botonSecundario} px-5 py-2.5`}>
            Cancelar
          </button>
        </div>
      )}
      {paso === "listo" && <p className="mt-5 font-medium text-[#1f9466]">Listo: no queda nada guardado.</p>}
    </div>
  );
}
