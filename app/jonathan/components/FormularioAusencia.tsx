"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarDays, Check, Ellipsis, Plane, Sparkles, Stethoscope, Thermometer, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCuenta } from "../../_life/cuenta";
import { useHorario } from "../../_life/horario";
import { clasesDeIAELife } from "../lib/horario";
import { diaDeFecha, NOMBRES_DIAS } from "../lib/fechas";
import { MOTIVOS } from "../lib/correos";
import type { Ausencia, MotivoId } from "../lib/tipos";

const ICONOS: Record<MotivoId, LucideIcon> = {
  enfermedad: Thermometer,
  cita: Stethoscope,
  competencia: Trophy,
  viaje: Plane,
  otro: Ellipsis,
};

// "AAAA-MM-DD" de hoy (+ días), en la hora de este dispositivo.
function isoDentroDe(dias: number) {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function Paso({ n, titulo, children }: { n: number; titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-azul-900/5">
      <h2 className="flex items-center gap-3 font-bold text-azul-950">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-azul-800 text-sm text-white">{n}</span>
        {titulo}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

type Props = { inicial: Ausencia | null; onEnviar: (a: Ausencia) => void };

export default function FormularioAusencia({ inicial, onEnviar }: Props) {
  // Con cuenta de IAE LIFE el nombre ya se sabe y el horario es el tuyo de Horario.
  const cuenta = useCuenta();
  const correo = cuenta?.rol === "estudiante" ? cuenta.correo : null;
  const horarioLife = useHorario(correo);

  const [nombreEscrito, setNombre] = useState(inicial?.nombre ?? "");
  const nombre = cuenta?.nombre ?? nombreEscrito;
  const [fecha, setFecha] = useState(inicial?.fecha ?? "");
  // Guarda la hora de inicio de cada clase marcada.
  const [marcadas, setMarcadas] = useState<string[]>(inicial?.clases.map((c) => c.inicio) ?? []);
  const [motivo, setMotivo] = useState<MotivoId | null>(inicial?.motivo ?? null);
  const [detalle, setDetalle] = useState(inicial?.detalle ?? "");
  const [intento, setIntento] = useState(false);

  const dia = fecha ? diaDeFecha(fecha) : null;
  // Un solo horario para toda la app: el de Horario (sin cuenta, el de ejemplo de Horario).
  const usaHorarioReal = correo !== null;
  const clasesDelDia = !dia || !horarioLife ? [] : clasesDeIAELife(horarioLife, dia);
  // Solo cuentan las marcadas que siguen en el horario actual (el horario pudo cambiar en otra pestaña).
  const elegidas = clasesDelDia.filter((c) => marcadas.includes(c.inicio));
  const todas = clasesDelDia.length > 0 && elegidas.length === clasesDelDia.length;

  const faltan: string[] = [];
  if (nombre.trim() === "") faltan.push("escribir tu nombre");
  if (!fecha) faltan.push("elegir la fecha");
  else if (!dia) faltan.push("elegir un día de lunes a viernes");
  else if (elegidas.length === 0) faltan.push("marcar al menos una clase");
  if (motivo === "otro" && detalle.trim() === "") faltan.push("contar el motivo en el texto");

  function cambiarFecha(nueva: string) {
    setFecha(nueva);
    setMarcadas([]); // cada día tiene otras clases
  }

  function alternar(inicio: string) {
    setMarcadas((m) => (m.includes(inicio) ? m.filter((x) => x !== inicio) : [...m, inicio]));
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    setIntento(true);
    if (faltan.length > 0 || !dia) return;
    onEnviar({
      nombre: nombre.trim(),
      fecha,
      dia,
      clases: elegidas,
      motivo,
      detalle: detalle.trim(),
    });
  }

  const chip =
    "min-h-11 rounded-full px-4 text-sm font-semibold ring-1 transition-colors focus-visible:outline-2 focus-visible:outline-azul-500";
  const chipOn = "bg-azul-800 text-white ring-azul-800";
  const chipOff = "bg-white text-azul-900 ring-azul-200 hover:bg-azul-50";

  return (
    <form onSubmit={enviar} className="space-y-4">
      {!cuenta && (
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-azul-900/5">
          <label htmlFor="nombre" className="font-bold text-azul-950">
            ¿Cómo te llamas?
          </label>
          <input
            id="nombre"
            type="text"
            value={nombreEscrito}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Así se firman los correos"
            className="mt-3 w-full rounded-xl border border-azul-200 bg-azul-50/50 px-4 py-3 text-azul-950 placeholder:text-azul-900/40 focus:border-azul-500 focus:outline-none"
          />
          <p className="mt-2 text-xs text-azul-900/60">
            <Link href="/entrar" className="font-semibold text-azul-700 underline-offset-2 hover:underline">
              Entra con tu cuenta
            </Link>{" "}
            para usar tu horario real y no escribir tu nombre.
          </p>
        </section>
      )}

      <Paso n={1} titulo="¿Qué día vas a faltar?">
        <div className="flex flex-wrap gap-2">
          {[
            { t: "Hoy", d: 0 },
            { t: "Mañana", d: 1 },
          ].map(({ t, d }) => {
            const iso = isoDentroDe(d);
            return (
              <button
                key={t}
                type="button"
                onClick={() => cambiarFecha(iso)}
                className={`${chip} ${fecha === iso ? chipOn : chipOff}`}
              >
                {t}
              </button>
            );
          })}
          <label className="relative flex min-h-11 flex-1 items-center gap-2 rounded-full bg-azul-50 px-4 text-sm text-azul-900 ring-1 ring-azul-200 focus-within:ring-azul-500">
            <CalendarDays className="size-4 shrink-0 text-azul-700" aria-hidden />
            <span className="sr-only">Fecha</span>
            <input
              type="date"
              value={fecha}
              onChange={(e) => cambiarFecha(e.target.value)}
              className="min-w-0 flex-1 bg-transparent py-2 font-medium focus:outline-none"
            />
          </label>
        </div>
        {fecha && !dia && (
          <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Ese día es fin de semana: no pierdes ninguna clase.
          </p>
        )}
      </Paso>

      {dia && (
        <Paso n={2} titulo={`¿Qué clases pierdes el ${NOMBRES_DIAS[dia].toLowerCase()}?`}>
          <div className="-mt-1 mb-3 flex items-center justify-between gap-2">
            <p className="text-xs text-azul-900/60">
              {usaHorarioReal ? (
                <>
                  De{" "}
                  <Link href="/horario" className="font-semibold text-azul-700 hover:underline">
                    Mi horario
                  </Link>
                </>
              ) : (
                <>
                  Del{" "}
                  <Link href="/horario" className="font-semibold text-azul-700 hover:underline">
                    horario de ejemplo
                  </Link>
                </>
              )}
            </p>
            {clasesDelDia.length > 0 && (
              <button
                type="button"
                onClick={() => setMarcadas(todas ? [] : clasesDelDia.map((c) => c.inicio))}
                className="shrink-0 rounded-full px-2 py-1 text-sm font-semibold text-azul-700 hover:bg-azul-50"
              >
                {todas ? "Quitar todas" : "Todo el día"}
              </button>
            )}
          </div>
          {clasesDelDia.length === 0 ? (
            <p className="text-sm text-azul-900/60">No tienes clases ese día.</p>
          ) : (
            <ul className="grid gap-2">
              {clasesDelDia.map((c) => {
                const on = elegidas.includes(c);
                return (
                  <li key={c.inicio}>
                    <label
                      className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl px-3 py-2 ring-1 transition-colors ${
                        on ? "bg-azul-50 ring-azul-500" : "bg-white ring-azul-100 hover:bg-azul-50/60"
                      }`}
                    >
                      <input type="checkbox" checked={on} onChange={() => alternar(c.inicio)} className="sr-only" />
                      <span
                        className={`grid size-6 shrink-0 place-items-center rounded-lg border-2 transition-colors ${
                          on ? "border-azul-800 bg-azul-800 text-white" : "border-azul-200"
                        }`}
                        aria-hidden
                      >
                        {on && <Check className="size-4" />}
                      </span>
                      <span className="w-24 shrink-0 text-xs font-medium tabular-nums text-azul-900/60">
                        {c.inicio}–{c.fin}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold text-azul-950">{c.materia}</span>
                        <span className="block truncate text-xs text-azul-900/60">{c.profesor.nombre}</span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </Paso>
      )}

      <Paso n={dia ? 3 : 2} titulo="¿Por qué? (opcional)">
        <div className="flex flex-wrap gap-2">
          {MOTIVOS.map((m) => {
            const Icono = ICONOS[m.id];
            const on = motivo === m.id;
            return (
              <button
                key={m.id}
                type="button"
                aria-pressed={on}
                onClick={() => setMotivo(on ? null : m.id)}
                className={`${chip} flex items-center gap-2 ${on ? chipOn : chipOff}`}
              >
                <Icono className="size-4" aria-hidden />
                {m.etiqueta}
              </button>
            );
          })}
        </div>
        <label htmlFor="detalle" className="mt-4 block text-sm font-medium text-azul-900">
          {motivo === "otro" ? "Cuéntalo en una frase" : "¿Algo más que quieras decir?"}
        </label>
        <textarea
          id="detalle"
          rows={2}
          value={detalle}
          onChange={(e) => setDetalle(e.target.value)}
          placeholder="Por ejemplo: Es la final de la olimpiada de matemáticas."
          className="mt-2 w-full rounded-xl border border-azul-200 bg-azul-50/50 px-4 py-3 text-azul-950 placeholder:text-azul-900/40 focus:border-azul-500 focus:outline-none"
        />
        {motivo === "enfermedad" && (
          <p className="mt-2 text-xs text-azul-900/60">El correo no da detalles de tu salud si no los escribes.</p>
        )}
      </Paso>

      <div>
        <button
          type="submit"
          className="flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-azul-800 px-4 py-3.5 font-bold text-white shadow-lg shadow-azul-900/20 transition hover:-translate-y-0.5 hover:bg-azul-900"
        >
          <Sparkles className="size-5 text-oro" aria-hidden />
          Escribir mis correos
        </button>
        {intento && faltan.length > 0 && (
          <p className="mt-2 text-center text-sm text-red-600">Te falta: {faltan.join(", ")}.</p>
        )}
      </div>
    </form>
  );
}
