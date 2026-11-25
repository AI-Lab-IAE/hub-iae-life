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
                ? "border-azul-800 bg-azul-800 text-white shadow-sm shadow-azul-500/25"
                : "border-azul-100 bg-white text-azul-900/70 hover:border-azul-300"
            }`}
          >
            {o.nombre}
            <span className={`rounded-full px-1.5 text-xs ${activo ? "bg-white/25" : "bg-azul-50 text-azul-900"}`}>
              {o.cantidad}
            </span>
          </button>
        );
      })}
    </div>
  );
}
