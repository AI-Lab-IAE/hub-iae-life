import Link from "next/link";
import { elevar, tarjeta, tocar } from "./estilos";
import { Icono, type NombreIcono } from "./Icono";

type Props = {
  ruta: string;
  icono: NombreIcono;
  nombre: string;
  descripcion: string;
};

// Tarjeta de acceso rápido de la página principal: lleva a una sección de la guía.
export function Tarjeta({ ruta, icono, nombre, descripcion }: Props) {
  return (
    <Link href={`/camille/${ruta}`} className={`${tarjeta} ${elevar} ${tocar} group flex h-full flex-col gap-3 p-4`}>
      <span className="flex size-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition duration-300 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white dark:bg-sky-950 dark:text-sky-400">
        <Icono nombre={icono} />
      </span>
      <span>
        <span className="block font-semibold">{nombre}</span>
        <span className="mt-0.5 block text-sm text-slate-500 dark:text-slate-400">{descripcion}</span>
      </span>
    </Link>
  );
}
