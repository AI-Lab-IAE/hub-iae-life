"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import anim from "../animaciones.module.css";
import { horarioSecundaria } from "../datos";
import { Avatar } from "./Avatar";
import { retraso, tarjeta, tocar } from "./estilos";
import { Icono } from "./Icono";
import {
  borrarPerfil,
  coloresAvatar,
  descripcionPerfil,
  esSecundaria,
  grados,
  guardarPerfil,
  roles,
  usePerfil,
  type ColorAvatar,
  type Perfil,
  type Rol,
} from "./perfil";

// Pantalla "Mi perfil": crea, muestra, edita o borra el perfil guardado en este dispositivo.
export function EditorPerfil() {
  const { listo, perfil } = usePerfil();
  const [editando, setEditando] = useState(false);

  if (!listo) return <div className={`${tarjeta} h-72 animate-pulse`} />;

  if (!perfil || editando) {
    return <Formulario inicial={perfil} alTerminar={() => setEditando(false)} />;
  }
  return <TarjetaPerfil perfil={perfil} alEditar={() => setEditando(true)} />;
}

const etiqueta = "mb-2 block text-sm font-semibold";
const opcion = `${tocar} rounded-xl border px-3 py-2.5 text-sm font-medium`;
const opcionActiva = "border-sky-500 bg-sky-500 text-white shadow-sm shadow-sky-500/30";
const opcionNormal =
  "border-sky-100 bg-white text-slate-600 hover:border-sky-300 dark:border-sky-900/60 dark:bg-slate-900 dark:text-slate-300";

function Formulario({ inicial, alTerminar }: { inicial: Perfil | null; alTerminar: () => void }) {
  const [nombre, setNombre] = useState(inicial?.nombre ?? "");
  const [rol, setRol] = useState<Rol>(inicial?.rol ?? "Estudiante");
  const [grado, setGrado] = useState<number | null>(inicial?.grado ?? null);
  const [color, setColor] = useState<ColorAvatar>(inicial?.color ?? "celeste");

  const pideGrado = rol !== "Docente o personal";
  const completo = nombre.trim() !== "" && (!pideGrado || grado != null);
  const vistaPrevia: Perfil = { nombre: nombre || "?", rol, grado: pideGrado ? grado : null, color };

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (!completo) return;
    guardarPerfil({ ...vistaPrevia, nombre: nombre.trim() });
    alTerminar();
  }

  return (
    <form onSubmit={enviar} className={`${tarjeta} ${anim.aparecer} overflow-hidden`}>
      <div className="flex items-center gap-4 bg-linear-to-br from-sky-400 to-sky-600 p-5 text-white">
        <Avatar perfil={vistaPrevia} className="size-16 text-xl ring-4 ring-white/30" />
        <div>
          <h1 className="text-xl font-bold">{inicial ? "Editar mi perfil" : "Crea tu perfil"}</h1>
          <p className="text-sm text-sky-50/90">
            {inicial ? "Cambia lo que necesites y guarda." : "Así la guía te saluda y te muestra lo que te toca."}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 p-5">
        <div>
          <label htmlFor="nombre" className={etiqueta}>
            ¿Cómo te llamamos?
          </label>
          <input
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={30}
            autoComplete="off"
            placeholder="Tu nombre o un apodo"
            className="w-full rounded-xl border border-sky-100 bg-sky-50/50 px-4 py-3 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-sky-900/60 dark:bg-slate-950 dark:focus:ring-sky-950"
          />
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">Puedes usar solo tu primer nombre o un apodo.</p>
        </div>

        <fieldset>
          <legend className={etiqueta}>Soy</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {roles.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={rol === r}
                onClick={() => setRol(r)}
                className={`${opcion} ${rol === r ? opcionActiva : opcionNormal}`}
              >
                {r}
              </button>
            ))}
          </div>
        </fieldset>

        {pideGrado && (
          <fieldset className={anim.aparecer}>
            <legend className={etiqueta}>{rol === "Familia" ? "Grado de tu hijo o hija" : "¿En qué grado estás?"}</legend>
            <div className="grid grid-cols-6 gap-2">
              {grados.map((g) => (
                <button
                  key={g}
                  type="button"
                  aria-pressed={grado === g}
                  aria-label={`${g}.º grado`}
                  onClick={() => setGrado(g)}
                  className={`${opcion} px-0 ${grado === g ? opcionActiva : opcionNormal}`}
                >
                  {g}.º
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Primaria: 1.º a 6.º · Premedia: 7.º a 9.º · Media: 10.º a 12.º
            </p>
          </fieldset>
        )}

        <fieldset>
          <legend className={etiqueta}>Color de tu círculo</legend>
          <div className="flex gap-3">
            {(Object.keys(coloresAvatar) as ColorAvatar[]).map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={color === c}
                aria-label={`Color ${c}`}
                onClick={() => setColor(c)}
                className={`${tocar} size-10 rounded-full bg-linear-to-br ${coloresAvatar[c]} ${
                  color === c ? "ring-4 ring-sky-200 ring-offset-2 dark:ring-sky-800 dark:ring-offset-slate-900" : ""
                }`}
              />
            ))}
          </div>
        </fieldset>

        <AvisoPrivacidad />

        <div className="flex gap-3">
          {inicial && (
            <button type="button" onClick={alTerminar} className={`${tocar} flex-1 rounded-xl border border-sky-100 py-3 font-semibold text-slate-600 dark:border-sky-900/60 dark:text-slate-300`}>
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={!completo}
            className={`${tocar} flex-1 rounded-xl bg-sky-500 py-3 font-semibold text-white shadow-md shadow-sky-500/30 hover:bg-sky-600 disabled:bg-slate-300 disabled:shadow-none dark:disabled:bg-slate-700`}
          >
            Guardar perfil
          </button>
        </div>
      </div>
    </form>
  );
}

function TarjetaPerfil({ perfil, alEditar }: { perfil: Perfil; alEditar: () => void }) {
  function borrar() {
    if (window.confirm("¿Seguro que quieres borrar tu perfil de este dispositivo?")) borrarPerfil();
  }

  const datos = [
    { que: "Soy", valor: perfil.rol },
    ...(perfil.grado != null ? [{ que: "Grado", valor: `${perfil.grado}.º grado` }] : []),
  ];

  return (
    <div className="flex flex-col gap-4">
      <section className={`${tarjeta} ${anim.aparecer} overflow-hidden`}>
        <div className="relative bg-linear-to-br from-sky-400 to-sky-600 px-5 pt-6 pb-14">
          <span className="absolute -top-10 -right-8 size-36 rounded-full bg-white/10" aria-hidden="true" />
        </div>
        <div className="-mt-10 flex flex-col items-center px-5 pb-5 text-center">
          <Avatar perfil={perfil} className="size-20 text-2xl ring-4 ring-white dark:ring-slate-900" />
          <h1 className="mt-3 text-2xl font-bold">{perfil.nombre}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{descripcionPerfil(perfil)}</p>
        </div>
        <dl className="grid grid-cols-2 divide-x divide-sky-50 border-t border-sky-50 dark:divide-sky-900/40 dark:border-sky-900/40">
          {datos.map((d) => (
            <div key={d.que} className="p-3 text-center">
              <dt className="text-xs text-slate-500 dark:text-slate-400">{d.que}</dt>
              <dd className="font-semibold">{d.valor}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={`${tarjeta} ${anim.aparecer} p-4`} style={retraso(1)}>
        <h2 className="flex items-center gap-2 font-semibold">
          <Icono nombre="reloj" className="size-5 text-sky-500" /> Tu horario
        </h2>
        {esSecundaria(perfil) ? (
          <>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Entrada {horarioSecundaria.entrada} · Salida {horarioSecundaria.salida} (viernes {horarioSecundaria.salidaViernes})
            </p>
            <Link href="/camille/informacion" className="mt-3 inline-block text-sm font-medium text-sky-600 dark:text-sky-400">
              Ver horario completo →
            </Link>
          </>
        ) : (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {perfil.grado == null
              ? "El horario de cada docente lo entrega Coordinación."
              : "El horario de primaria estará disponible pronto."}
          </p>
        )}
      </section>

      <div className={anim.aparecer} style={retraso(2)}>
        <AvisoPrivacidad />
      </div>

      <div className={`flex gap-3 ${anim.aparecer}`} style={retraso(3)}>
        <button
          onClick={alEditar}
          className={`${tocar} flex flex-1 items-center justify-center gap-2 rounded-xl bg-sky-500 py-3 font-semibold text-white shadow-md shadow-sky-500/30 hover:bg-sky-600`}
        >
          <Icono nombre="editar" className="size-5" /> Editar
        </button>
        <button
          onClick={borrar}
          className={`${tocar} flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-200 py-3 font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950`}
        >
          <Icono nombre="basura" className="size-5" /> Borrar
        </button>
      </div>
    </div>
  );
}

function AvisoPrivacidad() {
  return (
    <p className="flex gap-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
      <Icono nombre="escudo" className="size-5 shrink-0" />
      <span>
        Tu perfil se guarda <strong>solo en este dispositivo</strong>. No se envía a internet y nadie más lo puede ver.
      </span>
    </p>
  );
}
