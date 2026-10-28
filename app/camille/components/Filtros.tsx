import { tocar } from "./estilos";

type Props<T extends string> = {
  opciones: { valor: T; nombre: string; cantidad: number }[];
  elegido: T;
  alElegir: (valor: T) => void;
};

// Fila de botones para filtrar una lista (por ejemplo: Todos, Exámenes, Eventos).
export function Filtros<T extends string>({ opciones, elegido, alElegir }: Props<T>) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      {opciones.map((o) => {
        const activo = o.valor === elegido;
        return (
          <button
            key={o.valor}
            aria-pressed={activo}
            onClick={() => alElegir(o.valor)}
            className={`${tocar} flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium ${
              activo
                ? "border-sky-500 bg-sky-500 text-white shadow-sm shadow-sky-500/30"
                : "border-sky-100 bg-white text-slate-600 hover:border-sky-300 dark:border-sky-900/60 dark:bg-slate-900 dark:text-slate-300"
            }`}
          >
            {o.nombre}
            <span className={`rounded-full px-1.5 text-xs ${activo ? "bg-white/25" : "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300"}`}>
              {o.cantidad}
            </span>
          </button>
        );
      })}
    </div>
  );
}
