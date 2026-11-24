import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowDown, ArrowRight, Lightbulb, MessageCircle, Sparkles } from "lucide-react";
import "./_hub/hub.css";
import { funciones } from "./_life/funciones";
import { Emblema } from "./_life/Marca";

const MOMENTOS = [
  {
    icono: Lightbulb,
    titulo: "Encontrar todo del colegio",
    texto: "Mapa, contactos, documentos, calendario, anuncios y horario del colegio en un solo lugar.",
  },
  {
    icono: Sparkles,
    titulo: "Estudiar y organizarse",
    texto: "La IA encuentra lo que no sabes antes del examen y reparte tus tareas en tu horario real.",
  },
  {
    icono: MessageCircle,
    titulo: "Comunicarse con profes y avisos",
    texto: "Avisos que sí llegan a cada estudiante y correos a profesores redactados con IA.",
  },
];

// Íconos en círculos de colores, como en "Descubre la Comunidad IAE" de iae.edu.
const CIRCULOS = [
  "bg-azul-100 text-azul-800",
  "bg-red-50 text-red-700",
  "bg-lime-100 text-lime-800",
  "bg-orange-50 text-orange-700",
  "bg-sky-100 text-sky-800",
];

const RUTA = [
  {
    cuando: "13 nov 2026",
    titulo: "MVP",
    texto: "Las funciones publicadas, con datos de ejemplo y probadas en celular.",
  },
  { cuando: "16–27 nov", titulo: "Piloto", texto: "Un grupo de estudiantes y profesores la usa y da su opinión." },
  { cuando: "Diciembre", titulo: "Ajustes", texto: "Cambios según el piloto y decisión de qué funciones siguen." },
  { cuando: "2027", titulo: "Versión final", texto: "Cuenta @iae.edu, base de datos y datos reales del colegio." },
];

export default function Inicio() {
  return (
    <main className="flex-1">
      {/* Portada: escudo del IAE, nombre y las funciones a un toque */}
      <section className="relative isolate flex min-h-svh items-center overflow-hidden bg-linear-to-br from-azul-950 via-azul-900 to-azul-700 text-white">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <div className="life-entrar flex items-center gap-4">
              <span className="grid size-20 shrink-0 place-items-center rounded-full bg-white p-1 shadow-lg shadow-azul-950/30 md:size-24">
                <Emblema className="size-full" />
              </span>
              <div>
                <h1
                  aria-label="IAE LIFE"
                  className="text-5xl font-black tracking-tight [perspective:800px] md:text-7xl"
                >
                  {"IAE LIFE".split("").map((letra, i) => (
                    <span
                      key={i}
                      aria-hidden
                      className="life-letra life-brillo bg-linear-to-r from-white via-azul-200 to-white bg-clip-text text-transparent"
                      style={{ animationDelay: `${0.15 + i * 0.07}s, 0s` } as CSSProperties}
                    >
                      {letra === " " ? "\u00a0" : letra}
                    </span>
                  ))}
                </h1>
                <p className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] text-azul-100 backdrop-blur">
                  <span className="size-2 rounded-full bg-oro" aria-hidden />
                  Instituto Alberto Einstein · AI Lab
                </p>
              </div>
            </div>
            <p
              className="life-entrar mt-4 max-w-xl text-lg leading-relaxed text-azul-100"
              style={{ animationDelay: "0.2s" }}
            >
              Tu horario, tus avisos, tus tareas y tu estudio en una sola app. Hecha por estudiantes del AI Lab.
            </p>

            <div className="life-entrar mt-8 flex flex-wrap gap-3" style={{ animationDelay: "0.3s" }}>
              <Link
                href="/hoy"
                className="inline-flex items-center gap-3 rounded-full bg-oro py-2 pl-6 pr-2 font-bold text-azul-950 shadow-lg shadow-azul-950/30 transition-transform hover:-translate-y-0.5"
              >
                Empezar mi día
                <span className="grid size-9 place-items-center rounded-full bg-azul-950 text-white">
                  <ArrowRight className="size-4" aria-hidden />
                </span>
              </Link>
            </div>
          </div>

          <nav
            aria-label="Abrir una función"
            className="life-entrar grid grid-cols-2 gap-3 lg:col-start-2 lg:row-span-2 lg:row-start-1"
            style={{ animationDelay: "0.35s" }}
          >
            {funciones
              .filter((f) => f.estado === "lista")
              .map((f, i) => (
                <Link
                  key={f.slug}
                  href={f.href}
                  className="group flex min-h-28 flex-col justify-between gap-2 rounded-2xl bg-white p-4 md:min-h-36 md:p-5 text-azul-950 shadow-lg shadow-azul-950/20 transition hover:-translate-y-1"
                >
                  <span
                    className={`grid size-12 place-items-center rounded-full ${CIRCULOS[i % CIRCULOS.length]} transition-transform group-hover:scale-110`}
                  >
                    <f.icono className="size-6" aria-hidden />
                  </span>
                  <span>
                    <span className="block font-bold text-azul-800">{f.proyecto}</span>
                    <span className="mt-0.5 block text-sm leading-snug text-azul-950/75">{f.resumen}</span>
                  </span>
                </Link>
              ))}
          </nav>
          <div className="life-entrar lg:col-start-1 lg:row-start-2" style={{ animationDelay: "0.4s" }}>
            <p className="text-xs text-azul-200">
              Vista previa: los datos son de ejemplo y lo que guardes se queda en este navegador.
            </p>
            <a
              href="#mas"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white"
            >
              Qué resuelve y hacia dónde va <ArrowDown className="size-4 animate-bounce" aria-hidden />
            </a>
          </div>
        </div>
      </section>
      {/* Qué resuelve (se ve al bajar) */}
      <section id="mas" className="scroll-mt-4">
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-700">El día a día</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-azul-950 md:text-5xl">Qué resuelve</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {MOMENTOS.map((m) => (
              <div key={m.titulo} className="rounded-3xl border border-azul-100 bg-white p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-azul-100 text-azul-800">
                  <m.icono className="size-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-xl font-bold text-azul-950">{m.titulo}</h3>
                <p className="mt-2 leading-relaxed text-azul-900/65">{m.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hoja de ruta */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-700">Hoja de ruta</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-azul-950 md:text-5xl">Hacia la versión final</h2>
          <ol className="relative mt-12 grid gap-8 md:grid-cols-4 md:gap-6">
            <span
              className="absolute left-0 right-0 top-6 hidden h-0.5 bg-linear-to-r from-azul-200 via-azul-500 to-azul-200 md:block"
              aria-hidden
            />
            {RUTA.map((p, i) => (
              <li key={p.titulo} className="relative">
                <span
                  className={`grid size-12 place-items-center rounded-2xl font-mono text-lg font-bold ${
                    i === 0 ? "bg-azul-800 text-white" : "border-2 border-azul-200 bg-white text-azul-700"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.15em] text-azul-500">{p.cuando}</p>
                <h3 className="mt-1 text-xl font-bold text-azul-950">{p.titulo}</h3>
                <p className="mt-2 leading-relaxed text-azul-900/65">{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="bg-azul-950 text-azul-200">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm">
          <p>IAE LIFE · AI Lab · Instituto Alberto Einstein · 2026</p>
          <nav className="flex gap-5">
            <Link href="/creditos" className="hover:text-white">
              Créditos
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
