"use client";

import { useState } from "react";
import anim from "../animaciones.module.css";
import { contactos } from "../datos";
import { retraso, tarjeta } from "./estilos";
import { Icono } from "./Icono";

// Quita acentos y mayúsculas para que "matematicas" encuentre "Matemáticas".
function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Lista de contactos con buscador por nombre, cargo u oficina.
export function ListaContactos() {
  const [busqueda, setBusqueda] = useState("");
  const texto = normalizar(busqueda.trim());
  const visibles = contactos.filter((c) => normalizar(`${c.nombre} ${c.cargo} ${c.lugar}`).includes(texto));

  return (
    <div>
      <label className="relative block">
        <span className="sr-only">Buscar contacto</span>
        <Icono nombre="buscar" className="absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-azul-900/50" />
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, materia u oficina"
          className="w-full rounded-2xl border border-azul-100 bg-white py-3 pr-4 pl-11 shadow-sm shadow-azul-100/60 outline-none focus:border-azul-400 focus:ring-4 focus:ring-azul-100"
        />
      </label>

      <p className="mt-3 text-xs text-azul-900/60" aria-live="polite">
        {visibles.length === contactos.length ? `${contactos.length} contactos` : `${visibles.length} de ${contactos.length} contactos`}
      </p>

      {visibles.length === 0 ? (
        <p className={`${tarjeta} mt-3 p-6 text-center text-sm text-azul-900/60`}>
          No encontramos a nadie con «{busqueda}». Prueba con otra palabra.
        </p>
      ) : (
        // Lista limpia con líneas divisorias: nombre y cargo a la izquierda, lugar y correo a la derecha.
        <ul className={`${tarjeta} mt-3 divide-y divide-azul-100 px-4`}>
          {visibles.map((c, i) => (
            <li
              key={c.correo}
              className={`flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between ${anim.aparecer}`}
              style={retraso(i * 0.5)}
            >
              <div>
                <h2 className="font-medium text-azul-950">{c.nombre}</h2>
                <p className="text-sm text-azul-900/60">{c.cargo}</p>
              </div>
              <div className="flex flex-col gap-1 text-sm text-azul-900/60 sm:items-end">
                <span className="flex items-center gap-1.5">
                  <Icono nombre="ubicacion" className="size-3.5 shrink-0" />
                  {c.lugar}
                </span>
                <a
                  href={`mailto:${c.correo}`}
                  className="flex items-center gap-1.5 rounded text-azul-900 hover:underline focus-visible:ring-2 focus-visible:ring-azul-500 focus-visible:outline-none"
                >
                  <Icono nombre="correo" className="size-3.5 shrink-0" />
                  <span className="break-all">{c.correo}</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
