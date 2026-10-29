import { info } from "./info";
import { AvisoYa } from "./components/AvisoYa";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
      <h1 className="text-3xl font-bold">{info.proyecto}</h1>
      <p className="mt-1 text-zinc-500">de {info.estudiante}</p>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">{info.descripcion}</p>

      {/* La versión completa vive aparte porque usa base de datos, push e IA, que el HUB todavía no tiene. */}
      <a
        href="https://avisoya.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex min-h-11 flex-col gap-1 rounded-2xl border border-blue-300 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/40"
      >
        <span className="font-semibold text-blue-700 dark:text-blue-400">Abrir AvisoYa completo ↗</span>
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          La versión del Desafío IA, con notificaciones push reales en el celular, horario de clases y
          escalamiento con IA de los avisos urgentes que nadie vio.
        </span>
      </a>

      <h2 className="mt-10 text-xl font-semibold">Pruébalo aquí</h2>
      <p className="mt-1 text-sm text-zinc-500">Demo con datos inventados, guardados en tu navegador.</p>
      <AvisoYa />
    </main>
  );
}
