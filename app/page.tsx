import Link from "next/link";
import { ArrowRight, Eye, Megaphone } from "lucide-react";
import { anuncios } from "./camille/datos";
import { funciones } from "./_life/funciones";
import ResumenHoy from "./_life/ResumenHoy";

// «Hoy»: la pantalla de inicio de IAE LIFE. Reúne lo del día (próxima clase, tareas, fechas y avisos)
// y da acceso a cada función. Todo son datos de ejemplo hasta tener el perfil y el horario únicos.
export default function Hoy() {
  const avisos = [...anuncios].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 3);

  return (
    <main className="flex-1 bg-azul-50/50">
      <div className="mx-auto max-w-7xl px-4 py-6 md:py-10">
        <p className="mb-5 flex items-start gap-2 rounded-2xl border border-azul-200 bg-white px-4 py-3 text-sm text-azul-900/75">
          <Eye className="mt-0.5 size-4 shrink-0 text-azul-600" aria-hidden />
          <span>
            <strong className="font-semibold text-azul-950">Vista previa del nuevo IAE LIFE.</strong> Así se verá la app
            desde ahora: una sola app con funciones. Los datos son de ejemplo.
          </span>
        </p>

        <ResumenHoy />

        {/* Avisos recientes */}
        <section className="mt-4 rounded-3xl border border-azul-100 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-bold text-azul-950">
              <Megaphone className="size-5 text-azul-600" aria-hidden /> Avisos recientes
            </h2>
            <Link href="/avisos" className="flex items-center gap-1 text-sm font-semibold text-azul-700">
              Ver todos <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-azul-100">
            {avisos.map((a) => (
              <li key={a.fecha + a.titulo} className="py-3 first:pt-0 last:pb-0">
                <p className="flex items-center gap-2 font-medium text-azul-950">
                  {a.titulo}
                  {a.importante && (
                    <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
                      Importante
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-sm text-azul-900/60">{a.texto}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Funciones */}
        <section className="mt-8">
          <h2 className="text-lg font-bold text-azul-950">Funciones</h2>
          <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-5">
            {funciones.map((f) => (
              <li key={f.slug}>
                <Link
                  href={f.href}
                  className="group flex h-full flex-col rounded-3xl border border-azul-100 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-azul-300 hover:shadow-lg hover:shadow-azul-900/10"
                >
                  <span className="grid size-11 place-items-center rounded-2xl bg-azul-800 text-white transition-transform group-hover:scale-105">
                    <f.icono className="size-5" aria-hidden />
                  </span>
                  <span className="mt-4 font-bold text-azul-950">{f.funcion}</span>
                  <span className="mt-1 flex-1 text-sm leading-snug text-azul-900/60">{f.resumen}</span>
                  <span className="mt-3 text-xs text-azul-900/45">
                    {f.proyecto} de {f.estudiante}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/creditos" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-azul-700">
            Hecha por estudiantes del AI Lab <ArrowRight className="size-4" aria-hidden />
          </Link>
        </section>
      </div>
    </main>
  );
}
