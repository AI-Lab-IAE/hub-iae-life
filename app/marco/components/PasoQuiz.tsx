"use client";

import { useMemo, useState } from "react";
import type { Pregunta, Tema } from "../lib/esquemas";
import type { Respuesta, Seguridad, Sesion } from "../lib/mapa";
import { botonPrimario, tarjeta } from "./estilos";
import { Letra, SelectorSeguridad } from "./ui";

type Item = { tema: Tema; pregunta: Pregunta; numeroTema: number };

export function PasoQuiz({
  sesion,
  onResponder,
  onTerminar,
}: {
  sesion: Sesion;
  onResponder: (id: string, r: Respuesta) => void;
  onTerminar: () => void;
}) {
  const items = useMemo<Item[]>(
    () => sesion.analisis.temas.flatMap((tema, t) => tema.preguntas.map((pregunta) => ({ tema, pregunta, numeroTema: t + 1 }))),
    [sesion.analisis.temas],
  );
  const [indice, setIndice] = useState(() => {
    const primera = items.findIndex((it) => !sesion.respuestas[it.pregunta.id]);
    return primera === -1 ? items.length - 1 : primera;
  });

  const item = items[indice];
  const esUltima = indice === items.length - 1;
  const respondidas = items.filter((it) => sesion.respuestas[it.pregunta.id]).length;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-[#4a5475]">
            Tema {item.numeroTema} de {sesion.analisis.temas.length} · <span className="text-[#15203b]">{item.tema.nombre}</span>
          </span>
          <span className="font-mono text-xs text-[#7c849e]">
            {indice + 1}/{items.length}
          </span>
        </div>
        <div className="mt-3 flex gap-1" aria-hidden>
          {items.map((it, i) => (
            <span
              key={it.pregunta.id}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i === indice ? "bg-[#15203b]" : sesion.respuestas[it.pregunta.id] ? "bg-[#7c849e]" : "bg-[#e4dccb]"
              }`}
            />
          ))}
        </div>
      </div>

      <TarjetaPregunta
        key={item.pregunta.id}
        item={item}
        respuesta={sesion.respuestas[item.pregunta.id]}
        onResponder={(r) => onResponder(item.pregunta.id, r)}
        onSiguiente={() => (esUltima ? onTerminar() : setIndice(indice + 1))}
        esUltima={esUltima}
      />

      <div className="mt-5 flex items-center justify-between text-sm">
        <button
          onClick={() => setIndice(Math.max(0, indice - 1))}
          disabled={indice === 0}
          className="rounded-full px-3 py-2 text-[#4a5475] hover:text-[#15203b] disabled:opacity-30"
        >
          ← Anterior
        </button>
        <span className="text-[#7c849e]">
          {respondidas} de {items.length} respondidas
        </span>
      </div>
    </div>
  );
}

function TarjetaPregunta({
  item,
  respuesta,
  onResponder,
  onSiguiente,
  esUltima,
}: {
  item: Item;
  respuesta: Respuesta | undefined;
  onResponder: (r: Respuesta) => void;
  onSiguiente: () => void;
  esUltima: boolean;
}) {
  const { pregunta } = item;
  const [elegida, setElegida] = useState<number | undefined>(respuesta?.elegida);
  const [texto, setTexto] = useState(respuesta?.texto ?? "");
  const [seguridad, setSeguridad] = useState<Seguridad | undefined>(respuesta?.seguridad);
  const confirmada = Boolean(respuesta);
  const abierta = pregunta.tipo === "abierta";
  const puedeConfirmar = Boolean(seguridad) && (abierta ? texto.trim().length > 0 : elegida !== undefined);
  const acerto = !abierta && respuesta?.elegida === pregunta.correcta;

  function confirmar() {
    if (!seguridad) return;
    onResponder(abierta ? { texto: texto.trim(), seguridad } : { elegida, seguridad });
  }

  return (
    <article className={`${tarjeta} p-6 sm:p-8`}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7c849e]">
        {abierta ? "Explícalo con tus palabras" : "Opción múltiple"}
      </p>
      <h2 className="mt-3 font-serif text-2xl leading-snug tracking-tight text-pretty sm:text-[28px]">{pregunta.enunciado}</h2>

      {abierta ? (
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value.slice(0, 2000))}
          disabled={confirmada}
          rows={4}
          placeholder="Escribe tu respuesta como se la explicarías a un compañero…"
          className="mt-6 w-full resize-y rounded-xl border border-[#d6ccb6] bg-[#faf7f0] px-4 py-3 leading-relaxed outline-none placeholder:text-[#7c849e] focus:border-[#15203b] disabled:opacity-80"
        />
      ) : (
        <ul className="mt-6 space-y-2.5">
          {pregunta.opciones.map((opcion, i) => {
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
                  onClick={() => setElegida(i)}
                  disabled={confirmada}
                  aria-pressed={marcada}
                  className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all disabled:cursor-default ${estilo}`}
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full text-sm font-semibold ${
                      marcada && !confirmada ? "bg-[#15203b] text-[#faf7f0]" : "bg-[#f3eee2] text-[#4a5475]"
                    }`}
                  >
                    <Letra i={i} />
                  </span>
                  <span className="pt-0.5 leading-snug">{opcion}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {!confirmada && (
        <div className="mt-6">
          <SelectorSeguridad valor={seguridad} onCambio={setSeguridad} />
          <button onClick={confirmar} disabled={!puedeConfirmar} className={`${botonPrimario} mt-6 w-full py-3.5`}>
            {abierta ? "Guardar respuesta" : "Confirmar"}
          </button>
          {!seguridad && (abierta ? texto.trim() : elegida !== undefined) && (
            <p className="mt-2 text-center text-xs text-[#7c849e]">Marca qué tan seguro estás para continuar.</p>
          )}
        </div>
      )}

      {confirmada && (
        <div className="mt-6 space-y-4">
          {abierta ? (
            <div className="rounded-2xl bg-[#f3eee2] p-4 text-sm leading-relaxed text-[#4a5475]">
              <strong className="text-[#15203b]">Respuesta guardada.</strong> La IA la corrige al terminar el diagnóstico y te
              dice qué te faltó.
            </div>
          ) : (
            <div className="rounded-2xl p-4" style={{ background: acerto ? "#dcf2e7" : "#fde6df" }}>
              <p className="font-semibold" style={{ color: acerto ? "#1f9466" : "#e0492f" }}>
                {acerto
                  ? respuesta?.seguridad === "seguro"
                    ? "¡Correcto!"
                    : "Correcto, pero dudabas"
                  : respuesta?.seguridad === "seguro"
                    ? "Incorrecto, y estabas seguro: posible punto ciego"
                    : "Incorrecto"}
              </p>
              <p className="mt-1.5 leading-relaxed text-[#4a5475]">{pregunta.explicacion}</p>
              {pregunta.fuente && <p className="mt-2 text-xs text-[#7c849e]">En tus apuntes: {pregunta.fuente}</p>}
            </div>
          )}
          <button onClick={onSiguiente} className={`${botonPrimario} w-full py-3.5`}>
            {esUltima ? "Ver mi mapa →" : "Siguiente →"}
          </button>
        </div>
      )}
    </article>
  );
}
