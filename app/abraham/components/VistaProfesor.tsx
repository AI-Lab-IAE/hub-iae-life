"use client";

import { useState } from "react";
import { publicar, useAvisos } from "../almacen";
import { estudiantes, grados, nombreDe, resolverAudiencia, salones, type TipoAudiencia } from "../datos";
import { fechaHora } from "../formato";

const TIPOS: { valor: TipoAudiencia; etiqueta: string }[] = [
  { valor: "todos", etiqueta: "Escuela" },
  { valor: "grado", etiqueta: "Grado" },
  { valor: "salon", etiqueta: "Salón" },
  { valor: "individual", etiqueta: "Estudiantes" },
];

export function VistaProfesor() {
  const avisos = useAvisos();
  const [texto, setTexto] = useState("");
  const [urgente, setUrgente] = useState(false);
  const [tipo, setTipo] = useState<TipoAudiencia>("salon");
  const [grado, setGrado] = useState(grados[0]);
  const [salon, setSalon] = useState(salones[0]);
  const [elegidos, setElegidos] = useState<string[]>([]);
  const [abierto, setAbierto] = useState<string | null>(null);
  const [confirmacion, setConfirmacion] = useState("");

  const { destinatarios, descripcion } = resolverAudiencia(
    tipo,
    tipo === "grado" ? grado : salon,
    elegidos
  );
  const puedePublicar = texto.trim().length > 0 && destinatarios.length > 0;

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!puedePublicar) return;
    publicar({ texto: texto.trim(), urgente, audiencia: descripcion, destinatarios });
    setConfirmacion(`Aviso enviado a ${destinatarios.length} estudiante(s).`);
    setTexto("");
    setUrgente(false);
    setElegidos([]);
  }

  function alternar(id: string) {
    setElegidos((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));
  }

  return (
    <div className="flex flex-col gap-8">
      <form
        onSubmit={enviar}
        className="flex flex-col gap-4 rounded-3xl border border-azul-100 bg-white p-5 shadow-sm"
      >
        <h2 className="text-lg font-bold text-azul-950">Nuevo aviso</h2>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Mensaje</span>
          <textarea
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value);
              setConfirmacion("");
            }}
            rows={3}
            placeholder="Ej: Mañana la clase de Química es en el laboratorio 1."
            className="rounded-xl border border-azul-200 bg-white px-3 py-2"
          />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-sm font-medium">¿Para quién?</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TIPOS.map((t) => (
              <button
                key={t.valor}
                type="button"
                onClick={() => setTipo(t.valor)}
                aria-pressed={tipo === t.valor}
                className={`min-h-11 rounded-xl border px-3 text-sm font-medium ${
                  tipo === t.valor
                    ? "border-azul-800 bg-azul-800 text-white"
                    : "border-azul-200"
                }`}
              >
                {t.etiqueta}
              </button>
            ))}
          </div>

          {tipo === "grado" && (
            <select
              value={grado}
              onChange={(e) => setGrado(e.target.value)}
              aria-label="Grado"
              className="min-h-11 rounded-xl border border-azul-200 bg-white px-3"
            >
              {grados.map((g) => (
                <option key={g} value={g}>
                  Grado {g}
                </option>
              ))}
            </select>
          )}
          {tipo === "salon" && (
            <select
              value={salon}
              onChange={(e) => setSalon(e.target.value)}
              aria-label="Salón"
              className="min-h-11 rounded-xl border border-azul-200 bg-white px-3"
            >
              {salones.map((s) => (
                <option key={s} value={s}>
                  Salón {s}
                </option>
              ))}
            </select>
          )}
          {tipo === "individual" && (
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              {estudiantes.map((e) => (
                <label key={e.id} className="flex min-h-11 items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={elegidos.includes(e.id)}
                    onChange={() => alternar(e.id)}
                    className="size-4"
                  />
                  {e.nombre} <span className="text-azul-900/60">· {e.salon}</span>
                </label>
              ))}
            </div>
          )}
          <p className="text-sm text-azul-900/60">
            Le llega a {destinatarios.length} estudiante(s) · {descripcion}
          </p>
        </fieldset>

        <label className="flex min-h-11 items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={urgente} onChange={(e) => setUrgente(e.target.checked)} className="size-4" />
          Urgente
        </label>

        <button
          type="submit"
          disabled={!puedePublicar}
          className="min-h-11 rounded-2xl bg-azul-800 px-5 font-semibold text-white transition hover:bg-azul-900 disabled:opacity-50"
        >
          Publicar aviso
        </button>
        {confirmacion && (
          <p role="status" className="text-sm font-medium text-green-700">
            {confirmacion}
          </p>
        )}
      </form>

      <section>
        <h2 className="text-lg font-bold text-azul-950">Avisos enviados</h2>
        <ul className="mt-3 flex flex-col gap-3">
          {avisos.map((a) => {
            const vistos = a.destinatarios.filter((id) => a.vistos[id]);
            const faltan = a.destinatarios.filter((id) => !a.vistos[id]);
            const total = a.destinatarios.length;
            const abiertoAqui = abierto === a.id;
            return (
              <li
                key={a.id}
                className="rounded-3xl border border-azul-100 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2 text-sm text-azul-900/60">
                  <span>{fechaHora(a.creado)}</span>
                  <span>· {a.audiencia}</span>
                  {a.urgente && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                      Urgente
                    </span>
                  )}
                </div>
                <p className="mt-1">{a.texto}</p>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-azul-100">
                  <div
                    className="h-full rounded-full bg-green-600"
                    style={{ width: `${total ? (vistos.length / total) * 100 : 0}%` }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setAbierto(abiertoAqui ? null : a.id)}
                  aria-expanded={abiertoAqui}
                  className="mt-2 min-h-11 text-sm font-medium text-azul-900"
                >
                  Lo vieron {vistos.length} de {total} · {abiertoAqui ? "Ocultar" : "Ver quién falta"}
                </button>

                {abiertoAqui && (
                  <div className="mt-2 grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <h3 className="font-medium text-red-700">Faltan ({faltan.length})</h3>
                      <ul className="mt-1 text-azul-900/70">
                        {faltan.map((id) => (
                          <li key={id}>{nombreDe(id)}</li>
                        ))}
                        {!faltan.length && <li>Nadie: todos lo vieron.</li>}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium text-green-700">Lo vieron ({vistos.length})</h3>
                      <ul className="mt-1 text-azul-900/70">
                        {vistos.map((id) => (
                          <li key={id}>
                            {nombreDe(id)} <span className="text-azul-900/60">· {fechaHora(a.vistos[id])}</span>
                          </li>
                        ))}
                        {!vistos.length && <li>Todavía nadie.</li>}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
