import Link from "next/link";

export default function NoEncontrada() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-mono text-sm font-semibold text-azul-600">404</p>
      <h1 className="mt-2 text-3xl font-bold text-azul-950">Esta página no existe</h1>
      <p className="mt-3 text-azul-900/60">Puede que el enlace esté mal escrito o que la función todavía no esté lista.</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-azul-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-azul-700"
      >
        Volver a IAE LIFE
      </Link>
    </main>
  );
}
