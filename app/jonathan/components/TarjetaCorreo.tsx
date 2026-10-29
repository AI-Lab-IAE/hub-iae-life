"use client";

import { useState } from "react";
import type { Correo } from "../lib/correos";

function BotonCopiar({ texto, etiqueta }: { texto: string; etiqueta: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    await navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copiar}
      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
    >
      {copiado ? "¡Copiado!" : etiqueta}
    </button>
  );
}

export default function TarjetaCorreo({ correo }: { correo: Correo }) {
  return (
    <article className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
      <dl className="space-y-1 text-sm">
        <div className="flex gap-2">
          <dt className="w-16 shrink-0 text-zinc-500">Para:</dt>
          <dd className="min-w-0 break-words">
            {correo.profesor.nombre} &lt;{correo.profesor.correo}&gt;
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-16 shrink-0 text-zinc-500">Asunto:</dt>
          <dd className="min-w-0 font-medium">{correo.asunto}</dd>
        </div>
      </dl>

      <p className="mt-4 whitespace-pre-line rounded-lg bg-zinc-50 p-4 text-sm leading-relaxed dark:bg-zinc-900">
        {correo.cuerpo}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <BotonCopiar texto={correo.cuerpo} etiqueta="Copiar correo" />
        <BotonCopiar texto={correo.asunto} etiqueta="Copiar asunto" />
      </div>
    </article>
  );
}
