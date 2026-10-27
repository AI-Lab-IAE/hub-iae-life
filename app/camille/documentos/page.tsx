import { EncabezadoSeccion } from "../components/EncabezadoSeccion";
import { documentos } from "../datos";

const tipos = [
  { tipo: "Reglamento", titulo: "Reglamentos" },
  { tipo: "Formato", titulo: "Formatos" },
  { tipo: "Circular", titulo: "Circulares" },
] as const;

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <EncabezadoSeccion ruta="documentos" />
      {tipos.map(({ tipo, titulo }) => (
        <section key={tipo} className="mt-8">
          <h2 className="text-lg font-semibold">{titulo}</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {documentos
              .filter((d) => d.tipo === tipo)
              .map((d) => (
                <li
                  key={d.titulo}
                  className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <h3 className="font-medium">📄 {d.titulo}</h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{d.descripcion}</p>
                  <p className="mt-2 text-sm text-zinc-500">Dónde se pide: {d.dondeSePide}</p>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
