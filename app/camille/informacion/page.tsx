import anim from "../animaciones.module.css";
import Link from "next/link";
import { Icono } from "../components/Icono";
import { Seccion } from "../components/Seccion";
import { TituloBloque } from "../components/TituloBloque";
import { retraso, tarjeta } from "../components/estilos";
import { reglas } from "../datos";

export default function Page() {
  return (
    <Seccion ruta="informacion">

      {/* El horario de clases es uno solo para toda la app: está en Horario. */}
      <Link href="/horario" className={`${tarjeta} flex items-center justify-between gap-3 p-4 font-semibold text-azul-800 hover:bg-azul-50`}>
        Ver mi horario de clases
        <Icono nombre="adelante" className="size-5 shrink-0" />
      </Link>

      <section className={`mt-8 ${anim.aparecer}`} style={retraso(1)}>
        <TituloBloque titulo="Reglas básicas" />
        <ul className={`${tarjeta} divide-y divide-azul-100`}>
          {reglas.map((r) => (
            <li key={r} className="flex gap-3 p-3 text-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Icono nombre="check" className="size-4" />
              </span>
              {r}
            </li>
          ))}
        </ul>
      </section>
    </Seccion>
  );
}
