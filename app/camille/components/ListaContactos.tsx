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
        <Icono nombre="buscar" className="absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, materia u oficina"
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-4 pl-11 shadow-sm shadow-slate-200/60 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none dark:focus:ring-indigo-950"
        />
      </label>

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400" aria-live="polite">
        {visibles.length === contactos.length ? `${contactos.length} contactos` : `${visibles.length} de ${contactos.length} contactos`}
      </p>

      {visibles.length === 0 ? (
        <p className={`${tarjeta} mt-3 p-6 text-center text-sm text-slate-500 dark:text-slate-400`}>
          No encontramos a nadie con «{busqueda}». Prueba con otra palabra.
        </p>
      ) : (
        // Lista limpia con líneas divisorias: nombre y cargo a la izquierda, lugar y correo a la derecha.
        <ul className={`${tarjeta} mt-3 divide-y divide-slate-200 px-4 dark:divide-slate-800`}>
          {visibles.map((c, i) => (
            <li
              key={c.correo}
              className={`flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between ${anim.aparecer}`}
              style={retraso(i * 0.5)}
            >
              <div>
                <h2 className="font-medium text-slate-900 dark:text-slate-100">{c.nombre}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{c.cargo}</p>
              </div>
              <div className="flex flex-col gap-1 text-sm text-slate-500 sm:items-end dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Icono nombre="ubicacion" className="size-3.5 shrink-0" />
                  {c.lugar}
                </span>
                <a
                  href={`mailto:${c.correo}`}
                  className="flex items-center gap-1.5 rounded text-indigo-700 hover:underline focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none dark:text-indigo-300"
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
