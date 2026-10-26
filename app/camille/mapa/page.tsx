import { EncabezadoSeccion } from "../components/EncabezadoSeccion";
import { pisos } from "../datos";

const iconos: Record<string, string> = {
  Acceso: "🚪",
  Oficina: "🏢",
  Servicio: "🛎️",
  Exterior: "🌳",
  Salón: "📚",
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <EncabezadoSeccion ruta="mapa" />
      <div className="mt-6 flex flex-col gap-4">
        {/* Del piso más alto al más bajo, como se ve un edificio. */}
        {[...pisos].reverse().map((piso) => (
          <section
            key={piso.nombre}
            className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="font-semibold">{piso.nombre}</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {piso.lugares.map((l) => (
                <li key={l.nombre} className="rounded-xl bg-zinc-100 px-3 py-2 text-sm dark:bg-zinc-800">
                  <span aria-hidden="true">{iconos[l.tipo]}</span> {l.nombre}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
