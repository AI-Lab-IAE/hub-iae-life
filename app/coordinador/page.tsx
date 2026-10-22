import type { Metadata } from "next";
import { modulos } from "../modulos";

export const metadata: Metadata = {
  title: "Coordinador · HUB IAE LIFE",
};

const REPO = "https://github.com/AI-Lab-IAE/hub-iae-life";
const BOTON = `${REPO}/actions/workflows/crear-iae-life.yml`;
const TEXTO_PLANTILLA = "Escribe aquí";

// Página del coordinador. La mantiene Jose David.
export default function Coordinador() {
  const conTarjeta = modulos.filter(
    (m) => m.proyecto !== "Por definir" && !m.descripcion.startsWith(TEXTO_PLANTILLA),
  ).length;

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight">Coordinador</h1>
      <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
        Avance de los módulos y creación de la app final IAE LIFE.
      </p>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Módulos</h2>
        <p className="mt-1 text-zinc-500">
          {conTarjeta} de {modulos.length} tienen su tarjeta completa. Que un módulo esté terminado lo
          decides tú al revisar sus PRs.
        </p>
        <ul className="mt-4 divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {modulos.map((m) => {
            const completa = m.proyecto !== "Por definir" && !m.descripcion.startsWith(TEXTO_PLANTILLA);
            return (
              <li key={m.slug} className="flex flex-wrap items-center justify-between gap-2 p-4">
                <div>
                  <a href={`/${m.slug}`} className="font-semibold hover:underline">
                    {m.proyecto}
                  </a>
                  <span className="text-zinc-500"> · {m.estudiante}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span
                    className={
                      completa
                        ? "rounded-full bg-emerald-100 px-3 py-1 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : "rounded-full bg-amber-100 px-3 py-1 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                    }
                  >
                    {completa ? "Tarjeta completa" : "Falta su tarjeta"}
                  </span>
                  <a
                    href={`${REPO}/pulls?q=is%3Apr+head%3A${m.slug}%2F`}
                    className="text-zinc-500 hover:underline"
                  >
                    Sus PRs
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-12 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="text-2xl font-semibold">Crear IAE LIFE</h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Cuando los módulos estén listos, este botón pone a Claude Code a unirlos en una sola app llamada IAE LIFE:
          nombre, navegación, portada, créditos y diseño común. Los módulos incompletos entran como
          &quot;Próximamente&quot;.
        </p>
        <ol className="mt-4 list-decimal space-y-1 pl-5 text-zinc-600 dark:text-zinc-400">
          <li>Pulsa el botón. Se abre GitHub (entra con la cuenta josesaldana-collab).</li>
          <li>
            Pulsa <strong>Run workflow</strong> y otra vez <strong>Run workflow</strong>.
          </li>
          <li>En unos minutos llega un PR &quot;Crear IAE LIFE&quot; con su enlace de vista previa. No se publica nada hasta que lo unas.</li>
        </ol>
        <a
          href={BOTON}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-lg bg-zinc-900 px-6 py-3 font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Crear IAE LIFE →
        </a>
        <p className="mt-3 text-sm text-zinc-500">
          Solo funciona con la cuenta del coordinador. Cada ejecución usa la API de Anthropic y tiene costo.
        </p>
      </section>
    </main>
  );
}
