import type { Metadata } from "next";
import { info } from "./info";
import AvisIA from "./components/AvisIA";

export const metadata: Metadata = {
  title: info.proyecto,
};

export default function Page() {
  return (
    <main className="relative flex-1 overflow-hidden bg-azul-50/60">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-linear-to-b from-azul-800 to-azul-700"
        aria-hidden
      />
      <div className="relative mx-auto max-w-2xl px-4 pb-12 pt-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-oro">¿Vas a faltar?</p>
        <h1 className="mt-1 text-4xl font-black tracking-tight text-white">{info.proyecto}</h1>
        <p className="mt-2 mb-6 max-w-md text-azul-100">
          Dinos el día y AvisIA escribe un correo para cada profesor. Tú lo revisas y lo envías.
        </p>
        <AvisIA />
      </div>
    </main>
  );
}
