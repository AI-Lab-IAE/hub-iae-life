"use client";

import { useState } from "react";
import { acierto, ESTADOS, evaluarRepaso, evaluarSesion, type Sesion } from "../lib/mapa";
import { botonPrimario, tarjeta } from "./estilos";
import { Aviso, Insignia, Letra } from "./ui";

const TEXTO_SEGURIDAD = { seguro: "Seguro", dudo: "Dudaba", adivino: "Adivinó" } as const;

export function PasoMapa({
  sesion,
  error,
  onRepaso,
  onVerRepaso,
  onNuevo,
}: {
  sesion: Sesion;
  error: string | null;
  onRepaso: () => void;
  onVerRepaso: () => void;
  onNuevo: () => void;
}) {
  const resultado = evaluarSesion(sesion);
  const ordenados = [...resultado.temas].sort((a, b) => ESTADOS[a.estado].orden - ESTADOS[b.estado].orden);
  const porRepasar = ordenados.filter((t) => t.estado !== "domina");
  const [abierto, setAbierto] = useState<string | null>(ordenados[0]?.temaId ?? null);
  const principal = ordenados[0];
  const temaPrincipal = sesion.analisis.temas.find((t) => t.id === principal?.temaId);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7c849e]">
            Tu mapa · {sesion.analisis.materia}
            {sesion.ejemplo && " · apuntes de ejemplo"}
          </p>
          <h1 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">{sesion.analisis.titulo}</h1>
        </div>
        <button onClick={onNuevo} className="self-start text-sm font-medium text-[#4a5475] underline underline-offset-4 hover:text-[#15203b] sm:self-auto">
          Nuevo diagnóstico
        </button>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3">
        <Dato valor={`${resultado.nota}%`} titulo="Aciertos" detalle="de todas las preguntas" />
        <Dato
          valor={`${resultado.calibracion}%`}
          titulo="Te conoces"
          detalle="tu seguridad coincidió con el resultado"
        />
        <Dato
          valor={String(resultado.ciegos)}
          titulo={resultado.ciegos === 1 ? "Punto ciego" : "Puntos ciegos"}
          detalle="temas que crees saber"
          alerta={resultado.ciegos > 0}
        />
      </div>

      {principal && temaPrincipal && principal.estado !== "domina" && (
        <div className="mt-6 flex items-start gap-4 rounded-[20px] bg-[#15203b] p-5 text-[#faf7f0] sm:items-center sm:p-6">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#ffe45c] font-serif text-lg text-[#15203b]">1</span>
          <div className="flex-1">
            <p className="text-sm text-[#faf7f0]/60">Si solo tienes tiempo para una cosa</p>
            <p className="mt-0.5 text-lg leading-snug">
              Repasa <strong>{temaPrincipal.nombre}</strong>. {ESTADOS[principal.estado].descripcion}
            </p>
          </div>
        </div>
      )}
      {principal?.estado === "domina" && (
        <div className="mt-6 rounded-[20px] bg-[#dcf2e7] p-6">
          <p className="font-serif text-2xl text-[#1f9466]">Dominas todos los temas.</p>
          <p className="mt-1 text-[#4a5475]">Acertaste con seguridad en todo. Descansa: tu cerebro también necesita dormir antes del examen.</p>
        </div>
      )}

      <h2 className="mt-12 font-serif text-2xl">Tema por tema</h2>
      <ul className="mt-4 space-y-3">
        {ordenados.map((r) => {
          const tema = sesion.analisis.temas.find((t) => t.id === r.temaId);
          if (!tema) return null;
          const e = ESTADOS[r.estado];
          const estaAbierto = abierto === r.temaId;
          const despues = evaluarRepaso(sesion, r.temaId);
          return (
            <li
              key={r.temaId}
              className={`${tarjeta} overflow-hidden`}
              style={r.estado === "ciego" ? { borderColor: e.color, boxShadow: `0 0 0 1px ${e.color}` } : undefined}
            >
              <button
                onClick={() => setAbierto(estaAbierto ? null : r.temaId)}
                aria-expanded={estaAbierto}
                className="flex w-full items-center gap-4 p-5 text-left"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Insignia estado={r.estado} />
                    {despues !== null && (
                      <span className="rounded-full bg-[#f3eee2] px-2.5 py-1 text-xs font-medium text-[#4a5475]">
                        Después del repaso: {despues}%
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-lg font-semibold">{tema.nombre}</p>
                  <p className="text-sm text-[#4a5475]">{e.corto}</p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-2xl">
                    {r.aciertos % 1 ? r.aciertos.toFixed(1) : r.aciertos}
                    <span className="text-base text-[#7c849e]">/{r.total}</span>
                  </p>
                  <div className="mt-1.5 h-1.5 w-20 overflow-hidden rounded-full bg-[#f3eee2]">
                    <div className="h-full rounded-full" style={{ width: `${r.total ? (r.aciertos / r.total) * 100 : 0}%`, background: e.color }} />
                  </div>
                </div>
                <span className={`text-[#7c849e] transition-transform ${estaAbierto ? "rotate-180" : ""}`} aria-hidden>
                  ▾
                </span>
              </button>

              {estaAbierto && (
                <div className="border-t border-[#e4dccb] bg-[#faf7f0]/60 px-5 py-5">
                  <p className="text-sm leading-relaxed text-[#4a5475]">{e.descripcion}</p>
                  <ol className="mt-4 space-y-3">
                    {tema.preguntas.map((p) => {
                      const resp = sesion.respuestas[p.id];
                      const a = acierto(p, resp);
                      const color = a === null ? "#7c849e" : a >= 1 ? "#1f9466" : a > 0 ? "#d98a0f" : "#e0492f";
                      return (
                        <li key={p.id} className="rounded-2xl border border-[#e4dccb] bg-[#fffdf8] p-4">
                          <div className="flex items-start gap-3">
                            <span className="mt-1 size-2.5 shrink-0 rounded-full" style={{ background: color }} />
                            <div className="min-w-0 flex-1">
                              <p className="font-medium leading-snug">{p.enunciado}</p>
                              {resp && (
                                <p className="mt-2 text-sm text-[#4a5475]">
                                  <span className="text-[#7c849e]">Tu respuesta ({TEXTO_SEGURIDAD[resp.seguridad].toLowerCase()}): </span>
                                  {p.tipo === "opcion" && resp.elegida !== undefined ? (
                                    <>
                                      <Letra i={resp.elegida} />. {p.opciones[resp.elegida]}
                                    </>
                                  ) : (
                                    resp.texto
                                  )}
                                </p>
                              )}
                              {p.tipo === "opcion" && a !== 1 && (
                                <p className="mt-1 text-sm text-[#1f9466]">
                                  Correcta: <Letra i={p.correcta} />. {p.opciones[p.correcta]}
                                </p>
                              )}
                              {p.tipo === "abierta" && resp?.feedback && (
                                <p className="mt-1 text-sm" style={{ color }}>
                                  {resp.feedback}
                                </p>
                              )}
                              {p.tipo === "abierta" && !resp?.veredicto && (
                                <p className="mt-1 text-sm text-[#7c849e]">Sin corregir: no cuenta en el resultado.</p>
                              )}
                              <p className="mt-2 text-xs text-[#7c849e]">
                                {p.tipo === "abierta" ? `Lo ideal: ${p.respuestaModelo}` : p.explicacion}
                                {p.fuente ? ` · En tus apuntes: ${p.fuente}` : ""}
                              </p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {porRepasar.length > 0 && (
        <div className="mt-10 rounded-[20px] bg-[#ffe45c] p-6 sm:p-8">
          {sesion.repaso ? (
            <>
              <h2 className="font-serif text-3xl tracking-tight">Tu repaso está listo</h2>
              <p className="mt-2 max-w-xl text-[#15203b]/80">Ya tienes explicaciones y preguntas nuevas para tus temas débiles.</p>
              <button onClick={onVerRepaso} className={`${botonPrimario} mt-6 px-7 py-3.5`}>
                Ir a mi repaso →
              </button>
            </>
          ) : (
            <>
              <h2 className="font-serif text-3xl tracking-tight">Repasa solo lo que te falta</h2>
              <p className="mt-2 max-w-xl text-[#15203b]/80">
                La IA prepara un repaso de {Math.min(4, porRepasar.length)} {porRepasar.length === 1 ? "tema" : "temas"} basado en{" "}
                <strong>tus errores</strong>: qué confundiste, un truco para recordarlo y preguntas nuevas para comprobarlo.
              </p>
              {error && (
                <div className="mt-4">
                  <Aviso>{error}</Aviso>
                </div>
              )}
              <button onClick={onRepaso} className={`${botonPrimario} mt-6 px-7 py-3.5`}>
                Crear mi repaso →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Dato({ valor, titulo, detalle, alerta }: { valor: string; titulo: string; detalle: string; alerta?: boolean }) {
  return (
    <div
      className="rounded-2xl border p-4 sm:p-5"
      style={alerta ? { borderColor: "#e0492f", background: "#fde6df" } : { borderColor: "#e4dccb", background: "#fffdf8" }}
    >
      <p className="font-serif text-3xl leading-none sm:text-4xl" style={alerta ? { color: "#e0492f" } : undefined}>
        {valor}
      </p>
      <p className="mt-2 text-sm font-semibold">{titulo}</p>
      <p className="mt-0.5 hidden text-xs text-[#7c849e] sm:block">{detalle}</p>
    </div>
  );
}
