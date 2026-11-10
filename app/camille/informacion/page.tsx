import anim from "../animaciones.module.css";
import { EncabezadoSeccion } from "../components/EncabezadoSeccion";
import { HorarioSemana } from "../components/HorarioSemana";
import { Icono } from "../components/Icono";
import { Pantalla } from "../components/Pantalla";
import { TituloBloque } from "../components/TituloBloque";
import { retraso, tarjeta } from "../components/estilos";
import { reglas } from "../datos";

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
    </Pantalla>
  );
}
