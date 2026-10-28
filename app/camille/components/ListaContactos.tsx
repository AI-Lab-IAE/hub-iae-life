"use client";

import { useState } from "react";
import anim from "../animaciones.module.css";
import { contactos } from "../datos";
import { elevar, retraso, tarjeta, tocar } from "./estilos";
import { Icono } from "./Icono";

// Quita acentos y mayúsculas para que "matematicas" encuentre "Matemáticas".
function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Iniciales para el círculo: "Profesor Prueba 1" → "P1".
function inicialesContacto(nombre: string) {
  const partes = nombre.split(" ");
  return (partes[0][0] + (partes.at(-1)?.[0] ?? "")).toUpperCase();
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
          className="w-full rounded-2xl border border-sky-100 bg-white py-3 pr-4 pl-11 shadow-sm shadow-sky-100/60 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-sky-900/60 dark:bg-slate-900 dark:shadow-none dark:focus:ring-sky-950"
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
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {visibles.map((c, i) => (
            <li key={c.correo} className={`${tarjeta} ${elevar} flex flex-col p-4 transition ${anim.aparecer}`} style={retraso(i * 0.5)}>
              <div className="flex items-center gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-sky-300 to-sky-500 font-bold text-white">
                  {inicialesContacto(c.nombre)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{c.nombre}</span>
                  <span className="block text-sm text-sky-700 dark:text-sky-300">{c.cargo}</span>
                </span>
              </div>
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Icono nombre="ubicacion" className="size-4 shrink-0" /> {c.lugar}
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm break-all text-slate-500 dark:text-slate-400">
                <Icono nombre="correo" className="size-4 shrink-0" /> {c.correo}
              </p>
              <a
                href={`mailto:${c.correo}`}
                className={`${tocar} mt-4 flex items-center justify-center gap-2 rounded-xl bg-sky-50 py-2.5 text-sm font-semibold text-sky-700 hover:bg-sky-500 hover:text-white dark:bg-sky-950 dark:text-sky-300`}
              >
                <Icono nombre="correo" className="size-4" /> Escribir correo
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
