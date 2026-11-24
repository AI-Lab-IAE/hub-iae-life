"use client";

// Pantalla Hoy (boceto de Camille, 24-nov): la próxima clase arriba, luego mis pendientes y los avisos recientes.
// Lee lo que ya guardan otras funciones en este navegador: el horario, los pendientes de School Guide
// y los avisos de AvisoYa. No guarda nada nuevo.
import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  BookOpen,
  CalendarDays,
  Check,
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
import { cambiarHecho, usePendientes } from "../camille/components/pendientes";
import { useAvisos } from "../abraham/almacen";

// "¿Qué quieres hacer hoy?": tarjetas suaves de colores (idea de Dribbble que mandó Camille).
const ATAJOS = [
  {
    href: "/marco",
    titulo: "Estudiar",
    texto: "Repasa antes del examen",
    icono: BookOpen,
    fondo: "from-sky-100 to-cyan-50",
  },
  {
    href: "/daniela",
    titulo: "Tareas",
    texto: "Organiza tu semana",
    icono: ClipboardCheck,
    fondo: "from-amber-100 to-lime-50",
  },
  {
    href: "/camille",
    titulo: "El colegio",
    texto: "Mapa, clubes y contactos",
    icono: Compass,
    fondo: "from-violet-100 to-sky-50",
  },
  {
    href: "/jonathan",
    titulo: "Faltar",
    texto: "Avisa tu ausencia",
    icono: Mail,
    fondo: "from-emerald-100 to-teal-50",
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

export default function Hoy() {
  const cuenta = useCuenta();
  const correo = cuenta?.rol === "estudiante" ? cuenta.correo : null;
  const horario = useHorario(correo);
  const minuto = useSyncExternalStore(suscribirReloj, minutoActual, () => null);
  const { pendientes, listo } = usePendientes();
  const avisos = useAvisos();

  const fecha = minuto === null ? null : new Date(minuto * 60_000);
  const { dia, ahora } = fecha ? momentoEnPanama(fecha) : { dia: null, ahora: null };
  const resumen = horario && dia !== null && ahora !== null ? resumenDelDia(horario, dia, ahora) : null;
  const bloque = resumen ? (resumen.actual ?? resumen.siguiente) : null;
  const clase = horario && bloque !== null && dia !== null ? materia(horario[bloque][dia]) : null;
  const esAhora = resumen?.actual !== null && resumen?.actual === bloque;

  const porHacer = pendientes.filter((p) => !p.hecho).slice(0, 3);
  // Solo avisos para todo el colegio: los de un salón o un estudiante se ven en AvisoYa, según quién seas.
  const ultimos = avisos.filter((a) => a.audiencia === "Toda la escuela").slice(0, 3);
  const nombre = cuenta?.nombre.split(" ")[0];

  return (
    <main className="relative flex-1 overflow-hidden bg-azul-50/70">
      <div
        className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-azul-200/50 blur-2xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-2xl px-4 pb-10 pt-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-azul-950">
          Hola{nombre ? `, ${nombre}` : ""} <span aria-hidden>👋</span>
        </h1>
        <p className="mt-1 text-lg text-azul-900/70 first-letter:uppercase">{fecha ? FECHA.format(fecha) : " "}</p>

        {/* Próxima clase */}
        <Link
          href="/horario"
          className="mt-6 flex items-center gap-4 rounded-3xl bg-linear-to-br from-azul-900 to-azul-800 p-5 text-white shadow-xl shadow-azul-900/20 transition hover:-translate-y-0.5"
        >
          <span className="grid size-14 shrink-0 place-items-center border-r border-white/30 pr-4">
            <CalendarDays className="size-9" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-white">{esAhora ? "Clase de ahora" : "Próxima clase"}</span>
            <span className="block truncate text-2xl font-bold">
              {clase ? clase.nombre : dia === null && fecha ? "Hoy no hay clases" : "No te quedan clases hoy"}
            </span>
            {clase && bloque !== null && (
              <span className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-white">
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
              className={`flex min-h-32 flex-col justify-between rounded-3xl bg-linear-to-br ${a.fondo} p-4 ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-azul-900/10`}
            >
              <a.icono className="size-6 text-azul-900/70" aria-hidden />
              <span>
                <span className="block font-bold text-azul-950">{a.titulo}</span>
                <span className="block text-sm text-azul-900">{a.texto}</span>
              </span>
            </Link>
          ))}
        </div>

        {/* Mis pendientes */}
        <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-azul-100">
          <Titulo icono={CheckCircle2} texto="Mis pendientes" href="/camille/pendientes" ver="Ver todas" />
          {!listo ? null : porHacer.length === 0 ? (
            <p className="mt-3 text-sm text-azul-900/60">
              No tienes pendientes.{" "}
              <Link href="/camille/pendientes" className="font-semibold text-azul-700">
                Agrega uno
              </Link>
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-azul-100">
              {porHacer.map((p) => (
                <li key={p.id} className="flex items-center gap-3 py-3">
                  <button
                    type="button"
                    onClick={() => cambiarHecho(p.id)}
                    aria-label={`Marcar «${p.titulo}» como hecho`}
                    className="group grid size-7 shrink-0 place-items-center rounded-lg border-2 border-azul-200 transition-colors hover:border-azul-700"
                  >
                    <Check className="size-4 text-azul-700 opacity-0 group-hover:opacity-100" aria-hidden />
                  </button>
                  <span className="min-w-0">
                    <span className="block truncate text-azul-950">{p.titulo}</span>
                    {p.materia && <span className="block text-xs text-azul-900/55">{p.materia}</span>}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Avisos del día */}
        <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-azul-100">
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
                        {DIA_CORTO.format(new Date(a.creado))} · {a.audiencia}
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
