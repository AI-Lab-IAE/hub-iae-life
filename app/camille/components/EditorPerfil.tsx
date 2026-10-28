"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import anim from "../animaciones.module.css";
import { eventos, horarioSecundaria } from "../datos";
import { diaYMes } from "../formato";
import { Avatar } from "./Avatar";
import { retraso, tarjeta, tocar } from "./estilos";
import { diasHasta, salidaDeHoy, textoFaltan, useHoy } from "./hoy";
import { Icono, type NombreIcono } from "./Icono";
import {
  borrarPerfil,
  coloresAvatar,
  descripcionPerfil,
  esSecundaria,
  guardarPerfil,
  nivelDe,
  niveles,
  usePerfil,
  type ColorAvatar,
  type Perfil,
} from "./perfil";

// Pantalla "Mi perfil" del estudiante: lo crea, lo muestra, lo edita o lo borra.
export function EditorPerfil() {
  const { listo, perfil } = usePerfil();
  const [editando, setEditando] = useState(false);

  if (!listo) return <div className={`${tarjeta} h-80 animate-pulse`} />;

  if (!perfil || editando) {
    return <Formulario inicial={perfil} alTerminar={() => setEditando(false)} />;
  }
  return <TarjetaPerfil perfil={perfil} alEditar={() => setEditando(true)} />;
}

const etiqueta = "mb-2 block text-sm font-semibold";
const opcion = `${tocar} rounded-xl border py-2.5 text-sm font-semibold`;
const opcionActiva = "border-sky-500 bg-sky-500 text-white shadow-sm shadow-sky-500/30";
const opcionNormal =
  "border-sky-100 bg-white text-slate-600 hover:border-sky-300 dark:border-sky-900/60 dark:bg-slate-900 dark:text-slate-300";

function Formulario({ inicial, alTerminar }: { inicial: Perfil | null; alTerminar: () => void }) {
  const [nombre, setNombre] = useState(inicial?.nombre ?? "");
  const [grado, setGrado] = useState<number | null>(inicial?.grado ?? null);
  const [color, setColor] = useState<ColorAvatar>(inicial?.color ?? "celeste");

  const completo = nombre.trim() !== "" && grado != null;

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (!completo) return;
    guardarPerfil({ nombre: nombre.trim(), grado, color });
    alTerminar();
  }

  return (
    <form onSubmit={enviar} className={`${tarjeta} ${anim.aparecer} overflow-hidden`}>
      <div className="flex items-center gap-4 bg-linear-to-br from-sky-400 to-sky-600 p-5 text-white">
        <Avatar perfil={{ nombre: nombre || "?", grado: grado ?? 1, color }} className="size-16 text-xl ring-4 ring-white/30" />
        <div>
          <p className="text-xs font-medium tracking-wider text-sky-100 uppercase">Perfil de estudiante</p>
          <h1 className="text-xl font-bold">{inicial ? "Editar mi perfil" : "Crea tu perfil"}</h1>
          <p className="text-sm text-sky-50/90">
            {inicial ? "Cambia lo que necesites y guarda." : "La guía te mostrará la información de tu grado."}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 p-5">
        <div>
          <label htmlFor="nombre" className={etiqueta}>
            Nombre o apodo
          </label>
          <input
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={30}
            autoComplete="off"
            placeholder="Por ejemplo: Ana"
            className="w-full rounded-xl border border-sky-100 bg-sky-50/50 px-4 py-3 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-sky-900/60 dark:bg-slate-950 dark:focus:ring-sky-950"
          />
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">Basta con tu primer nombre o un apodo.</p>
        </div>

        <fieldset>
          <legend className={etiqueta}>Grado</legend>
          <div className="flex flex-col gap-3">
            {niveles.map((n) => (
              <div key={n.nombre}>
                <p className="mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">{n.nombre}</p>
                <div className="grid grid-cols-6 gap-2">
                  {n.grados.map((g) => (
                    <button
                      key={g}
                      type="button"
                      aria-pressed={grado === g}
                      aria-label={`${g}.º grado`}
                      onClick={() => setGrado(g)}
                      className={`${opcion} ${grado === g ? opcionActiva : opcionNormal}`}
                    >
                      {g}.º
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={etiqueta}>Color del perfil</legend>
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
            <button
              type="button"
              onClick={alTerminar}
              className={`${tocar} flex-1 rounded-xl border border-sky-100 py-3 font-semibold text-slate-600 dark:border-sky-900/60 dark:text-slate-300`}
            >
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
  const hoy = useHoy();
  const secundaria = esSecundaria(perfil);

  // Las próximas tres fechas del calendario, desde hoy.
  const proximas = hoy
    ? [...eventos]
        .sort((a, b) => a.fecha.localeCompare(b.fecha))
        .filter((e) => diasHasta(hoy, e.fecha) >= 0)
        .slice(0, 3)
    : [];

  const salidaHoy = hoy && secundaria ? (salidaDeHoy(hoy) ?? "Sin clases") : "—";
  const datos = [
    { que: "Grado", valor: `${perfil.grado}.º` },
    { que: "Nivel", valor: nivelDe(perfil.grado) },
    { que: "Salida hoy", valor: salidaHoy },
  ];

  function borrar() {
    if (window.confirm("¿Seguro que quieres borrar tu perfil de este dispositivo?")) borrarPerfil();
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Encabezado del perfil */}
      <section className={`${tarjeta} ${anim.aparecer} overflow-hidden`}>
        <div className="relative h-24 bg-linear-to-br from-sky-400 via-sky-500 to-sky-600">
          <span className="absolute -top-10 -right-8 size-36 rounded-full bg-white/10" aria-hidden="true" />
          <span className="absolute -bottom-12 left-6 size-24 rounded-full bg-white/10" aria-hidden="true" />
        </div>
        <div className="relative -mt-10 flex flex-col items-center px-5 pb-5 text-center">
          <Avatar perfil={perfil} className="size-20 text-2xl ring-4 ring-white dark:ring-slate-900" />
          <h1 className="mt-3 text-2xl font-bold">{perfil.nombre}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{descripcionPerfil(perfil)}</p>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            <Icono nombre="perfil" className="size-3.5" /> Perfil de estudiante
          </span>
        </div>
        <dl className="grid grid-cols-3 divide-x divide-sky-50 border-t border-sky-50 dark:divide-sky-900/40 dark:border-sky-900/40">
          {datos.map((d) => (
            <div key={d.que} className="px-2 py-3 text-center">
              <dd className="text-sm font-bold tabular-nums">{d.valor}</dd>
              <dt className="text-xs text-slate-500 dark:text-slate-400">{d.que}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Horario */}
      <Bloque titulo="Mi horario" posicion={1}>
        {secundaria ? (
          <>
            <dl className="divide-y divide-sky-50 dark:divide-sky-900/40">
              {[
                { que: "Entrada", cuando: horarioSecundaria.entrada },
                { que: "Salida de lunes a jueves", cuando: horarioSecundaria.salida },
                { que: "Salida los viernes", cuando: horarioSecundaria.salidaViernes },
              ].map((h) => (
                <div key={h.que} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <dt className="text-slate-500 dark:text-slate-400">{h.que}</dt>
                  <dd className="font-semibold tabular-nums">{h.cuando}</dd>
                </div>
              ))}
            </dl>
            <Fila href="/camille/informacion" icono="reloj" texto="Ver horario completo por día" />
          </>
        ) : (
          <p className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">El horario de primaria estará disponible pronto.</p>
        )}
      </Bloque>

      {/* Próximas fechas */}
      {proximas.length > 0 && (
        <Bloque titulo="Próximas fechas" posicion={2}>
          <ul className="divide-y divide-sky-50 dark:divide-sky-900/40">
            {proximas.map((e) => {
              const { dia, mes } = diaYMes(e.fecha);
              return (
                <li key={e.titulo} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="flex size-10 shrink-0 flex-col items-center justify-center rounded-lg bg-sky-50 leading-none text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                    <span className="font-bold">{dia}</span>
                    <span className="text-[9px] uppercase">{mes}</span>
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{e.titulo}</span>
                  <span className="shrink-0 text-xs font-medium text-sky-600 dark:text-sky-400">{textoFaltan(diasHasta(hoy!, e.fecha))}</span>
                </li>
              );
            })}
          </ul>
          <Fila href="/camille/calendario" icono="calendario" texto="Ver calendario completo" />
        </Bloque>
      )}

      {/* Ajustes */}
      <Bloque titulo="Ajustes" posicion={3}>
        <button onClick={alEditar} className={`${filaEstilo} w-full`}>
          <Icono nombre="editar" className="size-5 text-sky-500" />
          <span className="flex-1 text-left">Editar perfil</span>
          <Icono nombre="adelante" className="size-4 text-slate-400" />
        </button>
        <button onClick={borrar} className={`${filaEstilo} w-full text-rose-600 dark:text-rose-400`}>
          <Icono nombre="basura" className="size-5" />
          <span className="flex-1 text-left">Borrar perfil de este dispositivo</span>
        </button>
      </Bloque>

      <div className={anim.aparecer} style={retraso(4)}>
        <AvisoPrivacidad />
      </div>
    </div>
  );
}

const filaEstilo =
  "flex items-center gap-3 border-t border-sky-50 px-4 py-3 text-sm font-medium transition hover:bg-sky-50/60 active:bg-sky-50 dark:border-sky-900/40 dark:hover:bg-sky-950/40";

function Bloque({ titulo, posicion, children }: { titulo: string; posicion: number; children: ReactNode }) {
  return (
    <section className={anim.aparecer} style={retraso(posicion)}>
      <h2 className="mb-2 px-1 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">{titulo}</h2>
      <div className={`${tarjeta} overflow-hidden [&>:first-child]:border-t-0`}>{children}</div>
    </section>
  );
}

function Fila({ href, icono, texto }: { href: string; icono: NombreIcono; texto: string }) {
  return (
    <Link href={href} className={`${filaEstilo} text-sky-700 dark:text-sky-300`}>
      <Icono nombre={icono} className="size-5" />
      <span className="flex-1">{texto}</span>
      <Icono nombre="adelante" className="size-4 text-slate-400" />
    </Link>
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
