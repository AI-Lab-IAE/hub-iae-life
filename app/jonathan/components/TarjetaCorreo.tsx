"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, Mail, RefreshCw } from "lucide-react";
import { LARGOS, TONOS, enlaceGmail, enlaceMailto, materiasDe } from "../lib/correos";
import type { Correo, Largo, Tono } from "../lib/tipos";

// Botones juntos para elegir una opción (tono o largo).
function Selector<T extends string>({
  etiqueta,
  opciones,
  valor,
  onCambio,
}: {
  etiqueta: string;
  opciones: { id: T; etiqueta: string }[];
  valor: T;
  onCambio: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={etiqueta}>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-azul-900/50">{etiqueta}</p>
      <div className="flex rounded-full bg-azul-50 p-1 ring-1 ring-azul-100">
        {opciones.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={o.id === valor}
            onClick={() => onCambio(o.id)}
            className={`min-h-9 flex-1 rounded-full px-2 text-xs font-semibold transition-colors sm:text-sm ${
              o.id === valor ? "bg-white text-azul-800 shadow-sm ring-1 ring-azul-900/10" : "text-azul-900/60 hover:text-azul-900"
            }`}
          >
            {o.etiqueta}
          </button>
        ))}
      </div>
    </div>
  );
}

type Props = {
  correo: Correo;
  cc: string;
  abierto: boolean;
  onTono: (t: Tono) => void;
  onLargo: (l: Largo) => void;
  onRegenerar: () => void;
  onEditar: (campo: "asunto" | "cuerpo", valor: string) => void;
  onAbierto: () => void;
};

export default function TarjetaCorreo({ correo, cc, abierto, onTono, onLargo, onRegenerar, onEditar, onAbierto }: Props) {
  // Qué se copió por última vez ("asunto" o "mensaje"), o "error" si el navegador no dejó copiar.
  const [copia, setCopia] = useState<"" | "asunto" | "mensaje" | "error">("");
  const para = correo.profesor.correo;

  async function copiar(que: "asunto" | "mensaje"): Promise<void> {
    try {
      await navigator.clipboard.writeText(que === "asunto" ? correo.asunto : correo.cuerpo);
      setCopia(que);
      setTimeout(() => setCopia((c) => (c === que ? "" : c)), 2500);
    } catch {
      setCopia("error"); // no se dice "copiado": se muestra el texto para copiarlo a mano
    }
  }

  // Al abrir Gmail o la app de correo, el mensaje se copia solo para pegarlo (no viaja en el enlace).
  function abrir() {
    void copiar("mensaje");
    onAbierto();
  }

  const campo =
    "w-full rounded-xl border border-azul-100 bg-azul-50/50 px-3 py-2 text-sm text-azul-950 focus:border-azul-500 focus:bg-white focus:outline-none";

  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-azul-900/5">
      <header className="flex items-start gap-3 border-b border-azul-100 p-5">
        <span
          className={`grid size-11 shrink-0 place-items-center rounded-full ${
            abierto ? "bg-lime-100 text-lime-700" : "bg-azul-100 text-azul-800"
          }`}
        >
          {abierto ? <Check className="size-5" aria-hidden /> : <Mail className="size-5" aria-hidden />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-azul-950">{correo.profesor.nombre}</p>
          <p className="text-sm text-azul-800">{materiasDe(correo.clases)}</p>
          <p className="mt-1 break-all text-xs text-azul-900/60">
            Para: {para}{" "}
            <span className="whitespace-nowrap rounded-full bg-oro/20 px-1.5 py-0.5 font-semibold text-azul-950">
              correo de ejemplo: escribe el real
            </span>
          </p>
          {cc && <p className="break-all text-xs text-azul-900/60">CC: {cc}</p>}
        </div>
        {abierto && (
          <span className="shrink-0 rounded-full bg-lime-100 px-2.5 py-1 text-xs font-semibold text-lime-800">Abierto</span>
        )}
      </header>

      <div className="space-y-4 p-5">
        <div className="grid gap-3 sm:grid-cols-[3fr_2fr]">
          <Selector etiqueta="Tono" opciones={TONOS} valor={correo.tono} onCambio={onTono} />
          <Selector etiqueta="Largo" opciones={LARGOS} valor={correo.largo} onCambio={onLargo} />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-azul-900/50">
            Asunto
            <input
              value={correo.asunto}
              onChange={(e) => onEditar("asunto", e.target.value)}
              className={`${campo} mt-1.5 font-semibold normal-case tracking-normal`}
            />
          </label>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-azul-900/50">
            Mensaje
            <textarea
              value={correo.cuerpo}
              onChange={(e) => onEditar("cuerpo", e.target.value)}
              rows={correo.largo === "corto" ? 6 : correo.largo === "largo" ? 14 : 10}
              className={`${campo} mt-1.5 font-normal normal-case leading-relaxed tracking-normal`}
            />
          </label>
        </div>

        <p className="rounded-2xl bg-azul-50 px-3 py-2 text-xs text-azul-900/70">
          Al abrir el correo, el mensaje se copia solo: pégalo en el cuerpo, copia el asunto y escribe el correo real
          de tu profesor. Así lo que escribiste no queda en el historial del navegador.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <a
            href={enlaceGmail(cc)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={abrir}
            className="col-span-2 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-azul-800 px-4 font-bold text-white transition hover:bg-azul-900"
          >
            <ExternalLink className="size-4" aria-hidden />
            Abrir en Gmail
          </a>
          <a
            href={enlaceMailto(cc)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={abrir}
            className="flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-azul-50 px-3 text-sm font-semibold text-azul-800 ring-1 ring-azul-100 hover:bg-azul-100"
          >
            <Mail className="size-4" aria-hidden />
            App de correo
          </a>
          <button
            type="button"
            onClick={onRegenerar}
            className="flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-azul-50 px-3 text-sm font-semibold text-azul-800 ring-1 ring-azul-100 hover:bg-azul-100"
          >
            <RefreshCw className="size-4" aria-hidden />
            Regenerar
          </button>
          {(["asunto", "mensaje"] as const).map((que) => (
            <button
              key={que}
              type="button"
              onClick={() => copiar(que)}
              className="flex min-h-10 items-center justify-center gap-2 rounded-2xl text-sm font-semibold text-azul-700 hover:bg-azul-50"
            >
              {copia === que ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
              {copia === que ? "¡Copiado!" : que === "asunto" ? "Copiar asunto" : "Copiar mensaje"}
            </button>
          ))}
        </div>
        {copia === "error" && (
          <div role="alert" className="rounded-2xl bg-red-50 p-3 text-sm text-red-800">
            <p className="font-semibold">Tu navegador no dejó copiar. Selecciona el texto y cópialo a mano:</p>
            <textarea
              readOnly
              value={`${correo.asunto}\n\n${correo.cuerpo}`}
              onFocus={(e) => e.currentTarget.select()}
              rows={8}
              className="mt-2 w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-azul-950"
            />
          </div>
        )}
      </div>
    </article>
  );
}
