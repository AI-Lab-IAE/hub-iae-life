import { EncabezadoSeccion } from "../components/EncabezadoSeccion";
import { contactos } from "../datos";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <EncabezadoSeccion ruta="contactos" />
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {contactos.map((c) => (
          <li
            key={c.correo}
            className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="font-semibold">{c.nombre}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{c.cargo}</p>
            <p className="mt-2 text-sm text-zinc-500">📍 {c.lugar}</p>
            <a
              href={`mailto:${c.correo}`}
              className="mt-1 block break-all text-sm text-blue-700 underline dark:text-blue-300"
            >
              {c.correo}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
