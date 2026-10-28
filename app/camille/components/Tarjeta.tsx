import Link from "next/link";
import type { RutaSeccion } from "../secciones";
import { colorSeccion, elevar, tarjeta, tocar } from "./estilos";
import { Icono, type NombreIcono } from "./Icono";

type Props = {
  ruta: RutaSeccion;
  icono: NombreIcono;
  nombre: string;
  descripcion: string;
};

// Acceso rápido de la página principal. En celular es compacto, como el ícono de una app.
export function Tarjeta({ ruta, icono, nombre, descripcion }: Props) {
  return (
    <Link
      href={`/camille/${ruta}`}
      className={`${tarjeta} ${elevar} ${tocar} group flex h-full flex-col items-center gap-2 p-3 text-center sm:items-start sm:gap-3 sm:p-4 sm:text-left`}
    >
      <span
        className={`flex size-12 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-110 ${colorSeccion[ruta]}`}
      >
        <Icono nombre={icono} />
      </span>
      <span>
        <span className="block text-xs leading-tight font-semibold text-slate-900 sm:text-base dark:text-slate-100">{nombre}</span>
        <span className="mt-0.5 hidden text-sm text-slate-500 sm:block dark:text-slate-400">{descripcion}</span>
      </span>
    </Link>
  );
}
