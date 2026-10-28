import anim from "./animaciones.module.css";
import { Bienvenida } from "./components/Bienvenida";
import { Icono } from "./components/Icono";
import { Tarjeta } from "./components/Tarjeta";
import { TituloBloque } from "./components/TituloBloque";
import { elevar, retraso, tarjeta, tocar } from "./components/estilos";
import { anuncios, contactos, eventos, horarioSecundaria } from "./datos";
import { diaYMes, formatearFecha } from "./formato";
import { info } from "./info";
import { secciones } from "./secciones";

export default function Page() {
  const anunciosRecientes = [...anuncios].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const ultimoAnuncio = anunciosRecientes[0];
  const fechas = [...eventos].sort((a, b) => a.fecha.localeCompare(b.fecha)).slice(0, 5);
  const coordinacion = contactos.find((c) => c.cargo === "Coordinación académica")!;

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
      {/* Tarjeta de bienvenida: cambia según el perfil */}
      <Bienvenida ultimoAnuncio={ultimoAnuncio} />

      <div className={`mt-4 flex justify-center ${anim.aparecer}`} style={retraso(1)}>
        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-950 dark:text-sky-300">
          Los datos de esta guía son de ejemplo y ficticios
        </span>
      </div>

      {/* Accesos rápidos */}
      <section className={`mt-6 ${anim.aparecer}`} style={retraso(2)}>
        <TituloBloque titulo="Accesos rápidos" />
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          {secciones.map((s, i) => (
            <div key={s.ruta} className={anim.aparecer} style={retraso(i + 3)}>
              <Tarjeta {...s} />
            </div>
          ))}
        </div>
      </section>

      {/* Fechas importantes: se deslizan de lado en el celular */}
      <section className={`mt-8 ${anim.aparecer}`} style={retraso(6)}>
        <TituloBloque titulo="Fechas importantes" href="/camille/calendario" />
        <ul className="-mx-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0">
          {fechas.map((e) => {
            const { dia, mes } = diaYMes(e.fecha);
            return (
              <li key={e.titulo} className={`${tarjeta} w-36 shrink-0 snap-start p-3 sm:w-auto`}>
                <span className="flex size-12 flex-col items-center justify-center rounded-xl bg-sky-500 leading-none text-white shadow-sm shadow-sky-500/30">
                  <span className="text-lg font-bold">{dia}</span>
                  <span className="text-[10px] uppercase">{mes}</span>
                </span>
                <p className="mt-2 line-clamp-2 text-sm font-medium">{e.titulo}</p>
                <p className="mt-1 text-xs text-sky-600 dark:text-sky-400">{e.tipo}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {/* Anuncios recientes */}
        <section className={anim.aparecer} style={retraso(7)}>
          <TituloBloque titulo="Anuncios recientes" href="/camille/anuncios" />
          <ul className={`${tarjeta} divide-y divide-sky-50 dark:divide-sky-900/40`}>
            {anunciosRecientes.slice(0, 3).map((a) => (
              <li key={a.titulo} className="flex items-start gap-3 p-3">
                <span
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${a.importante ? "bg-rose-500" : "bg-sky-300"}`}
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{a.titulo}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    {formatearFecha(a.fecha)}
                    {a.importante && <span className="ml-1 text-rose-600 dark:text-rose-400">· Importante</span>}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-6">
          {/* Horario del día */}
          <section className={anim.aparecer} style={retraso(8)}>
            <TituloBloque titulo="Horario de secundaria" href="/camille/informacion" />
            <div className={`${tarjeta} grid grid-cols-3 divide-x divide-sky-50 dark:divide-sky-900/40`}>
              {[
                { que: "Entrada", cuando: horarioSecundaria.entrada },
                { que: "Salida", cuando: horarioSecundaria.salida },
                { que: "Salida viernes", cuando: horarioSecundaria.salidaViernes },
              ].map((h) => (
                <div key={h.que} className="p-3 text-center">
                  <Icono nombre="reloj" className="mx-auto size-5 text-sky-500" />
                  <p className="mt-1 text-sm font-semibold tabular-nums">{h.cuando}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{h.que}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Ayuda */}
          <section className={anim.aparecer} style={retraso(9)}>
            <a
              href={`mailto:${coordinacion.correo}`}
              className={`${tarjeta} ${elevar} ${tocar} flex items-center gap-3 p-4`}
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                <Icono nombre="correo" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">¿Necesitas ayuda?</span>
                <span className="block text-sm text-slate-500 dark:text-slate-400">
                  Escríbele a {coordinacion.lugar}
                </span>
              </span>
              <Icono nombre="adelante" className="size-5 shrink-0 text-slate-400" />
            </a>
          </section>
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-slate-400">
        {info.proyecto} · un proyecto de {info.estudiante} · AI Lab IAE
      </p>
    </main>
  );
}
