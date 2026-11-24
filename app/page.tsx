import Link from "next/link";
import { ArrowDown, ArrowRight, Lightbulb, MessageCircle, ShieldCheck, Smartphone, Sparkles } from "lucide-react";
import "./_hub/hub.css";
import { funciones } from "./_life/funciones";
import { Emblema } from "./_life/Marca";

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

const PILARES = [
  { icono: Smartphone, texto: "Funciona en celular y computadora" },
  { icono: ShieldCheck, texto: "Datos de ejemplo; nada personal" },
  { icono: Sparkles, texto: "Inteligencia artificial donde ayuda" },
];

export default function Inicio() {
  const nombre = (slug: string) => funciones.find((f) => f.slug === slug)!.proyecto;

  return (
    <main className="flex-1">
      {/* Portada: escudo del IAE, nombre y las funciones a un toque */}
      <section className="relative isolate overflow-hidden bg-linear-to-br from-azul-900 via-azul-800 to-azul-700 text-white">
        {/* Escudo grande de fondo, muy suave */}
        <span
          className="pointer-events-none absolute -right-24 top-1/2 -z-10 hidden -translate-y-1/2 opacity-[0.07] lg:block"
          aria-hidden
        >
          <Emblema className="size-[34rem] rounded-full bg-white" />
        </span>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:py-16 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="life-entrar flex items-center gap-3">
              <span className="grid size-14 place-items-center rounded-full bg-white p-1 shadow-lg shadow-azul-950/30">
                <Emblema className="size-12" />
              </span>
              <span className="text-sm leading-tight">
                Instituto Alberto Einstein
                <span className="block text-xs text-azul-200">Panamá · Fundado en 1955</span>
              </span>
            </p>

            <p className="life-entrar mt-8 text-sm font-medium text-lime-300" style={{ animationDelay: "0.05s" }}>
              Explora la vida estudiantil
            </p>
            <h1
              className="life-entrar mt-2 text-5xl font-black tracking-tight md:text-6xl"
              style={{ animationDelay: "0.1s" }}
            >
              IAE LIFE
            </h1>
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
              <a
                href="#funciones"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              >
                Ver todo <ArrowDown className="size-4" aria-hidden />
              </a>
            </div>
          </div>

          <nav
            aria-label="Abrir una función"
            className="life-entrar grid grid-cols-2 gap-3"
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
            <Link
              href="/creditos"
              className="flex min-h-36 flex-col justify-between rounded-2xl border border-white/25 bg-white/10 p-5 text-white transition hover:-translate-y-1 hover:bg-white/15"
            >
              <span className="h-1.5 w-10 rounded-full bg-oro" aria-hidden />
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wide text-azul-200">
                  Hecha en el IAE
                </span>
                <span className="flex items-center gap-1 font-bold">
                  Quién la hizo <ArrowRight className="size-4" aria-hidden />
                </span>
              </span>
            </Link>
          </nav>
        </div>
      </section>

      {/* Funciones */}
      <section id="funciones" className="scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-700">Funciones</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-azul-950 md:text-5xl">
            Todo lo del colegio, <span className="text-azul-600">en una sola app</span>.
          </h2>
          <p className="mt-4 max-w-xl text-azul-900/60">
            Toca una función para abrirla. Es una vista previa: los datos son de ejemplo y ficticios, y lo que guardes
            se queda solo en este navegador.
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
      <section>
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
            <Link href="/hub" className="hover:text-white">
              HUB del AI Lab
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
