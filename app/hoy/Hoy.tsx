"use client";

// Pantalla Hoy, la portada de IAE LIFE (boceto de Camille, 24-nov): la próxima clase arriba,
// luego mis tareas y los avisos recientes. Lee lo que ya guardan las otras funciones en este navegador:
// el horario (Horario), las tareas (Tareas) y los avisos (Avisos). No guarda nada nuevo.
import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Compass,
  Mail,
  Megaphone,
} from "lucide-react";
import { useCuenta } from "../_life/cuenta";
import { BLOQUES, materia, momentoEnPanama, resumenDelDia, useHorario } from "../_life/horario";
import { useTareasPendientes } from "../daniela/lib/tareas";
import { useAvisos } from "../abraham/almacen";

// "¿Qué quieres hacer hoy?": tarjetas suaves de colores (idea de Dribbble que mandó Camille).
const ATAJOS = [
  {
    href: "/marco",
    titulo: "Estudiar",
    texto: "Repasa antes del examen",
    icono: BookOpen,
    fondo: "bg-azul-100 text-azul-800",
  },
  {
    href: "/daniela",
    titulo: "Organiza",
    texto: "Organiza tu semana",
    icono: ClipboardCheck,
    fondo: "bg-violet-100 text-violet-700",
  },
  {
    href: "/camille",
    titulo: "Colegio",
    texto: "Mapa, clubes y contactos",
    icono: Compass,
    fondo: "bg-orange-50 text-orange-700",
  },
  {
    href: "/jonathan",
    titulo: "Retoma",
    texto: "Avisa a tus profes y ponte al día",
    icono: Mail,
    fondo: "bg-red-50 text-red-700",
  },
];

function suscribirReloj(aviso: () => void) {
  const id = setInterval(aviso, 30_000);
  return () => clearInterval(id);
}
const minutoActual = () => Math.floor(Date.now() / 60_000);

const FECHA = new Intl.DateTimeFormat("es-PA", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "America/Panama",
});
const DIA_CORTO = new Intl.DateTimeFormat("es-PA", { day: "numeric", month: "short", timeZone: "America/Panama" });
// Lo guardado puede traer una fecha rota: entonces no se muestra (format() con una fecha inválida rompe la página).
function diaCorto(fecha: string | Date): string {
  const f = typeof fecha === "string" ? new Date(fecha) : fecha;
  return Number.isNaN(f.getTime()) ? "" : DIA_CORTO.format(f);
}

export default function Hoy() {
  const cuenta = useCuenta();
  const correo = cuenta?.rol === "estudiante" ? cuenta.correo : null;
  const horario = useHorario(correo);
  const minuto = useSyncExternalStore(suscribirReloj, minutoActual, () => null);
  const tareas = useTareasPendientes(cuenta?.correo ?? null);
  const avisos = useAvisos();

  const fecha = minuto === null ? null : new Date(minuto * 60_000);
  const { dia, ahora } = fecha ? momentoEnPanama(fecha) : { dia: null, ahora: null };
  const resumen = horario && dia !== null && ahora !== null ? resumenDelDia(horario, dia, ahora) : null;
  const bloque = resumen ? (resumen.actual ?? resumen.siguiente) : null;
  const clase = horario && bloque !== null && dia !== null ? materia(horario[bloque][dia]) : null;
  const esAhora = resumen?.actual !== null && resumen?.actual === bloque;

  const porHacer = (tareas ?? []).slice(0, 3);
  // Solo avisos para todo el colegio: los de un salón o un estudiante se ven en Avisos, según quién seas.
  const ultimos = avisos.filter((a) => a.audiencia === "Toda la escuela").slice(0, 3);
  const nombre = cuenta?.nombre.split(" ")[0];

  return (
    <main className="relative flex-1 overflow-hidden bg-azul-50/60">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-linear-to-br from-azul-900 via-azul-800 to-azul-700"
        aria-hidden
      />
      <div className="relative mx-auto max-w-2xl px-4 pb-10 pt-8">
        <h1 className="text-4xl font-black tracking-tight text-white">
          Hola{nombre ? `, ${nombre}` : ""} <span aria-hidden>👋</span>
        </h1>
        <p className="mt-1 text-lg text-azul-100">¿Todo listo para tu día?</p>
        <p className="mt-0.5 text-sm font-medium text-lime-300 first-letter:uppercase">
          {fecha ? FECHA.format(fecha) : " "}
        </p>

        {/* Próxima clase */}
        <Link
          href="/horario"
          className="mt-6 flex items-center gap-4 rounded-3xl bg-white p-5 text-azul-950 shadow-xl shadow-azul-900/15 ring-1 ring-azul-900/5 transition hover:-translate-y-0.5"
        >
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-azul-800 text-white">
            <CalendarDays className="size-7" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-azul-900">
              {esAhora ? "Clase de ahora" : "Próxima clase"}
            </span>
            <span className="block truncate text-2xl font-bold text-azul-800">
              {clase ? clase.nombre : dia === null && fecha ? "Hoy no hay clases" : "No te quedan clases hoy"}
            </span>
            {clase && bloque !== null && (
              <span className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-azul-900">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4" aria-hidden />
                  {BLOQUES[bloque].desde}–{BLOQUES[bloque].hasta}
                </span>
                <span className="truncate">{clase.profesor}</span>
              </span>
            )}
          </span>
          <ChevronRight className="size-6 shrink-0" aria-hidden />
        </Link>

        {/* ¿Qué quieres hacer hoy? */}
        <h2 className="mt-7 text-lg font-bold text-azul-950">¿Qué quieres hacer hoy?</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {ATAJOS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex min-h-32 flex-col justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-azul-900/5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-azul-900/10"
            >
              <span className={`grid size-11 place-items-center rounded-full ${a.fondo}`}>
                <a.icono className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block font-bold text-azul-800">{a.titulo}</span>
                <span className="block text-sm text-azul-900">{a.texto}</span>
              </span>
            </Link>
          ))}
        </div>

        {/* Mis tareas: las mismas de la función Tareas */}
        <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-azul-900/5">
          <Titulo icono={CheckCircle2} texto="Mis tareas" href="/daniela" ver="Ver todas" />
          {tareas === null ? null : porHacer.length === 0 ? (
            <p className="mt-3 text-sm text-azul-900/60">
              No tienes tareas pendientes.{" "}
              <Link href="/daniela" className="font-semibold text-azul-700">
                Agrega una
              </Link>
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-azul-100">
              {porHacer.map((t) => (
                <li key={t.id}>
                  <Link href="/daniela" className="flex items-center gap-3 py-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-violet-100 text-violet-700">
                      <ClipboardCheck className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-azul-950">{t.nombre}</span>
                      <span className="block text-xs text-azul-900/55">
                        {[t.materia, t.entrega && `Entrega ${diaCorto(`${t.entrega}T12:00:00-05:00`)}`]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </span>
                    <ChevronRight className="size-5 shrink-0 text-azul-900/40" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Avisos del día */}
        <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-azul-900/5">
          <Titulo icono={Megaphone} texto="Avisos recientes" href="/abraham" ver="Ver todos" />
          {ultimos.length === 0 ? (
            <p className="mt-3 text-sm text-azul-900/60">No hay avisos.</p>
          ) : (
            <ul className="mt-2 divide-y divide-azul-100">
              {ultimos.map((a) => (
                <li key={a.id}>
                  <Link href="/abraham" className="flex items-center gap-3 py-3">
                    <span
                      className={`size-8 shrink-0 rounded-full ${a.urgente ? "bg-amber-200" : "bg-azul-200/70"}`}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-azul-950">{a.texto}</span>
                      <span className="block text-xs text-azul-700">
                        {[diaCorto(a.creado), a.audiencia].filter(Boolean).join(" · ")}
                        {a.urgente && " · Urgente"}
                      </span>
                    </span>
                    <ChevronRight className="size-5 shrink-0 text-azul-900/40" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="mt-6 text-center text-xs text-azul-900/45">Vista previa: los datos son de ejemplo.</p>
      </div>
    </main>
  );
}

function Titulo({ icono: Icono, texto, href, ver }: { icono: typeof Clock; texto: string; href: string; ver: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-3 text-lg font-bold text-azul-950">
        <Icono className="size-6 text-azul-800" aria-hidden /> {texto}
      </h2>
      <Link href={href} className="flex items-center gap-0.5 text-sm font-medium text-azul-700 hover:text-azul-900">
        {ver} <ChevronRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}
