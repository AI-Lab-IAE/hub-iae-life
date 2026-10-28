"use client";

import Link from "next/link";
import anim from "../animaciones.module.css";
import { formatearFecha } from "../formato";
import { info } from "../info";
import { resumenDelDia, useHoy } from "./hoy";
import { tocar } from "./estilos";
import { Icono } from "./Icono";
import { descripcionPerfil, esSecundaria, usePerfil } from "./perfil";

// "miércoles" → "Miércoles"
const mayuscula = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);

type Props = { ultimoAnuncio: { titulo: string; fecha: string } };

// Tarjeta grande del inicio. Con perfil saluda por nombre y dice qué toca hoy;
// sin perfil invita a crearlo.
export function Bienvenida({ ultimoAnuncio }: Props) {
  const { listo, perfil } = usePerfil();
  const hoy = useHoy();
  const dia = hoy ? resumenDelDia(hoy) : null;

  return (
    <section
      className={`relative overflow-hidden rounded-3xl bg-linear-to-br from-sky-400 via-sky-500 to-sky-600 p-6 text-white shadow-lg shadow-sky-500/25 ${anim.aparecer}`}
    >
      <span className="absolute -top-12 -right-10 size-44 rounded-full bg-white/10" aria-hidden="true" />
      <span className="absolute -bottom-16 -left-8 size-36 rounded-full bg-white/10" aria-hidden="true" />

      <div className="relative">
        <p className="text-sm text-sky-100">{dia ? `${mayuscula(dia.nombre)}, ${formatearFecha(hoy!)}` : "¡Hola! 👋"}</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{perfil ? `¡Hola, ${perfil.nombre}! 👋` : "Tu guía del IAE"}</h1>
        <p className="mt-2 max-w-xl text-sm text-sky-50/90">{perfil ? descripcionPerfil(perfil) : info.descripcion}</p>

        {/* Qué toca hoy: solo para secundaria, que es el horario que tenemos. */}
        {perfil && dia && esSecundaria(perfil) && (
          <p className={`mt-4 flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-sm ring-1 ring-white/20 ${anim.aparecer}`}>
            <Icono nombre="reloj" className="size-4 shrink-0" />
            <span>
              <strong>Hoy:</strong> {dia.texto}
            </span>
          </p>
        )}

        {listo && !perfil && (
          <Link
            href="/camille/perfil"
            className={`${tocar} ${anim.aparecer} mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-sky-700 shadow-md hover:bg-sky-50`}
          >
            <Icono nombre="perfil" className="size-4" /> Crear mi perfil
          </Link>
        )}

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
  );
}
