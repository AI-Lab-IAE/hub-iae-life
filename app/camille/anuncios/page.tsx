import { EncabezadoSeccion } from "../components/EncabezadoSeccion";
import { anuncios } from "../datos";
import { formatearFecha } from "../formato";

export default function Page() {
  // El más reciente primero.
  const ordenados = [...anuncios].sort((a, b) => b.fecha.localeCompare(a.fecha));

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <EncabezadoSeccion ruta="anuncios" />
      <ul className="mt-6 flex flex-col gap-3">
        {ordenados.map((a) => (
          <li
            key={a.titulo}
            className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex flex-wrap items-center gap-2">
              <time dateTime={a.fecha} className="text-sm text-zinc-500">
                {formatearFecha(a.fecha)}
              </time>
              {a.importante && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-950 dark:text-red-200">
                  Importante
                </span>
              )}
            </div>
            <h2 className="mt-1 font-semibold">{a.titulo}</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{a.texto}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
