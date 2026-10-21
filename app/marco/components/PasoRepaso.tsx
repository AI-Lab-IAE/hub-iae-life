"use client";

import { useState } from "react";
import type { PreguntaRepaso } from "../lib/esquemas";
import { evaluarRepaso, evaluarSesion, type Respuesta, type Seguridad, type Sesion } from "../lib/mapa";
import { botonPrimario, tarjeta } from "./estilos";
import { Insignia, Letra, SelectorSeguridad } from "./ui";

export function PasoRepaso({
  sesion,
  onResponder,
  onVolver,
}: {
  sesion: Sesion;
  onResponder: (id: string, r: Respuesta) => void;
  onVolver: () => void;
}) {
  const [actual, setActual] = useState(0);
  const repaso = sesion.repaso;
  if (!repaso || repaso.temas.length === 0) return null;

  const estados = evaluarSesion(sesion).temas;
  const temaRepaso = repaso.temas[Math.min(actual, repaso.temas.length - 1)];
  const tema = sesion.analisis.temas.find((t) => t.id === temaRepaso.temaId);
  const estado = estados.find((t) => t.temaId === temaRepaso.temaId)?.estado ?? "pendiente";
  const completados = repaso.temas.filter((t) => evaluarRepaso(sesion, t.temaId) !== null).length;
  const esUltimo = actual === repaso.temas.length - 1;
  const puntaje = evaluarRepaso(sesion, temaRepaso.temaId);

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={onVolver} className="text-sm font-medium text-[#4a5475] hover:text-[#15203b]">
        ← Volver a mi mapa
      </button>

      <div className="mt-4 flex flex-wrap gap-2" role="tablist">
        {repaso.temas.map((t, i) => {
          const nombre = sesion.analisis.temas.find((x) => x.id === t.temaId)?.nombre ?? t.temaId;
          const hecho = evaluarRepaso(sesion, t.temaId) !== null;
          return (
            <button
              key={t.temaId}
              role="tab"
              aria-selected={i === actual}
              onClick={() => setActual(i)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                i === actual
                  ? "border-[#15203b] bg-[#15203b] text-[#faf7f0]"
                  : "border-[#d6ccb6] bg-[#fffdf8] text-[#4a5475] hover:border-[#7c849e]"
              }`}
            >
              {hecho && "✓ "}
              {nombre}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-[#7c849e]">
        {completados} de {repaso.temas.length} temas comprobados
      </p>

      <article key={temaRepaso.temaId} className="mt-6 space-y-5">
        <div className={`${tarjeta} p-6 sm:p-8`}>
          <Insignia estado={estado} grande />
          <h1 className="mt-4 font-serif text-4xl tracking-tight">{tema?.nombre}</h1>
          <p className="mt-5 text-lg leading-relaxed text-[#4a5475]">{temaRepaso.explicacion}</p>

          <ul className="mt-6 space-y-2.5">
            {temaRepaso.claves.map((c, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#ffe45c] font-mono text-xs font-semibold">{i + 1}</span>
                <span className="leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[20px] border-2 p-6" style={{ borderColor: "#e0492f", background: "#fde6df" }}>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e0492f]">Lo que confundiste</p>
            <p className="mt-3 leading-relaxed">{temaRepaso.tuError}</p>
          </div>
          <div className="rounded-[20px] bg-[#15203b] p-6 text-[#faf7f0]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#ffe45c]">Truco para recordarlo</p>
            <p className="mt-3 font-serif text-xl leading-snug">{temaRepaso.truco}</p>
          </div>
        </div>

        <div className={`${tarjeta} p-6`}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3e5bd8]">Ejemplo</p>
          <p className="mt-3 leading-relaxed text-[#4a5475]">{temaRepaso.ejemplo}</p>
        </div>

        <div className="pt-4">
          <h2 className="font-serif text-2xl">Comprueba que ya lo tienes</h2>
          <p className="mt-1 text-[#4a5475]">Dos preguntas nuevas, pensadas para tu error.</p>
          <div className="mt-5 space-y-4">
            {temaRepaso.preguntas.map((p, i) => (
              <PreguntaCorta
                key={p.id}
                numero={i + 1}
                pregunta={p}
                respuesta={sesion.respuestasRepaso?.[p.id]}
                onResponder={(r) => onResponder(p.id, r)}
              />
            ))}
          </div>
        </div>

        {puntaje !== null && (
          <div
            className="rounded-[20px] p-6"
            style={{ background: puntaje === 100 ? "#dcf2e7" : puntaje >= 50 ? "#fcefd6" : "#fde6df" }}
          >
            <p className="font-serif text-2xl">
              {puntaje === 100 ? "¡Ya lo tienes!" : puntaje >= 50 ? "Vas mejor, pero no del todo." : "Todavía no."}
            </p>
            <p className="mt-1 text-[#4a5475]">
              {puntaje === 100
                ? "Acertaste las dos preguntas nuevas."
                : "Vuelve a leer lo que confundiste y el truco. Mañana haz otro diagnóstico de este tema."}
            </p>
            {!esUltimo ? (
              <button onClick={() => setActual(actual + 1)} className={`${botonPrimario} mt-5 px-6 py-3`}>
                Siguiente tema →
              </button>
            ) : (
              <button onClick={onVolver} className={`${botonPrimario} mt-5 px-6 py-3`}>
                Ver mi mapa actualizado →
              </button>
            )}
          </div>
        )}
      </article>
    </div>
  );
}

function PreguntaCorta({
  numero,
  pregunta,
  respuesta,
  onResponder,
}: {
  numero: number;
  pregunta: PreguntaRepaso;
  respuesta: Respuesta | undefined;
  onResponder: (r: Respuesta) => void;
}) {
  const [elegida, setElegida] = useState<number | undefined>(respuesta?.elegida);
  const [seguridad, setSeguridad] = useState<Seguridad | undefined>(respuesta?.seguridad);
  const confirmada = Boolean(respuesta);
  const acerto = respuesta?.elegida === pregunta.correcta;

  return (
    <div className={`${tarjeta} p-5 sm:p-6`}>
      <p className="font-mono text-xs text-[#7c849e]">Pregunta {numero}</p>
      <p className="mt-2 text-lg font-medium leading-snug">{pregunta.enunciado}</p>
      <ul className="mt-4 space-y-2">
        {pregunta.opciones.map((o, i) => {
          const marcada = elegida === i;
          let estilo = marcada ? "border-[#15203b] bg-[#f3eee2]" : "border-[#d6ccb6] bg-[#fffdf8] hover:border-[#7c849e]";
          if (confirmada) {
            if (i === pregunta.correcta) estilo = "border-[#1f9466] bg-[#dcf2e7]";
            else if (marcada) estilo = "border-[#e0492f] bg-[#fde6df]";
            else estilo = "border-[#e4dccb] bg-[#fffdf8] opacity-60";
          }
          return (
            <li key={i}>
              <button
                disabled={confirmada}
                onClick={() => setElegida(i)}
                aria-pressed={marcada}
                className={`flex w-full gap-3 rounded-xl border px-3.5 py-3 text-left text-[15px] transition-all disabled:cursor-default ${estilo}`}
              >
                <span className="font-semibold text-[#7c849e]">
                  <Letra i={i} />
                </span>
                {o}
              </button>
            </li>
          );
        })}
      </ul>
      {!confirmada ? (
        <div className="mt-5">
          <SelectorSeguridad valor={seguridad} onCambio={setSeguridad} />
          <button
            disabled={elegida === undefined || !seguridad}
            onClick={() => seguridad && onResponder({ elegida, seguridad })}
            className={`${botonPrimario} mt-4 w-full py-3`}
          >
            Confirmar
          </button>
        </div>
      ) : (
        <p className="mt-4 rounded-xl p-3.5 text-sm leading-relaxed" style={{ background: acerto ? "#dcf2e7" : "#fde6df" }}>
          <strong style={{ color: acerto ? "#1f9466" : "#e0492f" }}>{acerto ? "Correcto. " : "Incorrecto. "}</strong>
          {pregunta.explicacion}
        </p>
      )}
    </div>
  );
}
