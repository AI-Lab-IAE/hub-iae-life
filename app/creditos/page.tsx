import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition, type CSSProperties } from "react";
import "../_hub/hub.css";
import Aparecer from "../_hub/Aparecer";
import BarraHub from "../_hub/BarraHub";
import { colorDe, fuenteHub } from "../_hub/estilo";
import { funciones } from "../_life/funciones";

export const metadata: Metadata = {
  title: "Créditos · IAE LIFE",
};

// Quién creó cada función de IAE LIFE (solo el nombre de pila, como en info.ts).
export default function Creditos() {
  return (
    <ViewTransition enter="hub-llegar" exit="hub-salir" default="none">
      <main className={`hub ${fuenteHub.variable} flex-1`}>
        <div className="hub-aurora" />
        <div className="hub-cuadricula" />
        <BarraHub actual="creditos" />

        <div className="relative mx-auto max-w-4xl px-4 pb-24 pt-36">
          <p className="hub-entrar font-mono text-sm uppercase tracking-[0.3em] text-cyan-300/80">Créditos</p>
          <h1
            className="hub-entrar mt-3 text-5xl font-bold tracking-tight text-white md:text-7xl"
            style={{ animationDelay: "0.1s" }}
          >
            Hecha por <span className="hub-degradado">estudiantes</span>
          </h1>
          <p className="hub-entrar mt-4 max-w-xl text-lg text-white/60" style={{ animationDelay: "0.2s" }}>
            Cada función de IAE LIFE nació como el proyecto de un estudiante del AI Lab del Instituto Alberto
            Einstein, construido con inteligencia artificial.
          </p>

          <ul className="mt-14 grid gap-4">
            {funciones.map((f, i) => (
              <li key={f.slug}>
                <Aparecer retraso={i * 100}>
                  <div
                    className="hub-vidrio flex flex-col gap-3 rounded-3xl p-6 sm:flex-row sm:items-center sm:gap-6"
                    style={{ "--color": colorDe(f.slug, i) } as CSSProperties}
                  >
                    <span className="hub-orbe shrink-0" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="text-xl font-semibold text-white">{f.proyecto}</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">{f.descripcion}</p>
                    </div>
                    <div className="shrink-0 sm:text-right">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/40">Creado por</p>
                      <p className="text-lg font-semibold text-[var(--color)]">{f.estudiante}</p>
                    </div>
                  </div>
                </Aparecer>
              </li>
            ))}
          </ul>

          <p className="mt-12 text-sm text-white/40">
            Coordinación: José David Saldaña, AI Lab IAE.{" "}
            <Link href="/" className="text-white/70 underline-offset-4 hover:underline">
              Volver al inicio
            </Link>
          </p>
        </div>
      </main>
    </ViewTransition>
  );
}
