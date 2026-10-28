"use client";

import Link from "next/link";
import anim from "../animaciones.module.css";
import { info } from "../info";
import { resumenDelDia, useHoy } from "./hoy";
import { tocar } from "./estilos";
import { Icono } from "./Icono";
import { descripcionPerfil, esSecundaria, usePerfil } from "./perfil";

// Tarjeta de saludo del inicio. Con perfil saluda por nombre y dice qué toca hoy;
// sin perfil invita a crearlo.
export function Bienvenida() {
  const { listo, perfil } = usePerfil();
  const hoy = useHoy();
  const dia = hoy ? resumenDelDia(hoy) : null;

  return (
    <section
      className={`relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-500 via-indigo-600 to-indigo-700 p-5 text-white shadow-lg sm:p-6 shadow-indigo-500/25 ${anim.aparecer}`}
    >
      <span className="absolute -top-12 -right-10 size-44 rounded-full bg-white/10" aria-hidden="true" />
      <span className="absolute -bottom-16 -left-8 size-36 rounded-full bg-white/10" aria-hidden="true" />

      <div className="relative">
        <p className="text-sm text-indigo-200">{perfil ? "Te damos la bienvenida" : "Instituto Alberto Einstein"}</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{perfil ? `¡Hola, ${perfil.nombre}!` : "Tu guía del IAE"}</h1>
        <p className="mt-2 max-w-xl text-sm text-indigo-100/90">{perfil ? descripcionPerfil(perfil) : info.descripcion}</p>

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
            className={`${tocar} ${anim.aparecer} mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-md hover:bg-indigo-50`}
          >
            <Icono nombre="perfil" className="size-4" /> Crear mi perfil
          </Link>
        )}

      </div>
    </section>
  );
}
