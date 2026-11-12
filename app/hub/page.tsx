import Link from "next/link";
import { ViewTransition, type CSSProperties } from "react";
import "../_hub/hub.css";
import Aparecer from "../_hub/Aparecer";
import BarraHub from "../_hub/BarraHub";
import DiasParaMvp from "../_hub/DiasParaMvp";
import Escena3D from "../_hub/Escena3D";
import TarjetaModulo from "../_hub/TarjetaModulo";
import { colorDe, fuenteHub } from "../_hub/estilo";
import { modulos, tarjetaCompleta } from "../modulos";

const TITULO = "IAE LIFE";
const TONOS = ["#67e8f9", "#67e8f9", "#a78bfa", "", "#a78bfa", "#c084fc", "#f472b6", "#f472b6"];

const PASOS = [
  {
    titulo: "Cada estudiante crea su módulo",
    texto: "Una idea con IA para la vida escolar del IAE, construida en su propia carpeta con Claude Code.",
  },
  {
    titulo: "Revisión y vista previa",
    texto: "Cada cambio llega como un Pull Request con su enlace de prueba. Nada se publica sin revisión.",
  },
  {
    titulo: "Todo se une en IAE LIFE",
    texto: "Cuando los módulos estén listos, se integran en una sola app con un mismo diseño.",
  },
];

export default function Hub() {
  const colores = modulos.map((m, i) => colorDe(m.slug, i));
  const enMarcha = modulos.filter(tarjetaCompleta).length;

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

              <p
                className="hub-entrar mt-8 font-mono text-sm uppercase tracking-[0.5em] text-white/50"
                style={{ animationDelay: "0.2s" }}
              >
                HUB
              </p>
              <h1
                aria-label={TITULO}
                className="mt-2 text-[clamp(4.2rem,14vw,10.5rem)] font-bold leading-[0.85] tracking-tighter [perspective:800px]"
              >
                {TITULO.split("").map((letra, i) => (
                  <span
                    key={i}
                    aria-hidden
                    className="hub-letra"
                    style={{ "--tono": TONOS[i] || "#fff", animationDelay: `${0.3 + i * 0.07}s` } as CSSProperties}
                  >
                    {letra === " " ? " " : letra}
                  </span>
                ))}
              </h1>

              <p
                className="hub-entrar mt-8 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl"
                style={{ animationDelay: "0.9s" }}
              >
                Cada estudiante del AI Lab construye un módulo con inteligencia artificial.{" "}
                <span className="hub-degradado font-semibold">Juntos forman IAE LIFE</span>, la app para la vida
                escolar del IAE.
              </p>

              <div className="hub-entrar mt-10 flex flex-wrap gap-3" style={{ animationDelay: "1.05s" }}>
                <a href="#proyectos" className="hub-boton">
                  Explorar los proyectos <span aria-hidden>↓</span>
                </a>
                <Link href="/coordinador" className="hub-boton-fantasma">
                  Coordinador
                </Link>
              </div>

              <dl className="hub-entrar mt-12 grid max-w-lg grid-cols-3 gap-3" style={{ animationDelay: "1.2s" }}>
                {[
                  { valor: modulos.length, etiqueta: "Proyectos" },
                  { valor: enMarcha, etiqueta: "En construcción" },
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

        {/* Proyectos */}
        <section id="proyectos" className="relative mx-auto max-w-6xl scroll-mt-24 px-4 py-28">
          <Aparecer>
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-cyan-300/80">01 — Los módulos</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-white md:text-6xl">
              {modulos.length} ideas, <span className="hub-degradado">una sola app</span>.
            </h2>
            <p className="mt-4 max-w-xl text-white/60">
              Toca un proyecto para abrir su módulo. Cada uno está en construcción rumbo al MVP del 13 de
              noviembre.
            </p>
          </Aparecer>

          <ul className="mt-16 grid gap-6 [perspective:1200px] sm:grid-cols-2 lg:grid-cols-3">
            {modulos.map((m, i) => (
              <li key={m.slug}>
                <Aparecer retraso={(i % 3) * 120} className="h-full">
                  <TarjetaModulo
                    href={`/${m.slug}`}
                    numero={String(i + 1).padStart(2, "0")}
                    proyecto={m.proyecto}
                    estudiante={m.estudiante}
                    descripcion={m.descripcion}
                    color={colores[i]}
                    completa={tarjetaCompleta(m)}
                  />
                </Aparecer>
              </li>
            ))}
            <li>
              <Aparecer retraso={(modulos.length % 3) * 120} className="h-full">
                <div className="flex h-full min-h-72 flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-white/15 p-8 text-center">
                  <span className="hub-cubo" style={{ "--l": "56px" } as CSSProperties} aria-hidden>
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">Próximamente</p>
                    <p className="mt-2 text-xl font-semibold text-white">IAE LIFE</p>
                    <p className="mt-2 text-sm text-white/50">Todos los módulos en una sola app.</p>
                  </div>
                </div>
              </Aparecer>
            </li>
          </ul>
        </section>

        {/* Cómo nace IAE LIFE */}
        <section className="relative mx-auto max-w-6xl px-4 pb-32">
          <Aparecer>
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-violet-300/80">02 — El proceso</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-6xl">Cómo nace IAE LIFE</h2>
          </Aparecer>
          <div className="relative mt-16">
            <div
              className="absolute left-0 right-0 top-7 hidden h-px bg-linear-to-r from-cyan-300/0 via-violet-400/60 to-pink-400/0 md:block"
              aria-hidden
            />
            <ol className="grid gap-10 md:grid-cols-3 md:gap-6">
              {PASOS.map((p, i) => (
                <li key={p.titulo}>
                  <Aparecer retraso={i * 150}>
                    <span className="hub-vidrio relative grid size-14 place-items-center rounded-2xl font-mono text-lg text-white">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-6 text-xl font-semibold text-white">{p.titulo}</h3>
                    <p className="mt-2 leading-relaxed text-white/60">{p.texto}</p>
                  </Aparecer>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <footer className="border-t border-white/5">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-white/40">
            <p>AI Lab · Instituto Alberto Einstein · 2026</p>
            <Link href="/coordinador" className="transition-colors hover:text-white">
              Coordinador
            </Link>
          </div>
        </footer>
      </main>
    </ViewTransition>
  );
}
