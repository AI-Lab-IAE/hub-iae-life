import Link from "next/link";
import anim from "./animaciones.module.css";
import { Icono } from "./components/Icono";
import { Tarjeta } from "./components/Tarjeta";
import { retraso, tocar } from "./components/estilos";
import { anuncios } from "./datos";
import { formatearFecha } from "./formato";
import { info } from "./info";
import { secciones } from "./secciones";

export default function Page() {
  const ultimoAnuncio = [...anuncios].sort((a, b) => b.fecha.localeCompare(a.fecha))[0];

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
      {/* Tarjeta de bienvenida */}
      <section
        className={`relative overflow-hidden rounded-3xl bg-linear-to-br from-sky-400 via-sky-500 to-sky-600 p-6 text-white shadow-lg shadow-sky-500/25 ${anim.aparecer}`}
      >
        <span className="absolute -top-12 -right-10 size-44 rounded-full bg-white/10" aria-hidden="true" />
        <span className="absolute -bottom-16 -left-8 size-36 rounded-full bg-white/10" aria-hidden="true" />

        <div className="relative">
          <p className="text-sm text-sky-100">¡Hola! 👋</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Tu guía del IAE</h1>
          <p className="mt-2 max-w-xl text-sm text-sky-50/90">{info.descripcion}</p>

          <Link
            href="/camille/anuncios"
            className={`${tocar} mt-5 flex items-center gap-3 rounded-2xl bg-white/15 p-3 ring-1 ring-white/20 backdrop-blur-sm hover:bg-white/25`}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-sky-600">
              <Icono nombre="anuncios" className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] tracking-wide text-sky-100 uppercase">Último anuncio</span>
              <span className="block truncate font-semibold">{ultimoAnuncio.titulo}</span>
              <span className="block text-xs text-sky-100">{formatearFecha(ultimoAnuncio.fecha)}</span>
            </span>
            <Icono nombre="adelante" className="size-5 shrink-0 text-sky-100" />
          </Link>
        </div>
      </section>

      <div className={`mt-4 flex justify-center ${anim.aparecer}`} style={retraso(1)}>
        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-950 dark:text-sky-300">
          Los datos de esta guía son de ejemplo y ficticios
        </span>
      </div>

      <h2
        className={`mt-6 mb-3 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400 ${anim.aparecer}`}
        style={retraso(2)}
      >
        Accesos rápidos
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {secciones.map((s, i) => (
          <div key={s.ruta} className={anim.aparecer} style={retraso(i + 3)}>
            <Tarjeta {...s} />
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-slate-400">
        {info.proyecto} · un proyecto de {info.estudiante} · AI Lab IAE
      </p>
    </main>
  );
}
