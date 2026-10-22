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
              <span className="text-xl font-semibold">{m.proyecto}</span>
              <span className="mt-1 block text-zinc-500">de {m.estudiante}</span>
              <span className="mt-3 block text-zinc-600 dark:text-zinc-400">{m.descripcion}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-12 text-sm text-zinc-500">
        <Link href="/coordinador" className="hover:underline">
          Coordinador
        </Link>
      </p>
    </main>
  );
}
