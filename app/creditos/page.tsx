import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { funciones } from "../_life/funciones";

export const metadata: Metadata = {
  title: "Créditos",
};

// Quién creó cada función de IAE LIFE (solo el nombre de pila, como en info.ts).
export default function Creditos() {
  return (
    <main className="flex-1 bg-azul-50/60">
      <section className="bg-linear-to-br from-azul-950 via-azul-900 to-azul-700 text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
          <p className="life-entrar text-sm font-semibold uppercase tracking-[0.2em] text-azul-200">Créditos</p>
          <h1 className="life-entrar mt-3 text-4xl font-bold tracking-tight md:text-6xl" style={{ animationDelay: "0.1s" }}>
            Hecha por estudiantes
          </h1>
          <p className="life-entrar mt-4 max-w-xl text-lg text-azul-100" style={{ animationDelay: "0.2s" }}>
            Cada función de IAE LIFE nació como el proyecto de un estudiante del AI Lab del Instituto Alberto Einstein,
            construido con inteligencia artificial.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <ul className="grid gap-4">
          {funciones.map((f) => (
            <li key={f.slug} className="flex flex-col gap-4 rounded-3xl border border-azul-100 bg-white p-6 sm:flex-row sm:items-center">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-azul-800 text-white">
                <f.icono className="size-6" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xl font-bold text-azul-950">{f.proyecto}</p>
                <p className="mt-1 text-sm leading-relaxed text-azul-900/65">{f.descripcion}</p>
              </div>
              <div className="shrink-0 sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-azul-500">Creada por</p>
                <p className="text-lg font-bold text-azul-800">{f.estudiante}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-sm text-azul-900/60">Coordinación: José David Saldaña, AI Lab IAE.</p>
        <Link href="/" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-azul-700 hover:text-azul-900">
          Volver al inicio <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </main>
  );
}
