import { EncabezadoSeccion } from "../components/EncabezadoSeccion";
import { horarios, reglas, servicios } from "../datos";

const caja = "rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <EncabezadoSeccion ruta="informacion" />

      <section className="mt-8">
        <h2 className="text-lg font-semibold">🕒 Horarios</h2>
        <dl className={`${caja} mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm`}>
          {horarios.map((h) => (
            <div key={h.que} className="contents">
              <dt className="text-zinc-500">{h.que}</dt>
              <dd className="font-medium">{h.cuando}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">📋 Reglas básicas</h2>
        <ul className={`${caja} mt-3 list-disc space-y-2 pl-8 text-sm`}>
          {reglas.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">🛎️ Servicios</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {servicios.map((s) => (
            <li key={s.nombre} className={caja}>
              <h3 className="font-medium">{s.nombre}</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{s.detalle}</p>
              <p className="mt-2 text-sm text-zinc-500">Horario: {s.horario}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
