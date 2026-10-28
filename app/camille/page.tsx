import Link from "next/link";
import anim from "./animaciones.module.css";
import { Bienvenida } from "./components/Bienvenida";
import { HorarioHoy } from "./components/HorarioHoy";
import { Icono } from "./components/Icono";
import { Tarjeta } from "./components/Tarjeta";
import { TituloBloque } from "./components/TituloBloque";
import { elevar, retraso, tarjeta, tocar } from "./components/estilos";
import { anuncios, contactos, documentos, eventos, pisos, reglas, servicios } from "./datos";
import { diaYMes, formatearFecha } from "./formato";
import { info } from "./info";
import { secciones, type RutaSeccion } from "./secciones";

// Número y texto que aparecen en cada tarjeta de "Mis secciones" (el número sube al abrir el inicio).
const datoSeccion: Record<RutaSeccion, { numero: number; texto: string }> = {
  mapa: { numero: pisos.length, texto: "pisos" },
  contactos: { numero: contactos.length, texto: "contactos" },
  documentos: { numero: documentos.length, texto: "documentos" },
  calendario: { numero: eventos.length, texto: "fechas" },
  anuncios: { numero: anuncios.length, texto: `anuncios · ${anuncios.filter((a) => a.importante).length} importantes` },
  informacion: { numero: servicios.length, texto: `servicios · ${reglas.length} reglas` },
};

export default function Page() {
  const recientes = [...anuncios].sort((a, b) => b.fecha.localeCompare(a.fecha));
  // El aviso resaltado es el importante más reciente; debajo van los demás.
  const destacado = recientes.find((a) => a.importante) ?? recientes[0];
  const otros = recientes.filter((a) => a !== destacado).slice(0, 2);
  const fechas = [...eventos].sort((a, b) => a.fecha.localeCompare(b.fecha)).slice(0, 4);
  const coordinacion = contactos.find((c) => c.cargo === "Coordinación académica")!;

  return (
    <main className={`mx-auto w-full max-w-6xl flex-1 px-4 py-4 sm:px-8 sm:py-6 ${anim.entrar}`}>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-8 lg:col-span-2">
          <Bienvenida />

          {/* Mis secciones */}
          <section className={anim.aparecer} style={retraso(1)}>
            <TituloBloque titulo="Mis secciones" />
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4">
              {secciones.map((s, i) => (
                <div key={s.ruta} className={anim.crecer} style={retraso(i + 2)}>
                  <Tarjeta ruta={s.ruta} icono={s.icono} nombre={s.nombre} {...datoSeccion[s.ruta]} />
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-8 sm:grid-cols-2">
            {/* Avisos */}
            <section className={anim.aparecer} style={retraso(4)}>
              <TituloBloque titulo="Avisos" href="/camille/anuncios" />
              <div className="flex flex-col gap-3">
                <Link
                  href="/camille/anuncios"
                  className={`${tocar} flex items-center gap-3 rounded-2xl bg-indigo-500 p-4 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-600`}
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/20">
                    <Icono nombre="campana" className={`size-5 ${anim.sonar}`} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-indigo-100">
                      {destacado.importante ? "¡Importante!" : "Nuevo"} · {formatearFecha(destacado.fecha)}
                    </span>
                    <span className="block font-semibold">{destacado.titulo}</span>
                  </span>
                </Link>
                {otros.map((a) => (
                  <Link key={a.titulo} href="/camille/anuncios" className={`${tarjeta} ${elevar} ${tocar} flex items-center gap-3 p-3`}>
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                      <Icono nombre="anuncios" className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{a.titulo}</span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400">{formatearFecha(a.fecha)}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Próximas fechas */}
            <section className={anim.aparecer} style={retraso(5)}>
              <TituloBloque titulo="Próximas fechas" href="/camille/calendario" />
              <ul className="flex flex-col gap-3">
                {fechas.map((e) => {
                  const { dia, mes } = diaYMes(e.fecha);
                  return (
                    <li key={e.titulo} className={`${tarjeta} flex items-center gap-3 p-3`}>
                      <span className="flex size-11 shrink-0 flex-col items-center justify-center rounded-xl bg-indigo-950 leading-none text-white">
                        <span className="font-bold">{dia}</span>
                        <span className="text-[9px] uppercase">{mes}</span>
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{e.titulo}</span>
                        <span className="block text-xs text-indigo-600 dark:text-indigo-300">{e.tipo}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </div>

        {/* Columna derecha: horario de hoy y ayuda */}
        <aside className="flex flex-col gap-8">
          <section className={anim.aparecer} style={retraso(3)}>
            <TituloBloque titulo="Horario de hoy" />
            <HorarioHoy />
          </section>

          <section className={anim.aparecer} style={retraso(6)}>
            <a href={`mailto:${coordinacion.correo}`} className={`${tarjeta} ${elevar} ${tocar} flex items-center gap-3 p-4`}>
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                <Icono nombre="correo" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">¿Necesitas ayuda?</span>
                <span className="block text-sm text-slate-500 dark:text-slate-400">Escríbele a {coordinacion.lugar}</span>
              </span>
              <Icono nombre="adelante" className="size-5 shrink-0 text-slate-400" />
            </a>
          </section>
        </aside>
      </div>

      <p className="mt-10 text-center text-xs text-slate-400">
        {info.proyecto} · un proyecto de {info.estudiante} · AI Lab IAE · Datos de ejemplo, ficticios
      </p>
    </main>
  );
}
