import { EncabezadoSeccion } from "../components/EncabezadoSeccion";
import { eventos } from "../datos";
import { formatearFecha } from "../formato";

const colores = {
  Examen: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
  Evento: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
  Vacaciones: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200",
};

export default function Page() {
  // El más próximo primero.
  const ordenados = [...eventos].sort((a, b) => a.fecha.localeCompare(b.fecha));

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <EncabezadoSeccion ruta="calendario" />
      <ul className="mt-6 flex flex-col gap-3">
        {ordenados.map((e) => (
          <li
            key={e.titulo}
            className="flex flex-col gap-1 rounded-2xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:gap-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <time dateTime={e.fecha} className="text-sm text-zinc-500 sm:w-48 sm:shrink-0">
              {formatearFecha(e.fecha)}
            </time>
            <span className="font-semibold sm:flex-1">{e.titulo}</span>
            <span className={`w-fit rounded-full px-2 py-0.5 text-xs font-medium ${colores[e.tipo]}`}>{e.tipo}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
