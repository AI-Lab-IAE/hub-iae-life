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
                ? "border-blue-900 bg-blue-900 text-white shadow-sm shadow-blue-950/20"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            }`}
          >
            {o.nombre}
            <span className={`rounded-full px-1.5 text-xs ${activo ? "bg-white/25" : "bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-300"}`}>
              {o.cantidad}
            </span>
          </button>
        );
      })}
    </div>
  );
}
