import Link from "next/link";
import { ViewTransition, type CSSProperties } from "react";
import "./_hub/hub.css";
import Aparecer from "./_hub/Aparecer";
import BarraHub from "./_hub/BarraHub";
import DiasParaMvp from "./_hub/DiasParaMvp";
import Escena3D from "./_hub/Escena3D";
import TarjetaModulo from "./_hub/TarjetaModulo";
import { colorDe, fuenteHub } from "./_hub/estilo";
import { funciones } from "./_life/funciones";

const TITULO = "IAE LIFE";
const TONOS = ["#67e8f9", "#67e8f9", "#a78bfa", "", "#a78bfa", "#c084fc", "#f472b6", "#f472b6"];

// Qué resuelve IAE LIFE en el día a día, agrupado por momento.
const MOMENTOS = [
  {
    titulo: "Encontrar",
    texto: "Mapa, contactos, documentos, calendario, anuncios y horario del colegio en un solo lugar.",
    slugs: ["camille"],
  },
  {
    titulo: "Estudiar y organizarse",
    texto: "La IA encuentra lo que no sabes antes del examen y reparte tus tareas en tu horario real.",
    slugs: ["marco", "daniela"],
  },
  {
    titulo: "Comunicarse",
    texto: "Avisos que sí llegan a cada estudiante y correos a profesores redactados por la IA.",
    slugs: ["abraham", "jonathan"],
  },
];

const RUTA = [
  { cuando: "13 nov 2026", titulo: "MVP", texto: "Las funciones publicadas, con datos de ejemplo y probadas en celular." },
  { cuando: "16–27 nov", titulo: "Piloto", texto: "Un grupo pequeño de estudiantes y profesores la usa y da su opinión." },
  { cuando: "Diciembre", titulo: "Ajustes", texto: "Cambios según el piloto y decisión de qué funciones siguen." },
  {
    cuando: "2027",
    titulo: "Versión final",
    texto: "Entrada con la cuenta @iae.edu, base de datos y datos reales del colegio, con autorización.",
  },
];

export default function Home() {
  const colores = funciones.map((f, i) => colorDe(f.slug, i));
  const listas = funciones.filter((f) => f.estado === "lista").length;
  const nombre = (slug: string) => funciones.find((f) => f.slug === slug)!.proyecto;

  return (
    <ViewTransition enter="hub-llegar" exit="hub-salir" default="none">
      <main className={`hub ${fuenteHub.variable} flex-1`}>
        <BarraHub actual="inicio" />

        {/* Portada con la escena 3D */}
        <section className="relative flex min-h-[100svh] items-end overflow-hidden pb-20 pt-28 md:items-center md:pb-0">
          <div className="hub-aurora" />
          <div className="hub-cuadricula" />
          <div className="hub-piso" />
          <Escena3D colores={colores} />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#04050d] via-[#04050d]/70 to-transparent md:bg-linear-to-r md:via-[#04050d]/40" />

          <div className="relative z-10 mx-auto w-full max-w-6xl px-4">
            <div className="max-w-2xl">
              <p
                className="hub-entrar hub-vidrio inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/70"
                style={{ animationDelay: "0.1s" }}
              >
                <span className="hub-latido size-2 rounded-full bg-cyan-300" aria-hidden />
                AI Lab · Instituto Alberto Einstein
              </p>

              <h1
                aria-label={TITULO}
                className="mt-8 text-[clamp(4.2rem,14vw,10.5rem)] font-bold leading-[0.85] tracking-tighter [perspective:800px]"
              >
                {TITULO.split("").map((letra, i) => (
                  <span
                    key={i}
                    aria-hidden
                    className="hub-letra"
                    style={{ "--tono": TONOS[i] || "#fff", animationDelay: `${0.3 + i * 0.07}s` } as CSSProperties}
                  >
                    {letra === " " ? " " : letra}
                  </span>
                ))}
              </h1>

              <p
                className="hub-entrar mt-8 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl"
                style={{ animationDelay: "0.9s" }}
              >
                La app para la vida escolar del IAE.{" "}
                <span className="hub-degradado font-semibold">Creada por estudiantes del AI Lab</span> con
                inteligencia artificial.
              </p>

              <div className="hub-entrar mt-10 flex flex-wrap gap-3" style={{ animationDelay: "1.05s" }}>
                <a href="#funciones" className="hub-boton">
                  Explorar las funciones <span aria-hidden>↓</span>
                </a>
                <Link href="/creditos" className="hub-boton-fantasma">
                  Quién la hizo
                </Link>
              </div>

              <dl className="hub-entrar mt-12 grid max-w-lg grid-cols-3 gap-3" style={{ animationDelay: "1.2s" }}>
                {[
                  { valor: funciones.length, etiqueta: "Funciones" },
                  { valor: listas, etiqueta: "Para probar" },
                  { valor: <DiasParaMvp />, etiqueta: "Días para el MVP" },
                ].map((d) => (
                  <div key={d.etiqueta} className="hub-vidrio rounded-2xl px-4 py-3">
                    <dt className="text-xs text-white/50">{d.etiqueta}</dt>
                    <dd className="mt-1 text-3xl font-semibold tabular-nums text-white">{d.valor}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block" aria-hidden>
            <div className="hub-raton" />
          </div>
        </section>

        {/* Funciones */}
        <section id="funciones" className="relative mx-auto max-w-6xl scroll-mt-24 px-4 py-28">
          <Aparecer>
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-cyan-300/80">01 — Las funciones</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-white md:text-6xl">
              {funciones.length} ideas, <span className="hub-degradado">una sola app</span>.
            </h2>
            <p className="mt-4 max-w-xl text-white/60">
              Toca una función para probarla. Es una vista previa: todos los datos son de ejemplo y ficticios, y lo
              que guardes se queda solo en este navegador.
            </p>
          </Aparecer>

          <ul className="mt-16 grid gap-6 [perspective:1200px] sm:grid-cols-2 lg:grid-cols-3">
            {funciones.map((f, i) => (
              <li key={f.slug}>
                <Aparecer retraso={(i % 3) * 120} className="h-full">
                  <TarjetaModulo
                    href={f.href}
                    numero={String(i + 1).padStart(2, "0")}
                    proyecto={f.proyecto}
                    estudiante={f.estudiante}
                    descripcion={f.descripcion}
                    color={colores[i]}
                    completa={f.estado === "lista"}
                    etiqueta={f.estado === "lista" ? "Lista para probar" : "Próximamente"}
                  />
                </Aparecer>
              </li>
            ))}
            <li>
              <Aparecer retraso={(funciones.length % 3) * 120} className="h-full">
                <Link
                  href="/creditos"
                  className="flex h-full min-h-72 flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-white/15 p-8 text-center transition-colors hover:border-white/35"
                >
                  <span className="hub-cubo" style={{ "--l": "56px" } as CSSProperties} aria-hidden>
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                  <span>
                    <span className="block font-mono text-xs uppercase tracking-[0.3em] text-white/40">Créditos</span>
                    <span className="mt-2 block text-xl font-semibold text-white">Hecha por estudiantes</span>
                    <span className="mt-2 block text-sm text-white/50">Conoce quién creó cada función →</span>
                  </span>
                </Link>
              </Aparecer>
            </li>
          </ul>
        </section>

        {/* Para el día a día */}
        <section className="relative mx-auto max-w-6xl px-4 pb-28">
          <Aparecer>
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-violet-300/80">02 — El día a día</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-6xl">Qué resuelve</h2>
          </Aparecer>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {MOMENTOS.map((m, i) => (
              <Aparecer key={m.titulo} retraso={i * 150} className="h-full">
                <div className="hub-vidrio h-full rounded-3xl p-6">
                  <h3 className="text-xl font-semibold text-white">{m.titulo}</h3>
                  <p className="mt-2 leading-relaxed text-white/60">{m.texto}</p>
                  <p className="mt-5 flex flex-wrap gap-2">
                    {m.slugs.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80"
                        style={{ borderColor: colorDe(s, 0) }}
                      >
                        {nombre(s)}
                      </span>
                    ))}
                  </p>
                </div>
              </Aparecer>
            ))}
          </div>
        </section>

        {/* Hoja de ruta */}
        <section className="relative mx-auto max-w-6xl px-4 pb-32">
          <Aparecer>
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-pink-300/80">03 — Hoja de ruta</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-6xl">Hacia la versión final</h2>
          </Aparecer>
          <div className="relative mt-16">
            <div
              className="absolute left-0 right-0 top-7 hidden h-px bg-linear-to-r from-cyan-300/0 via-violet-400/60 to-pink-400/0 md:block"
              aria-hidden
            />
            <ol className="grid gap-10 md:grid-cols-4 md:gap-6">
              {RUTA.map((p, i) => (
                <li key={p.titulo}>
                  <Aparecer retraso={i * 150}>
                    <span className="hub-vidrio relative grid size-14 place-items-center rounded-2xl font-mono text-lg text-white">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-white/40">{p.cuando}</p>
                    <h3 className="mt-1 text-xl font-semibold text-white">{p.titulo}</h3>
                    <p className="mt-2 leading-relaxed text-white/60">{p.texto}</p>
                  </Aparecer>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <footer className="border-t border-white/5">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-white/40">
            <p>IAE LIFE · AI Lab · Instituto Alberto Einstein · 2026</p>
            <Link href="/creditos" className="transition-colors hover:text-white">
              Créditos
            </Link>
          </div>
        </footer>
      </main>
    </ViewTransition>
  );
}
