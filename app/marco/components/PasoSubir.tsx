"use client";

import { useRef, useState } from "react";
import { formatoPeso, prepararArchivo, TOTAL_MAXIMO, type ArchivoListo } from "../lib/archivos";
import { APUNTES_EJEMPLO, MATERIA_EJEMPLO } from "../lib/ejemplo";
import { evaluarSesion, type Sesion } from "../lib/mapa";
import { botonPrimario, tarjeta } from "./estilos";
import { Aviso } from "./ui";

export type Material = { materia: string; texto: string; archivos: ArchivoListo[]; ejemplo: boolean };

export function PasoSubir({
  inicial,
  sesiones,
  error,
  onAnalizar,
  onAbrir,
  onBorrar,
}: {
  inicial: Material;
  sesiones: Sesion[];
  error: string | null;
  onAnalizar: (m: Material) => void;
  onAbrir: (s: Sesion) => void;
  onBorrar: (id: string) => void;
}) {
  const [materia, setMateria] = useState(inicial.materia);
  const [texto, setTexto] = useState(inicial.texto);
  const [archivos, setArchivos] = useState<ArchivoListo[]>(inicial.archivos);
  const [ejemplo, setEjemplo] = useState(inicial.ejemplo);
  const [problema, setProblema] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [arrastrando, setArrastrando] = useState(false);
  const entrada = useRef<HTMLInputElement>(null);

  const pesoTotal = archivos.reduce((s, a) => s + a.bytes, 0) + texto.length;
  const listo = (texto.trim().length >= 80 || archivos.length > 0) && pesoTotal <= TOTAL_MAXIMO;
  const textoCorto = archivos.length === 0 && texto.trim().length > 0 && texto.trim().length < 80;

  async function agregar(lista: FileList | null) {
    if (!lista?.length) return;
    setProblema(null);
    setProcesando(true);
    const nuevos: ArchivoListo[] = [];
    const errores: string[] = [];
    for (const archivo of Array.from(lista)) {
      if (archivos.length + nuevos.length >= 8) {
        errores.push("Máximo 8 archivos por diagnóstico.");
        break;
      }
      try {
        nuevos.push(await prepararArchivo(archivo));
      } catch (e) {
        errores.push(e instanceof Error ? e.message : `No pude leer "${archivo.name}".`);
      }
    }
    const todos = [...archivos, ...nuevos];
    const total = todos.reduce((s, a) => s + a.bytes, 0);
    if (total > TOTAL_MAXIMO) {
      errores.push(`Entre todos los archivos pesan ${formatoPeso(total)}. El máximo es ${formatoPeso(TOTAL_MAXIMO)}: quita alguno.`);
    }
    setArchivos(todos);
    setProblema(errores.length ? errores.join(" ") : null);
    setProcesando(false);
    if (entrada.current) entrada.current.value = "";
  }

  function usarEjemplo() {
    setMateria(MATERIA_EJEMPLO);
    setTexto(APUNTES_EJEMPLO);
    setArchivos([]);
    setEjemplo(true);
    setProblema(null);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
          ¿Qué vas a <span className="bg-[#ffe45c] px-1 italic">estudiar</span>?
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-[#4a5475]">
          Sube los apuntes del tema de tu examen. Mientras más completos, mejores preguntas.
        </p>
      </div>

      <div className={`${tarjeta} mt-10 p-5 sm:p-7`}>
        <label className="block">
          <span className="text-sm font-medium text-[#4a5475]">Materia (opcional)</span>
          <input
            value={materia}
            onChange={(e) => setMateria(e.target.value.slice(0, 80))}
            placeholder="Ej. Biología, Historia, Química…"
            className="mt-2 w-full rounded-xl border border-[#d6ccb6] bg-[#faf7f0] px-4 py-3 text-base outline-none placeholder:text-[#7c849e] focus:border-[#15203b]"
          />
        </label>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setArrastrando(true);
          }}
          onDragLeave={() => setArrastrando(false)}
          onDrop={(e) => {
            e.preventDefault();
            setArrastrando(false);
            agregar(e.dataTransfer.files);
          }}
          className={`mt-5 rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
            arrastrando ? "border-[#15203b] bg-[#fff2a8]" : "border-[#d6ccb6] bg-[#faf7f0]"
          }`}
        >
          <input
            ref={entrada}
            type="file"
            accept="image/*,application/pdf,.pdf"
            multiple
            className="sr-only"
            id="archivos"
            onChange={(e) => agregar(e.target.files)}
          />
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#fffdf8] shadow-sm" aria-hidden>
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 16V4m0 0-4.5 4.5M12 4l4.5 4.5" />
              <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
            </svg>
          </div>
          <p className="mt-3 font-medium">
            Arrastra fotos del cuaderno o PDFs, o{" "}
            <label htmlFor="archivos" className="cursor-pointer underline decoration-[#ffe45c] decoration-4 underline-offset-4">
              elígelos
            </label>
          </p>
          <p className="mt-1 text-sm text-[#7c849e]">
            Hasta 8 archivos · {formatoPeso(TOTAL_MAXIMO)} en total · En el celular puedes tomar la foto directo
          </p>
          {procesando && <p className="mt-3 text-sm text-[#4a5475]">Preparando archivos…</p>}
        </div>

        {archivos.length > 0 && (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {archivos.map((a, i) => (
              <li key={`${a.nombre}-${i}`} className="group relative overflow-hidden rounded-xl border border-[#e4dccb] bg-[#faf7f0]">
                {a.vista ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.vista} alt={a.nombre} className="aspect-[4/3] w-full object-cover" />
                ) : (
                  <div className="grid aspect-[4/3] place-items-center bg-[#fde6df] font-mono text-sm font-semibold text-[#e0492f]">PDF</div>
                )}
                <div className="px-2.5 py-2">
                  <p className="truncate text-xs font-medium">{a.nombre}</p>
                  <p className="text-[11px] text-[#7c849e]">{formatoPeso(a.bytes)}</p>
                </div>
                <button
                  onClick={() => setArchivos(archivos.filter((_, j) => j !== i))}
                  className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-[#15203b]/80 text-sm text-[#faf7f0] hover:bg-[#15203b]"
                  aria-label={`Quitar ${a.nombre}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-[#7c849e]">
          <span className="h-px flex-1 bg-[#e4dccb]" />o pega el texto<span className="h-px flex-1 bg-[#e4dccb]" />
        </div>

        <textarea
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value.slice(0, 60_000));
            setEjemplo(false);
          }}
          rows={7}
          placeholder="Pega aquí tus apuntes, el resumen del libro o la guía del profe…"
          className="w-full resize-y rounded-xl border border-[#d6ccb6] bg-[#faf7f0] px-4 py-3 font-mono text-sm leading-relaxed outline-none placeholder:font-sans placeholder:text-[#7c849e] focus:border-[#15203b]"
        />

        {textoCorto && (
          <div className="mt-4">
            <Aviso tipo="info">
              Te faltan {80 - texto.trim().length} caracteres para poder crear el diagnóstico: con tan poco texto no salen
              buenas preguntas. Pega más apuntes, o sube una foto o un PDF.
            </Aviso>
          </div>
        )}

        {(problema || error) && (
          <div className="mt-4">
            <Aviso>{problema ?? error}</Aviso>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button onClick={usarEjemplo} className="text-sm font-medium text-[#4a5475] underline underline-offset-4 hover:text-[#15203b]">
            Usar apuntes de ejemplo (Biología)
          </button>
          <button
            onClick={() => onAnalizar({ materia, texto, archivos, ejemplo })}
            disabled={!listo || procesando}
            className={`${botonPrimario} px-7 py-3.5`}
          >
            Crear mi diagnóstico →
          </button>
        </div>
      </div>

      <p className="mt-5 text-center text-sm text-[#7c849e]">
        Tus apuntes solo se usan para crear el quiz. No se guardan en ningún servidor.
      </p>

      {sesiones.length > 0 && (
        <section className="mt-14">
          <h2 className="font-serif text-2xl">Tus diagnósticos anteriores</h2>
          <ul className="mt-4 space-y-3">
            {sesiones.map((s) => {
              const r = evaluarSesion(s);
              const respondidas = Object.keys(s.respuestas).length;
              const total = s.analisis.temas.reduce((n, t) => n + t.preguntas.length, 0);
              return (
                <li key={s.id} className={`${tarjeta} flex items-center gap-4 p-4`}>
                  <button onClick={() => onAbrir(s)} className="min-w-0 flex-1 text-left">
                    <p className="text-xs uppercase tracking-wider text-[#7c849e]">
                      {s.analisis.materia} · {new Date(s.creada).toLocaleDateString("es-PA", { day: "numeric", month: "short" })}
                    </p>
                    <p className="truncate font-medium">{s.analisis.titulo}</p>
                    <p className="mt-0.5 text-sm text-[#4a5475]">
                      {respondidas < total
                        ? `En progreso · ${respondidas} de ${total} preguntas`
                        : `${r.nota}% aciertos · ${r.ciegos} ${r.ciegos === 1 ? "punto ciego" : "puntos ciegos"}`}
                    </p>
                  </button>
                  <button
                    onClick={() => onBorrar(s.id)}
                    className="rounded-full px-3 py-2 text-sm text-[#7c849e] hover:bg-[#f3eee2] hover:text-[#e0492f]"
                    aria-label={`Borrar diagnóstico de ${s.analisis.titulo}`}
                  >
                    Borrar
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
