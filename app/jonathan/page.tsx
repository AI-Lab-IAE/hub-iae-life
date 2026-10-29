import { info } from "./info";
import AvisIA from "./components/AvisIA";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
      <h1 className="text-3xl font-bold">{info.proyecto}</h1>
      <p className="mt-1 text-zinc-500">de {info.estudiante}</p>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">{info.descripcion}</p>
      <AvisIA />
    </main>
  );
}
