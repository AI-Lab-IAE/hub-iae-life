"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowRight, CalendarDays, Clock, MapPin } from "lucide-react";
import { eventos } from "../camille/datos";
import { estudianteEjemplo, horarioEjemplo, tareasEjemplo } from "./ejemplo";

// La parte de «Hoy» que depende de la fecha y la hora del celular: saludo, próxima clase,
// tareas y próximas fechas. Se calcula en el navegador.
const suscribir = () => () => {};
const ahoraEnCliente = () => Math.floor(Date.now() / 60000);
const enServidor = () => null;

const minutos = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export default function ResumenHoy() {
  const minuto = useSyncExternalStore(suscribir, ahoraEnCliente, enServidor);

  if (minuto === null) {
    return <div className="h-80 animate-pulse rounded-3xl bg-azul-50" aria-hidden />;
  }

  const ahora = new Date(minuto * 60000);
  const hora = ahora.getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 18 ? "Buenas tardes" : "Buenas noches";
  const texto = ahora.toLocaleDateString("es-PA", { weekday: "long", day: "numeric", month: "long" });
  const fecha = texto.charAt(0).toUpperCase() + texto.slice(1);

  const clases = horarioEjemplo[ahora.getDay()] ?? [];
  const ahoraMin = hora * 60 + ahora.getMinutes();
  const enCurso = clases.find((c) => minutos(c.inicio) <= ahoraMin && ahoraMin < minutos(c.fin));
  const siguiente = clases.find((c) => minutos(c.inicio) > ahoraMin);
  const clase = enCurso ?? siguiente;

  const hoyISO = ahora.toLocaleDateString("en-CA");
  const proximas = eventos.filter((e) => e.fecha >= hoyISO).slice(0, 3);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Saludo y próxima clase */}
      <section className="life-entrar rounded-3xl bg-linear-to-br from-azul-800 to-azul-950 p-6 text-white lg:col-span-2">
        <p className="text-sm text-azul-200">{fecha}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
          {saludo}, {estudianteEjemplo.nombre.split(" ")[0]}
        </h1>
        <p className="mt-1 text-azul-200">{estudianteEjemplo.grado}</p>

        <div className="mt-6 rounded-2xl bg-white/10 p-4 backdrop-blur">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-azul-200">
            <Clock className="size-4" aria-hidden />
            {enCurso ? "Ahora" : clase ? "Tu próxima clase" : "Clases"}
          </p>
          {clase ? (
            <>
              <p className="mt-2 text-2xl font-bold">{clase.materia}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-azul-100">
                <span>
                  {clase.inicio} – {clase.fin}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" aria-hidden /> {clase.salon}
                </span>
                <span>{clase.profesor}</span>
              </p>
            </>
          ) : (
            <p className="mt-2 text-lg font-semibold">
              {clases.length ? "Terminaste las clases de hoy." : "Hoy no hay clases."}
            </p>
          )}
        </div>
      </section>

      {/* Tareas */}
      <section className="life-entrar rounded-3xl border border-azul-100 bg-white p-6" style={{ animationDelay: "0.08s" }}>
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-azul-950">Tareas pendientes</h2>
          <Link href="/tareas" className="flex items-center gap-1 text-sm font-semibold text-azul-700">
            Ver <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <ul className="mt-4 space-y-3">
          {tareasEjemplo.map((t) => (
            <li key={t.titulo} className="flex items-start gap-3">
              <span
                className={`mt-1 size-2.5 shrink-0 rounded-full ${t.dias <= 1 ? "bg-rose-500" : t.dias <= 3 ? "bg-amber-400" : "bg-azul-300"}`}
                aria-hidden
              />
              <span className="min-w-0">
                <span className="block font-medium text-azul-950">{t.titulo}</span>
                <span className="block text-sm text-azul-900/55">
                  {t.materia} · {t.dias === 1 ? "para mañana" : `en ${t.dias} días`}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Próximas fechas */}
      <section
        className="life-entrar rounded-3xl border border-azul-100 bg-white p-6 lg:col-span-3"
        style={{ animationDelay: "0.16s" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-bold text-azul-950">
            <CalendarDays className="size-5 text-azul-600" aria-hidden /> Próximas fechas
          </h2>
          <Link href="/colegio/calendario" className="flex items-center gap-1 text-sm font-semibold text-azul-700">
            Calendario <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        {proximas.length ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {proximas.map((e) => {
              const d = new Date(`${e.fecha}T12:00:00`);
              return (
                <li key={e.fecha + e.titulo} className="flex gap-3 rounded-2xl bg-azul-50/70 p-3">
                  <span className="grid w-12 shrink-0 place-items-center rounded-xl bg-white py-1 text-center">
                    <span className="text-lg font-bold leading-none text-azul-900">{d.getDate()}</span>
                    <span className="text-[11px] uppercase text-azul-900/55">
                      {d.toLocaleDateString("es-PA", { month: "short" })}
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium text-azul-950">{e.titulo}</span>
                    <span className="block text-sm text-azul-900/55">{e.tipo}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-azul-900/60">No hay fechas próximas.</p>
        )}
      </section>
    </div>
  );
}
