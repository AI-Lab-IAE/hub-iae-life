import { secciones, type RutaSeccion } from "../secciones";
import { colorSeccion } from "./estilos";
import { Icono } from "./Icono";

// Encabezado común de cada sección: panel índigo con el ícono, la descripción,
// el aviso de datos ficticios y una explicación corta de cómo usar la sección.
// La flecha para regresar está en la barra superior.
export function EncabezadoSeccion({ ruta }: { ruta: RutaSeccion }) {
  const seccion = secciones.find((s) => s.ruta === ruta)!;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="relative overflow-hidden bg-linear-to-br from-indigo-500 via-indigo-600 to-indigo-700 p-5 text-white">
        <span className="absolute -top-10 -right-10 size-36 rounded-full bg-white/5" aria-hidden="true" />
        <div className="relative flex items-center gap-4">
          <span className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ring-4 ring-white/10 ${colorSeccion[ruta]}`}>
            <Icono nombre={seccion.icono} className="size-7" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{seccion.nombre}</h1>
            <p className="text-sm text-indigo-100/90">{seccion.descripcion}</p>
          </div>
        </div>
        <span className="relative mt-4 inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white ring-1 ring-white/25">
          Datos de ejemplo, ficticios
        </span>
      </div>
      <p className="flex gap-3 p-4 text-sm text-slate-600 dark:text-slate-300">
        <Icono nombre="informacion" className="size-5 shrink-0 text-indigo-500" />
        <span>
          <strong className="font-semibold text-slate-900 dark:text-slate-100">Cómo se usa: </strong>
          {seccion.explicacion}
        </span>
      </p>
    </div>
  );
}
