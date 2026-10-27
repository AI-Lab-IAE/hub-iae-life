import { secciones, type RutaSeccion } from "../secciones";
import { Volver } from "./Volver";

// Encabezado común de cada sección: enlace para volver, ícono, nombre y descripción.
export function EncabezadoSeccion({ ruta }: { ruta: RutaSeccion }) {
  const seccion = secciones.find((s) => s.ruta === ruta)!;

  return (
    <>
      <Volver />
      <h1 className="mt-6 text-3xl font-bold">
        <span aria-hidden="true">{seccion.icono}</span> {seccion.nombre}
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">{seccion.descripcion}</p>
      <p className="mt-4 text-xs text-amber-700 dark:text-amber-300">Datos de ejemplo, ficticios.</p>
    </>
  );
}
