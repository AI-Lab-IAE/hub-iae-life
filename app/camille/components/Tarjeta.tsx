import Link from "next/link";
import type { RutaSeccion } from "../secciones";
import { tocar } from "./estilos";
import { Icono, type NombreIcono } from "./Icono";

type Props = {
  ruta: RutaSeccion;
  icono: NombreIcono;
  nombre: string;
  dato: string;
};

// Tarjeta índigo de "Mis secciones": nombre, ícono y un dato rápido (por ejemplo "4 anuncios").
export function Tarjeta({ ruta, icono, nombre, dato }: Props) {
  return (
    <Link
      href={`/camille/${ruta}`}
      className={`${tocar} group relative flex h-full flex-col justify-between gap-3 overflow-hidden rounded-2xl bg-linear-to-br from-indigo-800 to-indigo-950 p-3 text-white shadow-md shadow-indigo-900/20 hover:-translate-y-0.5 hover:shadow-lg sm:p-4`}
    >
      <span className="absolute -top-6 -right-6 size-16 rounded-full bg-white/5 transition group-hover:scale-125" aria-hidden="true" />
      <span className="flex size-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
        <Icono nombre={icono} className="size-5" />
      </span>
      <span>
        <span className="block text-sm leading-tight font-bold sm:text-base">{nombre}</span>
        <span className="mt-0.5 block text-[11px] text-indigo-200 sm:text-xs">{dato}</span>
      </span>
    </Link>
  );
}
