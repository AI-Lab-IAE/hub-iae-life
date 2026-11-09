import Link from "next/link";
import anim from "../animaciones.module.css";
import { EncabezadoSeccion } from "../components/EncabezadoSeccion";
import { Icono } from "../components/Icono";
import { EstadoClub, LogoClub } from "../components/LogoClub";
import { Pantalla } from "../components/Pantalla";
import { elevar, retraso, tarjeta, tocar } from "../components/estilos";
import { clubes } from "../datos";

export default function Page() {
  return (
    <Pantalla>
      <EncabezadoSeccion ruta="clubes" />

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {clubes.map((c, i) => (
          <li key={c.id} className={anim.aparecer} style={retraso(i + 1)}>
            <Link href={`/camille/clubes/${c.id}`} className={`${tarjeta} ${elevar} ${tocar} flex h-full items-center gap-3 p-4`}>
              <LogoClub club={c} />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{c.nombre}</span>
                <span className="mt-1 block">
                  <EstadoClub abierto={c.abierto} />
                </span>
                <span className="mt-0.5 block text-sm text-slate-500 dark:text-slate-400">{c.descripcion}</span>
                <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                  <span className="flex items-center gap-1">
                    <Icono nombre="reloj" className="size-3.5" /> {c.dia}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icono nombre="contactos" className="size-3.5" /> {c.integrantes.length} integrantes
                  </span>
                </span>
              </span>
              <Icono nombre="adelante" className="size-5 shrink-0 text-slate-400" />
            </Link>
          </li>
        ))}
      </ul>
    </Pantalla>
  );
}
