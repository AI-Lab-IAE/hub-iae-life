// Marco común de cada función de IAE LIFE: la misma franja azul con el título y el mismo fondo.
// Así, si tapas el logo de arriba, todas las pantallas se ven de la misma app.
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

// Tarjetas y botones iguales en todas las funciones.
export const tarjeta = "rounded-3xl border border-azul-100 bg-white shadow-sm";
export const botonPrimario =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-azul-800 px-5 font-semibold text-white transition hover:bg-azul-900 disabled:cursor-not-allowed disabled:opacity-50";
export const botonSecundario =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-azul-50 px-5 font-semibold text-azul-800 ring-1 ring-azul-100 transition hover:bg-azul-100 disabled:cursor-not-allowed disabled:opacity-50";

type Props = {
  icono: LucideIcon;
  titulo: string;
  texto?: ReactNode;
  ancho?: "angosto" | "normal" | "ancho";
  children: ReactNode;
};

const ANCHOS = { angosto: "max-w-2xl", normal: "max-w-4xl", ancho: "max-w-6xl" };

export function Pantalla({ icono: Icono, titulo, texto, ancho = "normal", children }: Props) {
  const max = ANCHOS[ancho];
  return (
    <main className="flex-1 bg-azul-50/60">
      <section className="bg-linear-to-br from-azul-900 via-azul-800 to-azul-700 text-white">
        <div className={`mx-auto ${max} px-4 pb-16 pt-8`}>
          <div className="flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20">
              <Icono className="size-6" aria-hidden />
            </span>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{titulo}</h1>
          </div>
          {texto && <p className="mt-3 max-w-xl text-azul-100">{texto}</p>}
        </div>
      </section>
      <div className={`relative mx-auto -mt-10 ${max} px-4 pb-12`}>{children}</div>
    </main>
  );
}

// Pestañas dentro de una función (Colegio, Tareas): mismas en todas.
export function Pestanas<T extends string>({
  opciones,
  valor,
  onCambio,
  etiqueta,
}: {
  opciones: { id: T; texto: string; icono?: LucideIcon }[];
  valor: T;
  onCambio: (v: T) => void;
  etiqueta: string;
}) {
  return (
    <div role="tablist" aria-label={etiqueta} className={`${tarjeta} flex gap-1 overflow-x-auto p-1.5`}>
      {opciones.map((o) => {
        const activa = o.id === valor;
        return (
          <button
            key={o.id}
            type="button"
            role="tab"
            aria-selected={activa}
            onClick={() => onCambio(o.id)}
            className={`flex min-h-10 shrink-0 items-center gap-1.5 rounded-2xl px-3.5 text-sm font-semibold transition-colors ${
              activa ? "bg-azul-800 text-white" : "text-azul-900/70 hover:bg-azul-50"
            }`}
          >
            {o.icono && <o.icono className="size-4" aria-hidden />}
            {o.texto}
          </button>
        );
      })}
    </div>
  );
}
