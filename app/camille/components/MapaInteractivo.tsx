"use client";

import { useRef, useState, type MouseEvent, type PointerEvent } from "react";
import anim from "../animaciones.module.css";
import { pisos } from "../datos";
import { retraso, tarjeta, tocar } from "./estilos";
import { Icono } from "./Icono";
import { tiposLugar } from "./lugares";
import { PlanoColegio } from "./PlanoColegio";

const nombresPiso = ["Planta baja", "Piso 1", "Piso 2"];
const zooms = [1, 1.5, 2, 2.5];

// Quita acentos y mayúsculas para que "biblioteca" encuentre "Biblioteca".
function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Mapa del colegio visto desde arriba, con un pin por lugar.
// Se puede cambiar de piso, filtrar por tipo, buscar, hacer zoom y tocar un pin para ver su ficha.
// El modo "Ubicar" muestra la posición de un toque, para colocar los pines sobre una foto.
export function MapaInteractivo() {
  const [piso, setPiso] = useState(0);
  const [tipo, setTipo] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [elegido, setElegido] = useState<string | null>(null);
  const [nivelZoom, setNivelZoom] = useState(0);
  const [ubicar, setUbicar] = useState(false);
  const [punto, setPunto] = useState<{ x: number; y: number } | null>(null);
  const [copiado, setCopiado] = useState(false);

  const visor = useRef<HTMLDivElement>(null);
  const arrastre = useRef({ activo: false, movio: false, x: 0, y: 0, izq: 0, arriba: 0 });

  const lugares = pisos[piso].lugares.filter((l) => tipo === "todos" || l.tipo === tipo);
  const lugarElegido = pisos[piso].lugares.find((l) => l.nombre === elegido);
  const tiposDelPiso = [...new Set(pisos[piso].lugares.map((l) => l.tipo))];

  // Busca en todos los pisos: salta al piso del primer resultado y lo marca.
  const texto = normalizar(busqueda.trim());
  const resultados = texto
    ? pisos.flatMap((p, i) =>
        p.lugares.filter((l) => normalizar(`${l.nombre} ${l.codigo} ${l.tipo}`).includes(texto)).map((l) => ({ ...l, piso: i })),
      )
    : [];

  function buscar(valor: string) {
    setBusqueda(valor);
    const t = normalizar(valor.trim());
    if (!t) return;
    for (const [i, p] of pisos.entries()) {
      const lugar = p.lugares.find((l) => normalizar(`${l.nombre} ${l.codigo} ${l.tipo}`).includes(t));
      if (lugar) {
        setPiso(i);
        setTipo("todos");
        setElegido(lugar.nombre);
        return;
      }
    }
    setElegido(null);
  }

  function cambiarPiso(i: number) {
    setPiso(i);
    setTipo("todos");
    setElegido(null);
  }

  // Arrastrar con el mouse para moverse cuando hay zoom (en el celular se usa el dedo).
  function alPresionar(e: PointerEvent) {
    if (e.pointerType !== "mouse" || !visor.current) return;
    arrastre.current = { activo: true, movio: false, x: e.clientX, y: e.clientY, izq: visor.current.scrollLeft, arriba: visor.current.scrollTop };
  }
  function alMover(e: PointerEvent) {
    const a = arrastre.current;
    if (!a.activo || !visor.current) return;
    if (Math.abs(e.clientX - a.x) + Math.abs(e.clientY - a.y) > 4) a.movio = true;
    visor.current.scrollLeft = a.izq - (e.clientX - a.x);
    visor.current.scrollTop = a.arriba - (e.clientY - a.y);
  }
  function alSoltar() {
    arrastre.current.activo = false;
  }

  // En modo "Ubicar", un toque en el plano muestra su posición en % (lo que va en datos.ts).
  function alTocarPlano(e: MouseEvent<HTMLDivElement>) {
    if (!ubicar || arrastre.current.movio) return;
    const caja = e.currentTarget.getBoundingClientRect();
    setPunto({
      x: Math.round(((e.clientX - caja.left) / caja.width) * 1000) / 10,
      y: Math.round(((e.clientY - caja.top) / caja.height) * 1000) / 10,
    });
    setCopiado(false);
  }

  async function copiar() {
    if (!punto) return;
    try {
      await navigator.clipboard.writeText(`x: ${punto.x}, y: ${punto.y}`);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  }

  const zoom = zooms[nivelZoom];

  return (
    <div className="flex flex-col gap-4">
      {/* Buscador */}
      <div>
        <label className="relative block">
          <span className="sr-only">Buscar un lugar</span>
          <Icono nombre="buscar" className="absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => buscar(e.target.value)}
            placeholder="Busca un salón: 101, biblioteca, enfermería…"
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-4 pl-11 shadow-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-900 dark:focus:ring-indigo-950"
          />
        </label>
        {texto && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400" aria-live="polite">
            {resultados.length === 0
              ? `No encontramos «${busqueda}». Prueba con otro número o nombre.`
              : resultados.length === 1
                ? `Encontrado en ${pisos[resultados[0].piso].nombre.toLowerCase()}.`
                : `${resultados.length} resultados. Te mostramos el primero.`}
          </p>
        )}
      </div>

      {/* Pisos */}
      <div role="tablist" className="relative grid grid-cols-3 rounded-xl bg-indigo-100/70 p-1 dark:bg-indigo-950">
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-lg bg-white shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none dark:bg-slate-900"
          style={{ transform: `translateX(${piso * 100}%)` }}
        />
        {nombresPiso.map((nombre, i) => (
          <button
            key={nombre}
            role="tab"
            aria-selected={piso === i}
            onClick={() => cambiarPiso(i)}
            className={`relative py-2 text-sm font-semibold transition ${piso === i ? "text-indigo-700 dark:text-indigo-300" : "text-slate-500 hover:text-indigo-700 dark:text-slate-400"}`}
          >
            {nombre}
          </button>
        ))}
      </div>

      {/* Filtros por tipo */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {["todos", ...tiposDelPiso].map((t) => {
          const activo = tipo === t;
          return (
            <button
              key={t}
              aria-pressed={activo}
              onClick={() => setTipo(t)}
              className={`${tocar} flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${
                activo
                  ? "border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                  : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              {t !== "todos" && <span className={`size-2 rounded-full ${tiposLugar[t].pin}`} aria-hidden="true" />}
              {t === "todos" ? "Todos" : tiposLugar[t].plural}
            </button>
          );
        })}
      </div>

      {/* Plano con los pines */}
      <div className={`${tarjeta} relative overflow-hidden p-0`}>
        <div
          ref={visor}
          onPointerDown={alPresionar}
          onPointerMove={alMover}
          onPointerUp={alSoltar}
          onPointerLeave={alSoltar}
          className={`aspect-[10/7] overflow-auto ${zoom > 1 ? "cursor-grab active:cursor-grabbing" : ""} ${ubicar ? "cursor-crosshair" : ""}`}
        >
          <div
            onClick={alTocarPlano}
            className="relative aspect-[10/7] transition-[width] duration-500 ease-out motion-reduce:transition-none"
            style={{ width: `${zoom * 100}%` }}
          >
            <PlanoColegio />

            {/* key={piso}: los pines vuelven a caer al cambiar de piso. */}
            <div key={`${piso}-${tipo}`}>
              {lugares.map((l, i) => {
                const estilo = tiposLugar[l.tipo];
                const activo = elegido === l.nombre;
                return (
                  <button
                    key={l.nombre}
                    onClick={(e) => {
                      e.stopPropagation();
                      setElegido(activo ? null : l.nombre);
                    }}
                    aria-label={`${l.nombre} (${l.tipo})`}
                    aria-pressed={activo}
                    className={`absolute -translate-x-1/2 -translate-y-full ${activo ? "z-10" : ""} ${anim.caer}`}
                    style={{ left: `${l.x}%`, top: `${l.y}%`, ...retraso(i) }}
                  >
                    <span className={`flex flex-col items-center ${activo ? anim.brincar : ""}`}>
                      <span
                        className={`rounded-lg px-1.5 py-0.5 text-[10px] font-bold text-white shadow-md transition duration-300 sm:text-xs ${estilo.pin} ${
                          activo ? "scale-125 ring-2 ring-white" : "hover:scale-110"
                        }`}
                      >
                        {l.codigo}
                      </span>
                      <span className={`size-0 border-x-4 border-t-[6px] border-x-transparent ${estilo.punta}`} />
                    </span>
                  </button>
                );
              })}
            </div>

            {ubicar && punto && (
              <span
                className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-indigo-600 shadow-md"
                style={{ left: `${punto.x}%`, top: `${punto.y}%` }}
              />
            )}
          </div>
        </div>

        {/* Controles sobre el mapa */}
        <div className="absolute right-2 bottom-2 flex gap-1.5">
          {[
            { texto: "+", etiqueta: "Acercar", accion: () => setNivelZoom((z) => Math.min(z + 1, zooms.length - 1)), desactivado: nivelZoom === zooms.length - 1 },
            { texto: "−", etiqueta: "Alejar", accion: () => setNivelZoom((z) => Math.max(z - 1, 0)), desactivado: nivelZoom === 0 },
          ].map((b) => (
            <button
              key={b.etiqueta}
              onClick={b.accion}
              disabled={b.desactivado}
              aria-label={b.etiqueta}
              className={`${tocar} flex size-9 items-center justify-center rounded-xl bg-white/95 text-lg font-bold text-indigo-700 shadow-md hover:bg-white disabled:opacity-40 dark:bg-slate-900/95 dark:text-indigo-300`}
            >
              {b.texto}
            </button>
          ))}
        </div>
        <span className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-slate-500 shadow-sm dark:bg-slate-900/90">
          Plano inventado · {nombresPiso[piso]}
        </span>
      </div>

      {/* Ficha del lugar elegido */}
      {lugarElegido && (
        <div key={lugarElegido.nombre} className={`${tarjeta} ${anim.aparecer} flex items-center gap-3 p-4`}>
          <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${tiposLugar[lugarElegido.tipo].color}`}>
            <Icono nombre={tiposLugar[lugarElegido.tipo].icono} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">{lugarElegido.nombre}</span>
            <span className="block text-sm text-slate-500 dark:text-slate-400">
              {lugarElegido.tipo} · {pisos[piso].nombre} · Pin «{lugarElegido.codigo}»
            </span>
          </span>
          <button
            onClick={() => setElegido(null)}
            aria-label="Cerrar ficha"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>
      )}
      {!lugarElegido && !ubicar && (
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">Toca un pin para ver qué lugar es.</p>
      )}

      {/* Modo Ubicar: para poner los pines sobre una foto real más adelante */}
      <div className={`${tarjeta} p-4`}>
        <label className="flex cursor-pointer items-center justify-between gap-3">
          <span>
            <span className="block text-sm font-semibold">Modo «Ubicar»</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400">Toca el plano y te decimos la posición exacta de ese punto.</span>
          </span>
          <input
            type="checkbox"
            checked={ubicar}
            onChange={(e) => {
              setUbicar(e.target.checked);
              setPunto(null);
            }}
            className="peer sr-only"
          />
          <span className="relative h-6 w-11 shrink-0 rounded-full bg-slate-200 transition after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:bg-indigo-600 peer-checked:after:translate-x-5 dark:bg-slate-700" />
        </label>
        {ubicar && (
          <div className={`${anim.aparecer} mt-3 flex items-center justify-between gap-3 rounded-xl bg-indigo-50 px-3 py-2 text-sm dark:bg-indigo-500/10`}>
            <code className="font-mono text-indigo-700 dark:text-indigo-300">{punto ? `x: ${punto.x}, y: ${punto.y}` : "Toca un punto del plano…"}</code>
            {punto && (
              <button onClick={copiar} className={`${tocar} rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700`}>
                {copiado ? "¡Copiado!" : "Copiar"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
