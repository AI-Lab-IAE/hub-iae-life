"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { borrarSesion, guardarSesion, leerSesiones } from "../lib/almacen";
import { llamarAPI } from "../lib/api";
import { APUNTES_EJEMPLO, MATERIA_EJEMPLO } from "../lib/ejemplo";
import type { Analisis, Calificacion, PedidoRepaso, Repaso } from "../lib/esquemas";
import { evaluarSesion, type Sesion } from "../lib/mapa";
import { botonSecundario } from "./estilos";
import { PasoMapa } from "./PasoMapa";
import { PasoQuiz } from "./PasoQuiz";
import { PasoRepaso } from "./PasoRepaso";
import { PasoSubir, type Material } from "./PasoSubir";
import { Aviso, Cargando } from "./ui";

type Vista = "subir" | "analizando" | "quiz" | "calificando" | "mapa" | "repasando" | "repaso";

const PASOS_ANALISIS = [
  "Leyendo tus apuntes",
  "Separando los temas",
  "Pensando en los errores típicos",
  "Escribiendo las preguntas",
  "Revisando que todo salga de tus apuntes",
];
const PASOS_CALIFICAR = ["Leyendo tus respuestas", "Comparando con tus apuntes", "Escribiendo qué te faltó"];
const PASOS_REPASO = [
  "Revisando tus errores",
  "Buscando qué confundiste",
  "Inventando un truco para recordarlo",
  "Creando preguntas nuevas",
];

const MATERIAL_VACIO: Material = { materia: "", texto: "", archivos: [], ejemplo: false };

function EncabezadoEstudiar({ onNuevo, mostrarNuevo }: { onNuevo: () => void; mostrarNuevo: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#e4dccb] py-4">
      <Link href="/marco" className="font-serif text-lg font-semibold tracking-tight text-[#15203b]">
        Estud<span className="bg-[#ffe45c] px-0.5">IA</span>
      </Link>
      <div className="flex items-center gap-1 text-sm">
        {mostrarNuevo && (
          <button onClick={onNuevo} className="rounded-full px-3 py-2 text-[#4a5475] hover:text-[#15203b]">
            Nuevo diagnóstico
          </button>
        )}
        <Link href="/" className="hidden rounded-full px-3 py-2 text-[#4a5475] hover:text-[#15203b] sm:inline">
          ← HUB IAE LIFE
        </Link>
      </div>
    </div>
  );
}

export function Estudiar() {
  const parametros = useSearchParams();
  const router = useRouter();
  const esEjemploDirecto = parametros.get("ejemplo") === "1";
  const [vista, setVista] = useState<Vista>(esEjemploDirecto ? "analizando" : "subir");
  const [sesion, setSesion] = useState<Sesion | null>(null);
  // useSearchParams deja este componente fuera del prerender, así que localStorage ya existe aquí.
  const [sesiones, setSesiones] = useState<Sesion[]>(() => (typeof window === "undefined" ? [] : leerSesiones()));
  const [material, setMaterial] = useState<Material>(() =>
    esEjemploDirecto
      ? { materia: MATERIA_EJEMPLO, texto: APUNTES_EJEMPLO, archivos: [], ejemplo: true }
      : MATERIAL_VACIO,
  );
  const [error, setError] = useState<string | null>(null);
  const cancelar = useRef<AbortController | null>(null);
  const autoDisparado = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [vista]);

  function actualizar(nueva: Sesion) {
    setSesion(nueva);
    guardarSesion(nueva);
    setSesiones(leerSesiones());
  }

  async function analizar(m: Material) {
    setMaterial(m);
    setError(null);
    setVista("analizando");
    const control = new AbortController();
    cancelar.current = control;
    try {
      const analisis = await llamarAPI<Analisis>(
        "/marco/api/analizar",
        { materia: m.materia, texto: m.texto, archivos: m.archivos.map(({ nombre, tipo, datos }) => ({ nombre, tipo, datos })) },
        control.signal,
      );
      if (!analisis.suficiente || analisis.temas.length === 0) {
        setError(analisis.aviso || "No encontré suficiente contenido para hacer un buen diagnóstico. Sube más apuntes.");
        setVista("subir");
        return;
      }
      actualizar({ id: crypto.randomUUID(), creada: Date.now(), analisis, respuestas: {}, ejemplo: m.ejemplo });
      setVista("quiz");
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        setVista("subir");
        return;
      }
      setError(e instanceof Error ? e.message : "No pude crear el diagnóstico.");
      setVista("subir");
    }
  }

  async function calificar(actual: Sesion) {
    const abiertas = actual.analisis.temas.flatMap((tema) =>
      tema.preguntas
        .filter((p) => p.tipo === "abierta" && actual.respuestas[p.id] && !actual.respuestas[p.id].veredicto)
        .map((p) => ({ tema, p })),
    );
    if (abiertas.length === 0) {
      setVista("mapa");
      return;
    }
    setError(null);
    setVista("calificando");
    try {
      const { resultados } = await llamarAPI<Calificacion>("/marco/api/calificar", {
        materia: actual.analisis.materia,
        respuestas: abiertas.map(({ tema, p }) => ({
          id: p.id,
          tema: tema.nombre,
          contenidoTema: tema.contenido,
          enunciado: p.enunciado,
          respuestaModelo: p.respuestaModelo,
          respuestaAlumno: actual.respuestas[p.id]?.texto ?? "",
        })),
      });
      const respuestas = { ...actual.respuestas };
      for (const r of resultados) {
        if (respuestas[r.id]) respuestas[r.id] = { ...respuestas[r.id], veredicto: r.veredicto, feedback: r.feedback };
      }
      actualizar({ ...actual, respuestas });
      setVista("mapa");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pude corregir tus respuestas abiertas.");
      setVista("calificando");
    }
  }

  async function crearRepaso(actual: Sesion) {
    const resultado = evaluarSesion(actual);
    const debiles = [...resultado.temas]
      .filter((t) => t.estado !== "domina")
      .sort((a, b) => ["ciego", "pendiente", "fragil"].indexOf(a.estado) - ["ciego", "pendiente", "fragil"].indexOf(b.estado))
      .slice(0, 4);

    const pedido: PedidoRepaso = {
      materia: actual.analisis.materia,
      temas: debiles.flatMap((r) => {
        const tema = actual.analisis.temas.find((t) => t.id === r.temaId);
        if (!tema) return [];
        return [
          {
            temaId: tema.id,
            nombre: tema.nombre,
            contenido: tema.contenido,
            estado: r.estado,
            fallos: tema.preguntas.flatMap((p) => {
              const resp = actual.respuestas[p.id];
              if (!resp) return [];
              const fallo = p.tipo === "opcion" ? resp.elegida !== p.correcta : resp.veredicto !== "correcta";
              const dudo = resp.seguridad !== "seguro";
              if (!fallo && !(r.estado === "fragil" && dudo)) return [];
              return [
                {
                  enunciado: p.enunciado,
                  respuestaAlumno: p.tipo === "opcion" ? (p.opciones[resp.elegida ?? -1] ?? "") : (resp.texto ?? ""),
                  respuestaCorrecta: p.tipo === "opcion" ? p.opciones[p.correcta] : p.respuestaModelo,
                  seguridad: resp.seguridad,
                },
              ];
            }),
          },
        ];
      }),
    };

    setError(null);
    setVista("repasando");
    try {
      const repaso = await llamarAPI<Repaso>("/marco/api/repaso", pedido);
      actualizar({ ...actual, repaso, respuestasRepaso: {} });
      setVista("repaso");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pude crear tu repaso.");
      setVista("mapa");
    }
  }

  useEffect(() => {
    if (!esEjemploDirecto || autoDisparado.current) return;
    autoDisparado.current = true;
    router.replace("/marco/estudiar");
    analizar({ materia: MATERIA_EJEMPLO, texto: APUNTES_EJEMPLO, archivos: [], ejemplo: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function nuevo() {
    setSesion(null);
    setMaterial(MATERIAL_VACIO);
    setError(null);
    setVista("subir");
    router.replace("/marco/estudiar");
  }

  function abrir(s: Sesion) {
    setSesion(s);
    setError(null);
    const total = s.analisis.temas.reduce((n, t) => n + t.preguntas.length, 0);
    setVista(Object.keys(s.respuestas).length < total ? "quiz" : "mapa");
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <EncabezadoEstudiar onNuevo={nuevo} mostrarNuevo={vista !== "subir"} />

      <main className="flex-1 pb-24 pt-10 sm:pt-14">
        {vista === "subir" && (
          <PasoSubir
            key={`${material.ejemplo}-${material.texto.length}`}
            inicial={material}
            sesiones={sesiones}
            error={error}
            onAnalizar={analizar}
            onAbrir={abrir}
            onBorrar={(id) => {
              borrarSesion(id);
              setSesiones(leerSesiones());
            }}
          />
        )}

        {vista === "analizando" && (
          <Cargando titulo="Preparando tu diagnóstico" pasos={PASOS_ANALISIS} onCancelar={() => cancelar.current?.abort()} />
        )}

        {vista === "quiz" && sesion && (
          <PasoQuiz
            sesion={sesion}
            onResponder={(id, r) => actualizar({ ...sesion, respuestas: { ...sesion.respuestas, [id]: r } })}
            onTerminar={() => calificar(sesion)}
          />
        )}

        {vista === "calificando" && sesion && (
          error ? (
            <div className="mx-auto max-w-lg space-y-4 py-16 text-center">
              <Aviso>{error}</Aviso>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <button onClick={() => calificar(sesion)} className="rounded-full bg-[#15203b] px-6 py-3 font-semibold text-[#faf7f0]">
                  Reintentar
                </button>
                <button
                  onClick={() => {
                    setError(null);
                    setVista("mapa");
                  }}
                  className={`${botonSecundario} px-6 py-3`}
                >
                  Ver mapa sin las abiertas
                </button>
              </div>
            </div>
          ) : (
            <Cargando titulo="Corrigiendo tus respuestas" pasos={PASOS_CALIFICAR} />
          )
        )}

        {vista === "mapa" && sesion && (
          <PasoMapa
            sesion={sesion}
            error={error}
            onRepaso={() => crearRepaso(sesion)}
            onVerRepaso={() => setVista("repaso")}
            onNuevo={nuevo}
          />
        )}

        {vista === "repasando" && <Cargando titulo="Armando tu repaso" pasos={PASOS_REPASO} />}

        {vista === "repaso" && sesion && (
          <PasoRepaso
            sesion={sesion}
            onResponder={(id, r) =>
              actualizar({ ...sesion, respuestasRepaso: { ...(sesion.respuestasRepaso ?? {}), [id]: r } })
            }
            onVolver={() => setVista("mapa")}
          />
        )}
      </main>
    </div>
  );
}
