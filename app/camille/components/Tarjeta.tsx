import Link from "next/link";

type Props = {
  ruta: string;
  icono: string;
  nombre: string;
  descripcion: string;
};

// Tarjeta de la página principal: lleva a una sección de la guía.
export function Tarjeta({ ruta, icono, nombre, descripcion }: Props) {
  return (
    <Link
      href={`/camille/${ruta}`}
      className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
    >
      <span className="text-3xl" aria-hidden="true">
        {icono}
      </span>
      <span className="font-semibold">{nombre}</span>
      <span className="text-sm text-zinc-500 dark:text-zinc-400">{descripcion}</span>
    </Link>
  );
}
