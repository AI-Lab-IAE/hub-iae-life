"use client";

import { useState, type FormEvent } from "react";
import anim from "../animaciones.module.css";
import { retraso, tarjeta, tocar } from "./estilos";
import { Filtros } from "./Filtros";
import { Icono } from "./Icono";
import { BotonHecho, EtiquetaEntrega } from "./PartesPendiente";
import {
  agregarPendiente,
  borrarPendiente,
  editarPendiente,
  tiposPendiente,
  usePendientes,
  type Pendiente,
  type TipoPendiente,
} from "./pendientes";

type Vista = "porHacer" | "hechos";

// Checklist personal: agregar, marcar, editar y borrar pendientes.
export function ListaPendientes() {
  const { listo, pendientes } = usePendientes();
  const [vista, setVista] = useState<Vista>("porHacer");
  const [creando, setCreando] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);

  if (!listo) return <div className={`${tarjeta} h-60 animate-pulse`} />;

  const porHacer = pendientes.filter((p) => !p.hecho);
  const hechos = pendientes.filter((p) => p.hecho);
  const visibles = vista === "porHacer" ? porHacer : hechos;
  const avance = pendientes.length ? (hechos.length / pendientes.length) * 100 : 0;

  return (
    <div className="flex flex-col gap-4">
      {pendientes.length > 0 && (
        <section className={`${tarjeta} p-4 ${anim.aparecer}`}>
          <p className="flex items-baseline justify-between text-sm">
            <strong className="font-semibold">Mi avance</strong>
            <span className="text-slate-500 tabular-nums dark:text-slate-400">
              {hechos.length} de {pendientes.length} hechos
            </span>
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-indigo-100 dark:bg-slate-800" aria-hidden="true">
            <div className="h-full rounded-full bg-indigo-600 transition-[width] duration-500" style={{ width: `${avance}%` }} />
          </div>
        </section>
      )}

      {creando ? (
        <Formulario alTerminar={() => setCreando(false)} />
      ) : (
        <button
          onClick={() => setCreando(true)}
          className={`${tocar} flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-700`}
        >
          <Icono nombre="mas" className="size-5" /> Agregar pendiente
        </button>
      )}

      <Filtros
        opciones={[
          { valor: "porHacer", nombre: "Por hacer", cantidad: porHacer.length },
          { valor: "hechos", nombre: "Hechos", cantidad: hechos.length },
        ]}
        elegido={vista}
        alElegir={setVista}
      />

      {visibles.length === 0 ? (
        <p className={`${tarjeta} p-6 text-center text-sm text-slate-500 dark:text-slate-400`}>
          {vista === "hechos"
            ? "Todavía no has terminado ningún pendiente."
            : pendientes.length > 0
              ? "¡Terminaste todo! Buen trabajo."
              : "Aquí aparecerán tus tareas, exámenes y proyectos. Agrega el primero."}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {visibles.map((p, i) =>
            editando === p.id ? (
              <li key={p.id}>
                <Formulario inicial={p} alTerminar={() => setEditando(null)} />
              </li>
            ) : (
              <li key={p.id} className={`${tarjeta} flex gap-3 p-4 ${anim.aparecer}`} style={retraso(i * 0.5)}>
                <BotonHecho pendiente={p} />
                <div className="min-w-0 flex-1">
                  <p className={`font-semibold wrap-break-word ${p.hecho ? "text-slate-400 line-through" : ""}`}>{p.titulo}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{p.tipo}</span>
                    {p.materia && <span>{p.materia}</span>}
                    <EtiquetaEntrega pendiente={p} />
                  </p>
                  {p.notas && (
                    <p className="mt-2 rounded-lg bg-indigo-50/60 p-2.5 text-sm wrap-break-word whitespace-pre-wrap text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                      {p.notas}
                    </p>
                  )}
                </div>
                <div className="-mt-1 -mr-1 flex shrink-0 flex-col">
                  <button
                    aria-label={`Editar: ${p.titulo}`}
                    onClick={() => setEditando(p.id)}
                    className={`${tocar} flex size-9 items-center justify-center rounded-full text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800`}
                  >
                    <Icono nombre="editar" className="size-4" />
                  </button>
                  <button
                    aria-label={`Borrar: ${p.titulo}`}
                    onClick={() => {
                      if (window.confirm(`¿Seguro que quieres borrar «${p.titulo}»?`)) borrarPendiente(p.id);
                    }}
                    className={`${tocar} flex size-9 items-center justify-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-800`}
                  >
                    <Icono nombre="basura" className="size-4" />
                  </button>
                </div>
              </li>
            ),
          )}
        </ul>
      )}

      <p className="flex gap-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
        <Icono nombre="escudo" className="size-5 shrink-0" />
        <span>
          Tus pendientes se guardan <strong>solo en este dispositivo</strong>. No se envían a internet y nadie más los puede ver. Si borras los datos del navegador, se borran también.
        </span>
      </p>
    </div>
  );
}

const etiqueta = "mb-1.5 block text-sm font-semibold";
const campo =
  "w-full rounded-xl border border-slate-200 bg-indigo-50/50 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-indigo-950";

function Formulario({ inicial, alTerminar }: { inicial?: Pendiente; alTerminar: () => void }) {
  const [titulo, setTitulo] = useState(inicial?.titulo ?? "");
  const [materia, setMateria] = useState(inicial?.materia ?? "");
  const [tipo, setTipo] = useState<TipoPendiente>(inicial?.tipo ?? "Tarea");
  const [fecha, setFecha] = useState(inicial?.fecha ?? "");
  const [notas, setNotas] = useState(inicial?.notas ?? "");
  const [error, setError] = useState(false);

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (titulo.trim() === "") return;
    const datos = { titulo: titulo.trim(), materia: materia.trim(), tipo, fecha, notas: notas.trim() };
    const guardado = inicial ? editarPendiente(inicial.id, datos) : agregarPendiente(datos);
    if (guardado) alTerminar();
    else setError(true);
  }

  return (
    <form onSubmit={enviar} className={`${tarjeta} ${anim.aparecer} flex flex-col gap-4 p-4`}>
      <div>
        <label htmlFor="titulo" className={etiqueta}>
          ¿Qué tienes que hacer?
        </label>
        <input
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          maxLength={80}
          autoComplete="off"
          placeholder="Por ejemplo: Resumen del capítulo 3"
          className={campo}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="materia" className={etiqueta}>
            Materia
          </label>
          <input
            id="materia"
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
            maxLength={40}
            autoComplete="off"
            placeholder="Por ejemplo: Ciencias"
            className={campo}
          />
        </div>
        <div>
          <label htmlFor="fecha" className={etiqueta}>
            ¿Para cuándo?
          </label>
          <input id="fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={campo} />
        </div>
      </div>

      <fieldset>
        <legend className={etiqueta}>Tipo</legend>
        <div className="grid grid-cols-4 gap-2">
          {tiposPendiente.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tipo === t}
              onClick={() => setTipo(t)}
              className={`${tocar} rounded-xl border py-2.5 text-sm font-semibold ${
                tipo === t
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="notas" className={etiqueta}>
          Apuntes
        </label>
        <textarea
          id="notas"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Dónde está la información, qué llevar, con quién lo haces…"
          className={campo}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-rose-600 dark:text-rose-400">
          Tu navegador no dejó guardar. Revisa que no estés en modo privado.
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={alTerminar}
          className={`${tocar} flex-1 rounded-xl border border-slate-200 py-3 font-semibold text-slate-600 dark:border-slate-800 dark:text-slate-300`}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={titulo.trim() === ""}
          className={`${tocar} flex-1 rounded-xl bg-indigo-600 py-3 font-semibold text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-700 disabled:bg-slate-300 disabled:shadow-none dark:disabled:bg-slate-700`}
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
