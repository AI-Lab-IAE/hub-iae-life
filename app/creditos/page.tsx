import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { funciones } from "../_life/funciones";
import { Pantalla, tarjeta } from "../_life/Pantalla";

export const metadata: Metadata = {
  title: "Créditos",
};

// Hoja de ruta de IAE LIFE (antes estaba en la portada).
const RUTA = [
  { cuando: "13 nov 2026", titulo: "MVP", texto: "Las funciones publicadas, con datos de ejemplo y probadas en celular." },
  { cuando: "16–27 nov", titulo: "Piloto", texto: "Un grupo de estudiantes y profesores la usa y da su opinión." },
  { cuando: "Diciembre", titulo: "Ajustes", texto: "Cambios según el piloto y decisión de qué funciones siguen." },
  { cuando: "2027", titulo: "Versión final", texto: "Cuenta @iae.edu, base de datos y datos reales del colegio." },
];

// El único lugar de la app donde salen los nombres de los proyectos y quién los hizo (solo el nombre de pila).
export default function Creditos() {
  const conProyecto = funciones.filter((f) => f.proyecto);
  return (
    <Pantalla
      icono={Users}
      titulo="Créditos"
      texto="Cada función de IAE LIFE nació como el proyecto de un estudiante del AI Lab del Instituto Alberto Einstein, construido con inteligencia artificial."
    >
      <ul className="grid gap-4">
        {conProyecto.map((f) => (
          <li key={f.slug} className={`${tarjeta} flex flex-col gap-4 p-6 sm:flex-row sm:items-center`}>
            {f.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={f.logo} alt={`Logo de ${f.proyecto}`} className="size-12 shrink-0 object-contain" />
            ) : (
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-azul-800 text-white">
                <f.icono className="size-6" aria-hidden />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-azul-500">{f.nombre}</p>
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

      <section className={`${tarjeta} mt-8 p-6`}>
        <h2 className="text-xl font-bold text-azul-950">Hacia la versión final</h2>
        <ol className="mt-5 grid gap-5 md:grid-cols-4">
          {RUTA.map((p, i) => (
            <li key={p.titulo}>
              <span
                className={`grid size-10 place-items-center rounded-2xl font-bold ${
                  i === 0 ? "bg-azul-800 text-white" : "border-2 border-azul-200 bg-white text-azul-700"
                }`}
              >
                {i + 1}
              </span>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-azul-500">{p.cuando}</p>
              <h3 className="font-bold text-azul-950">{p.titulo}</h3>
              <p className="mt-1 text-sm leading-relaxed text-azul-900/65">{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <p className="mt-8 text-sm text-azul-900/60">Coordinación: José David Saldaña, AI Lab IAE.</p>
      <Link href="/" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-azul-700 hover:text-azul-900">
        Volver a Hoy <ArrowRight className="size-4" aria-hidden />
      </Link>
    </Pantalla>
  );
}
