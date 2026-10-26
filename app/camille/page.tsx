import { info } from "./info";
import { secciones } from "./secciones";
import { Tarjeta } from "./components/Tarjeta";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:py-12">
      <h1 className="text-3xl font-bold">{info.proyecto}</h1>
      <p className="mt-1 text-zinc-500">de {info.estudiante}</p>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">{info.descripcion}</p>

      <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200">
        Los datos de esta guía son de ejemplo y ficticios.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {secciones.map((s) => (
          <Tarjeta key={s.ruta} {...s} />
        ))}
      </div>
    </main>
  );
}
