import Link from "next/link";
import { ArrowRight, Lightbulb, MessageCircle, Sparkles } from "lucide-react";
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
      <section className="relative isolate flex min-h-svh items-center overflow-hidden bg-linear-to-br from-azul-900 via-azul-800 to-azul-700 text-white">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <div className="life-entrar flex items-center gap-4">
              <span className="grid size-20 shrink-0 place-items-center rounded-2xl bg-white p-1.5 shadow-lg shadow-azul-950/30 md:size-24">
                <Emblema className="size-full" />
              </span>
              <div>
                <h1 className="text-5xl font-black tracking-tight md:text-6xl">IAE LIFE</h1>
                <p className="mt-1 text-sm text-azul-200">Instituto Alberto Einstein · AI Lab</p>
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
                  className="group flex min-h-36 flex-col justify-between rounded-2xl bg-white p-5 text-azul-950 shadow-lg shadow-azul-950/20 transition hover:-translate-y-1"
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
          {/* Datos del app (lo que antes estaba abajo del todo) */}
          <div
            className="life-entrar grid gap-3 sm:grid-cols-2 lg:col-start-1 lg:row-start-2"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-lime-300">Qué resuelve</p>
              <ul className="mt-2 space-y-1.5 text-sm text-azul-50">
                {MOMENTOS.map((m) => (
                  <li key={m.titulo} className="flex items-center gap-2">
                    <m.icono className="size-4 shrink-0 text-oro" aria-hidden />
                    {m.titulo}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-lime-300">Hacia la versión final</p>
              <ol className="mt-2 space-y-1.5 text-sm text-azul-50">
                {RUTA.map((p, i) => (
                  <li key={p.titulo} className="flex items-baseline gap-2">
                    <span className={`font-bold ${i === 1 ? "text-oro" : "text-azul-200"}`}>{p.titulo}</span>
                    <span className="text-xs text-azul-200">{p.cuando}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
