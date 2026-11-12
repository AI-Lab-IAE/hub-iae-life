import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, Lightbulb, MessageCircle, ShieldCheck, Smartphone, Sparkles } from "lucide-react";
import "./_hub/hub.css";
import Escena3D from "./_hub/Escena3D";
import { funciones } from "./_life/funciones";

const TITULO = "IAE LIFE";
const AZULES = ["#9fbaf3", "#c9d8f9", "#6b93ea", "#e3ebfc", "#416fdc"];

const MOMENTOS = [
  {
    icono: Lightbulb,
    titulo: "Encontrar",
    texto: "Mapa, contactos, documentos, calendario, anuncios y horario del colegio en un solo lugar.",
    slugs: ["camille"],
  },
  {
    icono: Sparkles,
    titulo: "Estudiar y organizarse",
    texto: "La IA encuentra lo que no sabes antes del examen y reparte tus tareas en tu horario real.",
    slugs: ["marco", "daniela"],
  },
  {
    icono: MessageCircle,
    titulo: "Comunicarse",
    texto: "Avisos que sí llegan a cada estudiante y correos a profesores redactados con IA.",
    slugs: ["abraham", "jonathan"],
  },
];

const RUTA = [
  { cuando: "13 nov 2026", titulo: "MVP", texto: "Las funciones publicadas, con datos de ejemplo y probadas en celular." },
  { cuando: "16–27 nov", titulo: "Piloto", texto: "Un grupo de estudiantes y profesores la usa y da su opinión." },
  { cuando: "Diciembre", titulo: "Ajustes", texto: "Cambios según el piloto y decisión de qué funciones siguen." },
  { cuando: "2027", titulo: "Versión final", texto: "Cuenta @iae.edu, base de datos y datos reales del colegio." },
];

const PILARES = [
  { icono: Smartphone, texto: "Funciona en celular y computadora" },
  { icono: ShieldCheck, texto: "Datos de ejemplo; nada personal" },
  { icono: Sparkles, texto: "Inteligencia artificial donde ayuda" },
];

export default function Inicio() {
  const nombre = (slug: string) => funciones.find((f) => f.slug === slug)!.proyecto;
  const listas = funciones.filter((f) => f.estado === "lista").length;

  return (
    <main className="flex-1">
      {/* Portada azul IAE */}
      <section className="relative isolate overflow-hidden bg-linear-to-br from-azul-950 via-azul-900 to-azul-700 text-white">
        <Escena3D colores={AZULES} />
        <div
          className="pointer-events-none absolute inset-0 -z-0 bg-linear-to-t from-azul-950/90 via-azul-950/40 to-transparent md:bg-linear-to-r md:from-azul-950/95 md:via-azul-950/60"
          aria-hidden
        />
        <div className="relative mx-auto flex min-h-[calc(100svh-var(--alto-encabezado))] max-w-7xl flex-col justify-end px-4 pb-14 pt-16 md:justify-center md:pb-20">
          <p className="life-entrar inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-azul-100 backdrop-blur">
            <span className="size-2 rounded-full bg-azul-300" aria-hidden />
            Instituto Alberto Einstein · Panamá
          </p>

          <h1
            aria-label={TITULO}
            className="mt-6 text-[clamp(4rem,15vw,11rem)] font-black leading-[0.85] tracking-tighter [perspective:800px]"
          >
            {TITULO.split("").map((letra, i) => (
              <span
                key={i}
                aria-hidden
                className="life-letra life-brillo bg-linear-to-r from-white via-azul-200 to-white bg-clip-text text-transparent"
                style={{ animationDelay: `${0.15 + i * 0.07}s, 0s` } as CSSProperties}
              >
                {letra === " " ? " " : letra}
              </span>
            ))}
          </h1>

          <p className="life-entrar mt-6 max-w-xl text-lg leading-relaxed text-azul-100 md:text-xl" style={{ animationDelay: "0.8s" }}>
            La app para la vida escolar del IAE. <strong className="font-semibold text-white">Creada por estudiantes del AI Lab</strong>{" "}
            con inteligencia artificial.
          </p>

          <div className="life-entrar mt-8 flex flex-wrap gap-3" style={{ animationDelay: "0.95s" }}>
            <a
              href="#funciones"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-azul-900 shadow-lg shadow-azul-950/30 transition-transform hover:-translate-y-0.5"
            >
              Abrir la app <ArrowRight className="size-4" aria-hidden />
            </a>
            <Link
              href="/creditos"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Quién la hizo
            </Link>
          </div>

          <dl className="life-entrar mt-10 grid max-w-md grid-cols-3 gap-3" style={{ animationDelay: "1.1s" }}>
            {[
              { valor: funciones.length, etiqueta: "Funciones" },
              { valor: listas, etiqueta: "Para probar" },
              { valor: 5, etiqueta: "Estudiantes" },
            ].map((d) => (
              <div key={d.etiqueta} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                <dt className="text-xs text-azul-200">{d.etiqueta}</dt>
                <dd className="mt-1 text-3xl font-bold tabular-nums">{d.valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Funciones */}
      <section id="funciones" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-azul-600">Funciones</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-azul-950 md:text-5xl">
            Todo lo del colegio, <span className="text-azul-600">en una sola app</span>.
          </h2>
          <p className="mt-4 max-w-xl text-azul-900/60">
            Toca una función para abrirla. Es una vista previa: los datos son de ejemplo y ficticios, y lo que guardes se
            queda solo en este navegador.
          </p>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {funciones.map((f) => {
              const tarjeta = (
                <>
                  <span className="flex items-start justify-between">
                    <span
                      className={`grid size-12 place-items-center rounded-2xl ${
                        f.estado === "lista"
                          ? "bg-azul-800 text-white shadow-lg shadow-azul-800/25 transition-transform group-hover:scale-110"
                          : "bg-azul-50 text-azul-400"
                      }`}
                    >
                      <f.icono className="size-6" aria-hidden />
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        f.estado === "lista" ? "bg-emerald-50 text-emerald-700" : "bg-azul-50 text-azul-600"
                      }`}
                    >
                      {f.estado === "lista" ? "Lista para probar" : "Próximamente"}
                    </span>
                  </span>
                  <span className="mt-6 block text-xl font-bold text-azul-950">{f.proyecto}</span>
                  <span className="mt-2 block flex-1 leading-relaxed text-azul-900/65">{f.descripcion}</span>
                  <span className="mt-6 flex items-center justify-between text-sm">
                    <span className="text-azul-900/50">Creada por {f.estudiante}</span>
                    {f.estado === "lista" && (
                      <span className="flex items-center gap-1 font-semibold text-azul-700 transition-transform group-hover:translate-x-1">
                        Abrir <ArrowRight className="size-4" aria-hidden />
                      </span>
                    )}
                  </span>
                </>
              );
              const clases = "group flex h-full flex-col rounded-3xl border p-6 transition-all";
              return (
                <li key={f.slug}>
                  {f.estado === "lista" ? (
                    <Link
                      href={f.href}
                      className={`${clases} border-azul-100 bg-white hover:-translate-y-1 hover:border-azul-300 hover:shadow-xl hover:shadow-azul-900/10`}
                    >
                      {tarjeta}
                    </Link>
                  ) : (
                    <div className={`${clases} border-dashed border-azul-200 bg-azul-50/40`}>{tarjeta}</div>
                  )}
                </li>
              );
            })}
            <li>
              <Link
                href="/creditos"
                className="flex h-full min-h-60 flex-col justify-between rounded-3xl bg-linear-to-br from-azul-800 to-azul-950 p-6 text-white transition-transform hover:-translate-y-1"
              >
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-azul-200">Hecha en el IAE</span>
                <span>
                  <span className="block text-2xl font-bold">Hecha por estudiantes</span>
                  <span className="mt-2 flex items-center gap-1 text-azul-100">
                    Conoce quién creó cada función <ArrowRight className="size-4" aria-hidden />
                  </span>
                </span>
              </Link>
            </li>
          </ul>

          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-azul-900/70">
            {PILARES.map((p) => (
              <li key={p.texto} className="flex items-center gap-2">
                <p.icono className="size-4 text-azul-600" aria-hidden />
                {p.texto}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Qué resuelve */}
      <section className="bg-azul-50/60">
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-azul-600">El día a día</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-azul-950 md:text-5xl">Qué resuelve</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {MOMENTOS.map((m) => (
              <div key={m.titulo} className="rounded-3xl border border-azul-100 bg-white p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-azul-100 text-azul-800">
                  <m.icono className="size-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-xl font-bold text-azul-950">{m.titulo}</h3>
                <p className="mt-2 leading-relaxed text-azul-900/65">{m.texto}</p>
                <p className="mt-5 flex flex-wrap gap-2">
                  {m.slugs.map((s) => (
                    <span key={s} className="rounded-full bg-azul-50 px-3 py-1 text-xs font-semibold text-azul-700">
                      {nombre(s)}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hoja de ruta */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-azul-600">Hoja de ruta</p>
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
            <Link href="/hub" className="hover:text-white">
              HUB del AI Lab
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
