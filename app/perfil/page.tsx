import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarClock, Sparkles, UserRound } from "lucide-react";
import { estudianteEjemplo } from "../_life/ejemplo";

export const metadata: Metadata = {
  title: "Perfil",
};

const UNIFICA = [
  { icono: UserRound, texto: "Tu nombre y grado, una sola vez para toda la app." },
  { icono: CalendarClock, texto: "Tu horario: lo usan Hoy, Tareas y Ausencia." },
  { icono: BookOpen, texto: "Tus materias y profesores: los usan Estudiar y Avisos." },
  { icono: Sparkles, texto: "Una sola conexión con la IA para todas las funciones." },
];

// Perfil: aquí vivirá el perfil único de IAE LIFE. Por ahora muestra el estudiante de ejemplo
// y qué va a reunir. Lo construyen Jonathan (datos) y Marco (código) en la unión real.
export default function Perfil() {
  return (
    <main className="flex-1 bg-azul-50/50">
      <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
        <section className="flex items-center gap-4 rounded-3xl bg-linear-to-br from-azul-800 to-azul-950 p-6 text-white">
          <span className="grid size-16 shrink-0 place-items-center rounded-full bg-white/15 text-2xl font-bold">
            {estudianteEjemplo.nombre.charAt(0)}
          </span>
          <span>
            <span className="block text-2xl font-bold">{estudianteEjemplo.nombre}</span>
            <span className="block text-azul-200">{estudianteEjemplo.grado} · datos de ejemplo</span>
          </span>
        </section>

        <section className="mt-4 rounded-3xl border border-azul-100 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-azul-600">Próximamente</p>
          <h1 className="mt-1 text-xl font-bold text-azul-950">Un solo perfil para todo IAE LIFE</h1>
          <ul className="mt-4 space-y-3">
            {UNIFICA.map((u) => (
              <li key={u.texto} className="flex items-start gap-3 text-azul-900/75">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-azul-50 text-azul-700">
                  <u.icono className="size-4" aria-hidden />
                </span>
                <span className="pt-1.5">{u.texto}</span>
              </li>
            ))}
          </ul>
        </section>

        <Link
          href="/creditos"
          className="mt-4 flex items-center justify-between rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-azul-800 ring-1 ring-azul-100"
        >
          Quién creó cada función <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </main>
  );
}
