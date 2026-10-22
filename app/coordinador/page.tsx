import type { Metadata } from "next";
import { ViewTransition, type CSSProperties } from "react";
import "../_hub/hub.css";
import Aparecer from "../_hub/Aparecer";
import BarraHub from "../_hub/BarraHub";
import DiasParaMvp from "../_hub/DiasParaMvp";
import { colorDe, fuenteHub } from "../_hub/estilo";
import { modulos, tarjetaCompleta } from "../modulos";

export const metadata: Metadata = {
  title: "Coordinador · HUB IAE LIFE",
};

const REPO = "https://github.com/AI-Lab-IAE/hub-iae-life";
const BOTON = `${REPO}/actions/workflows/crear-iae-life.yml`;

const PASOS = [
  <>Pulsa el botón. Se abre GitHub (entra con la cuenta josesaldana-collab).</>,
  <>
    Pulsa <strong className="text-white">Run workflow</strong> y otra vez{" "}
    <strong className="text-white">Run workflow</strong>.
  </>,
  <>En unos minutos llega un PR &quot;Crear IAE LIFE&quot; con su enlace de vista previa. No se publica nada hasta que lo unas.</>,
];

// Página del coordinador. La mantiene Jose David.
export default function Coordinador() {
  const conTarjeta = modulos.filter(tarjetaCompleta).length;
  const porcentaje = Math.round((conTarjeta / modulos.length) * 100);

  return (
    <ViewTransition enter="hub-llegar" exit="hub-salir" default="none">
      <main className={`hub ${fuenteHub.variable} flex-1`}>
        <div className="hub-aurora" />
        <div className="hub-cuadricula" />
        <BarraHub actual="coordinador" />

        <div className="mx-auto max-w-6xl px-4 pb-24 pt-36">
          <p className="hub-entrar font-mono text-sm uppercase tracking-[0.3em] text-cyan-300/80">Panel</p>
          <h1
            className="hub-entrar mt-3 text-5xl font-bold tracking-tight text-white md:text-7xl"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="hub-degradado">Coordinador</span>
          </h1>
          <p className="hub-entrar mt-4 max-w-xl text-lg text-white/60" style={{ animationDelay: "0.2s" }}>
            Avance de los módulos y creación de la app final IAE LIFE.
          </p>

          <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.6fr]">
            {/* Resumen */}
            <Aparecer>
              <section className="hub-vidrio flex h-full flex-col items-center justify-center gap-6 rounded-3xl p-8 text-center">
                <div
                  className="hub-anillo grid place-items-center"
                  style={{ "--p": porcentaje } as CSSProperties}
                  role="img"
                  aria-label={`${conTarjeta} de ${modulos.length} tarjetas completas`}
                >
                  <span className="text-3xl font-bold text-white">
                    {conTarjeta}
                    <span className="text-lg text-white/40">/{modulos.length}</span>
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-white">Tarjetas completas</p>
                  <p className="mt-1 text-sm text-white/50">
                    Que un módulo esté terminado lo decides tú al revisar sus PRs.
                  </p>
                </div>
                <p className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-white/70">
                  <span className="font-semibold text-white">
                    <DiasParaMvp />
                  </span>{" "}
                  días para el MVP
                </p>
              </section>
            </Aparecer>

            {/* Módulos */}
            <Aparecer retraso={120}>
              <section className="hub-vidrio h-full rounded-3xl p-2">
                <h2 className="px-5 pb-2 pt-4 text-xl font-semibold text-white">Módulos</h2>
                <ul>
                  {modulos.map((m, i) => {
                    const completa = tarjetaCompleta(m);
                    return (
                      <li
                        key={m.slug}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-4 transition-colors hover:bg-white/[0.04]"
                        style={{ "--color": colorDe(m.slug, i) } as CSSProperties}
                      >
                        <div className="flex items-center gap-4">
                          <span
                            className="size-3 rounded-full bg-[var(--color)] shadow-[0_0_14px_var(--color)]"
                            aria-hidden
                          />
                          <div>
                            <a href={`/${m.slug}`} className="font-semibold text-white hover:underline">
                              {m.proyecto}
                            </a>
                            <span className="text-white/40"> · {m.estudiante}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span
                            className={
                              completa
                                ? "rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-emerald-300"
                                : "rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-amber-300"
                            }
                          >
                            {completa ? "Tarjeta completa" : "Falta su tarjeta"}
                          </span>
                          <a
                            href={`${REPO}/pulls?q=is%3Apr+head%3A${m.slug}%2F`}
                            className="text-white/50 transition-colors hover:text-white"
                          >
                            Sus PRs ↗
                          </a>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </Aparecer>
          </div>

          {/* Crear IAE LIFE */}
          <Aparecer className="mt-6">
            <section className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-cyan-400/10 via-violet-500/10 to-pink-500/10 p-8 md:p-12">
              <div className="hub-piso opacity-60" />
              <div className="relative grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-center">
                <div>
                  <p className="font-mono text-sm uppercase tracking-[0.3em] text-pink-300/80">Paso final</p>
                  <h2 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl">Crear IAE LIFE</h2>
                  <p className="mt-4 leading-relaxed text-white/70">
                    Cuando los módulos estén listos, este botón pone a Claude Code a unirlos en una sola app llamada
                    IAE LIFE: nombre, navegación, portada, créditos y diseño común. Los módulos incompletos entran
                    como &quot;Próximamente&quot;.
                  </p>
                  <ol className="mt-6 space-y-3">
                    {PASOS.map((paso, i) => (
                      <li key={i} className="flex gap-3 text-white/60">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full border border-white/20 font-mono text-xs text-white">
                          {i + 1}
                        </span>
                        <span>{paso}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="flex flex-col items-start gap-4 md:items-center">
                  <a href={BOTON} target="_blank" rel="noopener noreferrer" className="hub-boton px-8 py-5 text-lg">
                    Crear IAE LIFE <span aria-hidden>→</span>
                  </a>
                  <p className="max-w-xs text-sm text-white/40 md:text-center">
                    Solo funciona con la cuenta del coordinador. Cada ejecución usa la API de Anthropic y tiene
                    costo.
                  </p>
                </div>
              </div>
            </section>
          </Aparecer>
        </div>
      </main>
    </ViewTransition>
  );
}
