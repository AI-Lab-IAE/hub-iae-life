import Link from "next/link";
import type { RutaSeccion } from "../secciones";
import { Contador } from "./Contador";
import { colorSeccion, tocar } from "./estilos";
import { iconoSeccion } from "./Seccion";

type Props = {
  ruta: RutaSeccion;
  nombre: string;
  numero: number;
  texto: string;
};

// Tarjeta de una sección de Colegio, igual que los atajos de Hoy: nombre, ícono y un número que sube.
export function Tarjeta({ ruta, nombre, numero, texto }: Props) {
  const Icono = iconoSeccion[ruta];
  return (
    <Link
      href={`/camille/${ruta}`}
      className={`${tocar} flex h-full min-h-32 flex-col justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-azul-900/5 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-azul-900/10`}
    >
      <span className={`grid size-11 place-items-center rounded-full ${colorSeccion[ruta]}`}>
        <Icono className="size-5" aria-hidden />
      </span>
      <span>
        <span className="block font-bold text-azul-800">{nombre}</span>
        <span className="block text-sm text-azul-900">
          <Contador valor={numero} /> {texto}
        </span>
      </span>
    </Link>
  );
}
