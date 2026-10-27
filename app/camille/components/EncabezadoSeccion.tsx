import { secciones, type RutaSeccion } from "../secciones";
import { Icono } from "./Icono";

// Encabezado común de cada sección: ícono, descripción y aviso de datos ficticios.
// El nombre y la flecha para regresar están en la barra superior.
export function EncabezadoSeccion({ ruta }: { ruta: RutaSeccion }) {
  const seccion = secciones.find((s) => s.ruta === ruta)!;

  return (
    <div className="flex items-center gap-4">
      <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-sky-400 to-sky-600 text-white shadow-md shadow-sky-500/30">
        <Icono nombre={seccion.icono} className="size-7" />
      </span>
      <div>
        <h1 className="text-2xl font-bold">{seccion.nombre}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{seccion.descripcion}</p>
        <span className="mt-1.5 inline-block rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-medium text-sky-700 dark:bg-sky-950 dark:text-sky-300">
          Datos de ejemplo, ficticios
        </span>
      </div>
    </div>
  );
}
