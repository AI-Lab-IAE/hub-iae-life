import Link from "next/link";
import { modulos } from "./modulos";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight">HUB IAE LIFE</h1>
      <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
        Proyectos del AI Lab del Instituto Alberto Einstein
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {modulos.map((m) => (
          <li key={m.slug}>
            <Link
              href={`/${m.slug}`}
              className="block rounded-xl border border-zinc-200 p-6 transition hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
            >
              <span className="text-xl font-semibold">Módulo de {m.estudiante}</span>
              <span className="mt-1 block text-zinc-500">/{m.slug}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
