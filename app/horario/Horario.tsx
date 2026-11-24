"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { CalendarDays, Check, Clock, Coffee, Pencil, RotateCcw } from "lucide-react";
import { estiloDe } from "../_life/colores";
import { useCuenta } from "../_life/cuenta";
import {
  BLOQUES,
  DIAS,
  DIAS_CORTOS,
  MATERIAS,
  NOTA_DIA,
  PAUSAS,
  aMinutos,
  esEjemplo,
  guardarHorario,
  hayBloque,
  horarioGuardado,
  materia,
  momentoEnPanama,
  useHorario,
  type Horario as TipoHorario,
} from "../_life/horario";

// Minuto actual, que se actualiza solo. null en el servidor.
function suscribirReloj(aviso: () => void) {
  const id = setInterval(aviso, 30_000);
  return () => clearInterval(id);
}
function minutoActual() {
  return Math.floor(Date.now() / 60_000);
}
function useMinuto() {
  return useSyncExternalStore(suscribirReloj, minutoActual, () => null);
}

function momento(minuto: number | null) {
  if (minuto == null) return { dia: null as number | null, ahora: null as number | null };
  return momentoEnPanama(new Date(minuto * 60_000));
}

function esAhora(bloque: number, dia: number, hoy: number | null, ahora: number | null) {
  if (hoy !== dia || ahora == null) return false;
  const b = BLOQUES[bloque];
  return ahora >= aMinutos(b.desde) && ahora < aMinutos(b.hasta);
}

// La clase de ahora y la que sigue hoy (solo materias, sin huecos).
function resumenDelDia(horario: TipoHorario, dia: number, ahora: number) {
  let actual: number | null = null;
  let siguiente: number | null = null;
  BLOQUES.forEach((b, i) => {
    if (!hayBloque(i, dia) || !horario[i][dia]) return;
    if (ahora >= aMinutos(b.desde) && ahora < aMinutos(b.hasta)) actual = i;
    else if (aMinutos(b.desde) > ahora && siguiente === null) siguiente = i;
  });
  return { actual, siguiente };
}

export default function Horario() {
  const cuenta = useCuenta();
  const correo = cuenta?.rol === "estudiante" ? cuenta.correo : null;
  const horario = useHorario(correo);
  const minuto = useMinuto();
  const { dia: hoy, ahora } = momento(minuto);
  const [elegido, setElegido] = useState<number | null>(null);
  const [editando, setEditando] = useState(false);
  const [aviso, setAviso] = useState("");

  if (!horario || cuenta === undefined) {
    return <main className="flex-1 bg-azul-50/60" aria-busy />;
  }

  if (cuenta?.rol === "profesor") {
    return (
      <main className="flex flex-1 items-center justify-center bg-azul-50/60 px-4 py-16">
        <div className="max-w-sm rounded-3xl border border-azul-100 bg-white p-8 text-center">
          <CalendarDays className="mx-auto size-10 text-azul-300" aria-hidden />
          <h1 className="mt-4 text-xl font-bold text-azul-950">Horario de profesores</h1>
          <p className="mt-2 text-sm text-azul-900/60">
            Por ahora el horario es para estudiantes. El de profesores viene después.
          </p>
        </div>
      </main>
    );
  }

  const dia = elegido ?? hoy ?? 0;
  const resumen = hoy !== null && ahora !== null ? resumenDelDia(horario, hoy, ahora) : null;
  const conEdicion = editando && correo !== null;

  const NO_GUARDA = "Este navegador no deja guardar: los cambios se pierden al cerrar.";

  const cambiar = (bloque: number, d: number, valor: string) => {
    if (!correo) return;
    const nuevo: TipoHorario = horarioGuardado(correo).map((fila) => [...fila]);
    nuevo[bloque][d] = valor || null;
    setAviso(guardarHorario(correo, nuevo) ? "" : NO_GUARDA);
  };

  const restaurar = () => {
    if (!correo) return;
    setAviso(guardarHorario(correo, null) ? "" : NO_GUARDA);
  };

  return (
    <main className="flex-1 bg-azul-50/60">
      <section className="bg-gradient-to-br from-azul-800 via-azul-900 to-azul-950 text-white">
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-8 md:pb-10 md:pt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-azul-200">
                <CalendarDays className="size-4" aria-hidden /> Mi horario
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
                {cuenta ? `Hola, ${cuenta.nombre.split(" ")[0]}` : "Horario de ejemplo"}
              </h1>
              <p className="mt-2 max-w-xl text-sm text-azul-100/80">
                {NOTA_DIA} Los profesores y correos son inventados.
                {!cuenta && (
                  <>
                    {" "}
                    <Link href="/entrar" className="font-semibold text-white underline underline-offset-2">
                      Entra
                    </Link>{" "}
                    para ver el tuyo.
                  </>
                )}
              </p>
            </div>
            {correo && (
              <div className="flex flex-wrap gap-2">
                {!esEjemplo(horario) && (
                  <button
                    type="button"
                    onClick={restaurar}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/25 hover:bg-white/20"
                  >
                    <RotateCcw className="size-4" aria-hidden /> Volver al original
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setEditando((e) => !e)}
                  aria-pressed={conEdicion}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-azul-900 hover:bg-azul-50"
                >
                  {conEdicion ? <Check className="size-4" aria-hidden /> : <Pencil className="size-4" aria-hidden />}
                  {conEdicion ? "Listo" : "Ajustar"}
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Resumen
              titulo="Ahora"
              bloque={resumen?.actual ?? null}
              dia={hoy}
              horario={horario}
              vacio={hoy === null ? "Cargando…" : "No tienes clase en este momento"}
            />
            <Resumen
              titulo="Después"
              bloque={resumen?.siguiente ?? null}
              dia={hoy}
              horario={horario}
              vacio="No te quedan clases hoy"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {aviso && (
          <p role="status" className="mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {aviso}
          </p>
        )}

        {/* Celular: un día a la vez */}
        <div className="md:hidden">
          <div
            role="group"
            aria-label="Día"
            className="grid grid-cols-5 gap-1 rounded-full bg-white p-1 ring-1 ring-azul-100"
          >
            {DIAS_CORTOS.map((d, i) => (
              <button
                key={d}
                type="button"
                aria-pressed={dia === i}
                onClick={() => setElegido(i)}
                className={`rounded-full py-2 text-sm font-semibold transition-colors ${
                  dia === i ? "bg-azul-800 text-white" : "text-azul-900/60"
                }`}
              >
                {d}
                {hoy === i && <span className="sr-only"> (hoy)</span>}
              </button>
            ))}
          </div>

          <ol className="mt-4 grid gap-2">
            {BLOQUES.map((b, i) =>
              hayBloque(i, dia) ? (
                <li key={b.desde}>
                  <Clase
                    bloque={i}
                    dia={dia}
                    horario={horario}
                    ahora={horario[i][dia] !== null && esAhora(i, dia, hoy, ahora)}
                    editando={conEdicion}
                    onCambiar={cambiar}
                  />
                  {PAUSAS[i] && hayBloque(i + 1, dia) && <Pausa texto={PAUSAS[i]} />}
                </li>
              ) : null,
            )}
          </ol>
        </div>

        {/* Computadora: la semana completa */}
        <div className="hidden overflow-hidden rounded-3xl border border-azul-100 bg-white shadow-xl shadow-azul-900/5 md:block">
          <table className="w-full table-fixed text-sm">
            <caption className="sr-only">Horario semanal</caption>
            <thead>
              <tr className="bg-azul-50 text-left text-azul-800">
                <th scope="col" className="w-28 px-4 py-3 font-semibold">
                  Hora
                </th>
                {DIAS.map((d, i) => (
                  <th key={d} scope="col" className="px-2 py-3 font-semibold">
                    {d}
                    {hoy === i && (
                      <span className="ml-2 rounded-full bg-azul-800 px-2 py-0.5 text-[10px] uppercase text-white">
                        Hoy
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BLOQUES.map((b, i) => (
                <FilaSemana
                  key={b.desde}
                  bloque={i}
                  horario={horario}
                  hoy={hoy}
                  ahora={ahora}
                  editando={conEdicion}
                  onCambiar={cambiar}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

type PropsCelda = {
  bloque: number;
  dia: number;
  horario: TipoHorario;
  editando: boolean;
  onCambiar: (bloque: number, dia: number, valor: string) => void;
};

function Selector({ bloque, dia, horario, onCambiar }: Omit<PropsCelda, "editando">) {
  return (
    <select
      value={horario[bloque][dia] ?? ""}
      onChange={(e) => onCambiar(bloque, dia, e.target.value)}
      aria-label={`${DIAS[dia]} ${BLOQUES[bloque].desde}`}
      className="w-full rounded-lg border border-azul-200 bg-white px-2 py-1.5 text-base text-azul-950 md:text-sm"
    >
      <option value="">Sin clase</option>
      {MATERIAS.map((m) => (
        <option key={m.nombre} value={m.nombre}>
          {m.nombre}
        </option>
      ))}
    </select>
  );
}

function Resumen({
  titulo,
  bloque,
  dia,
  horario,
  vacio,
}: {
  titulo: string;
  bloque: number | null;
  dia: number | null;
  horario: TipoHorario;
  vacio: string;
}) {
  const m = bloque !== null && dia !== null ? materia(horario[bloque][dia]) : null;
  const e = m ? estiloDe(m.nombre) : null;
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
      <span
        className={`grid size-12 shrink-0 place-items-center rounded-xl ${e ? e.chip : "bg-white/10 text-azul-100"}`}
      >
        {e ? <e.Icono className="size-6" aria-hidden /> : <Clock className="size-6" aria-hidden />}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-azul-200">{titulo}</p>
        {m && bloque !== null ? (
          <>
            <p className="truncate text-lg font-bold">{m.nombre}</p>
            <p className="truncate text-sm text-azul-100/80">
              {BLOQUES[bloque].desde}–{BLOQUES[bloque].hasta} · {m.profesor}
            </p>
          </>
        ) : (
          <p className="text-sm text-azul-100/80">{vacio}</p>
        )}
      </div>
    </div>
  );
}

function Clase({ bloque, dia, horario, ahora, editando, onCambiar }: PropsCelda & { ahora: boolean }) {
  const b = BLOQUES[bloque];
  const m = materia(horario[bloque][dia]);
  const e = m ? estiloDe(m.nombre) : null;
  return (
    <div
      aria-current={ahora ? "time" : undefined}
      className={`relative flex items-center gap-3 overflow-hidden rounded-2xl border p-3 pl-4 ${
        ahora ? "border-azul-800 bg-azul-800 text-white shadow-lg shadow-azul-900/20" : "border-azul-100 bg-white"
      }`}
    >
      {e && !ahora && <span className={`absolute inset-y-0 left-0 w-1.5 ${e.barra}`} aria-hidden />}
      <span className={`w-12 shrink-0 text-xs tabular-nums ${ahora ? "text-azul-100" : "text-azul-900/50"}`}>
        {b.desde}
        <br />
        {b.hasta}
      </span>
      {e && !editando && (
        <span
          className={`grid size-10 shrink-0 place-items-center rounded-xl ${ahora ? "bg-white/15 text-white" : e.chip}`}
        >
          <e.Icono className="size-5" aria-hidden />
        </span>
      )}
      <div className="min-w-0 flex-1">
        {editando ? (
          <Selector bloque={bloque} dia={dia} horario={horario} onCambiar={onCambiar} />
        ) : m ? (
          <>
            <p className="font-semibold">{m.nombre}</p>
            <p className={`text-xs ${ahora ? "text-azul-100" : "text-azul-900/55"}`}>{m.profesor}</p>
            <p className={`break-all text-xs ${ahora ? "text-azul-100" : "text-azul-900/55"}`}>{m.correo}</p>
          </>
        ) : (
          <p className={ahora ? "text-azul-100" : "text-azul-900/40"}>Sin clase</p>
        )}
      </div>
      {ahora && !editando && (
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase">Ahora</span>
      )}
    </div>
  );
}

function Pausa({ texto }: { texto: string }) {
  return (
    <p className="mt-2 flex items-center gap-2 px-3 text-xs font-medium text-azul-900/50">
      <Coffee className="size-3.5" aria-hidden /> {texto}
    </p>
  );
}

function FilaSemana({
  bloque,
  horario,
  hoy,
  ahora,
  editando,
  onCambiar,
}: Omit<PropsCelda, "dia"> & { hoy: number | null; ahora: number | null }) {
  const b = BLOQUES[bloque];
  return (
    <>
      <tr className="border-t border-azul-100">
        <th scope="row" className="px-4 py-2 text-left text-xs font-medium tabular-nums text-azul-900/60">
          {b.desde}–{b.hasta}
        </th>
        {DIAS.map((d, dia) => {
          if (!hayBloque(bloque, dia)) return <td key={d} className="bg-azul-50/50" />;
          const m = materia(horario[bloque][dia]);
          const activo = m !== null && esAhora(bloque, dia, hoy, ahora);
          const e = m ? estiloDe(m.nombre) : null;
          return (
            <td key={d} className="p-1.5">
              {editando ? (
                <Selector bloque={bloque} dia={dia} horario={horario} onCambiar={onCambiar} />
              ) : (
                <div
                  aria-current={activo ? "time" : undefined}
                  title={m ? `${m.profesor} · ${m.correo}` : undefined}
                  className={`rounded-xl px-2.5 py-2 ${
                    activo
                      ? "bg-azul-800 text-white shadow-md shadow-azul-900/20"
                      : e
                        ? `${e.suave} text-azul-950`
                        : "text-azul-900/35"
                  }`}
                >
                  <p className="flex items-center gap-1.5 truncate font-semibold">
                    {e && <e.Icono className={`size-3.5 shrink-0 ${activo ? "" : "opacity-70"}`} aria-hidden />}
                    {m?.nombre ?? "Sin clase"}
                  </p>
                  {m && (
                    <p className={`truncate text-xs ${activo ? "text-azul-100" : "text-azul-900/50"}`}>{m.profesor}</p>
                  )}
                  {m && (
                    <p className={`break-all text-[11px] ${activo ? "text-azul-100" : "text-azul-900/40"}`}>
                      {m.correo}
                    </p>
                  )}
                </div>
              )}
            </td>
          );
        })}
      </tr>
      {PAUSAS[bloque] && (
        <tr className="border-t border-azul-100 bg-azul-50/40">
          <td colSpan={DIAS.length + 1} className="px-4 py-1.5 text-xs font-medium text-azul-900/50">
            <Coffee className="mr-1.5 inline size-3.5 align-[-2px]" aria-hidden />
            {PAUSAS[bloque]}
          </td>
        </tr>
      )}
    </>
  );
}
