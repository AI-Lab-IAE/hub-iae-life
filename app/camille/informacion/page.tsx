import anim from "../animaciones.module.css";
import { EncabezadoSeccion } from "../components/EncabezadoSeccion";
import { HorarioSemana } from "../components/HorarioSemana";
import { Icono } from "../components/Icono";
import { Pantalla } from "../components/Pantalla";
import { TituloBloque } from "../components/TituloBloque";
import { retraso, tarjeta } from "../components/estilos";
import { reglas, servicios } from "../datos";

export default function Page() {
  return (
    <Pantalla>
      <EncabezadoSeccion ruta="informacion" />

      <section className={`mt-8 ${anim.aparecer}`} style={retraso(1)}>
        <TituloBloque titulo="Horario de secundaria" />
        <HorarioSemana />
      </section>

      <section className={`mt-8 ${anim.aparecer}`} style={retraso(2)}>
        <TituloBloque titulo="Reglas básicas" />
        <ul className={`${tarjeta} divide-y divide-slate-100 dark:divide-slate-800`}>
          {reglas.map((r) => (
            <li key={r} className="flex gap-3 p-3 text-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <Icono nombre="check" className="size-4" />
              </span>
              {r}
            </li>
          ))}
        </ul>
      </section>

      <section className={`mt-8 ${anim.aparecer}`} style={retraso(3)}>
        <TituloBloque titulo="Servicios" />
        <ul className="grid gap-3 sm:grid-cols-2">
          {servicios.map((s) => (
            <li key={s.nombre} className={`${tarjeta} flex gap-3 p-4`}>
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-400">
                <Icono nombre="campana" />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold">{s.nombre}</span>
                <span className="mt-0.5 block text-sm text-slate-500 dark:text-slate-400">{s.detalle}</span>
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-900 dark:bg-blue-950 dark:text-blue-300">
                  <Icono nombre="reloj" className="size-3.5" /> {s.horario}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </Pantalla>
  );
}
