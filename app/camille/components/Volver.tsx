import Link from "next/link";

// Enlace para regresar a la página principal de la guía.
export function Volver() {
  return (
    <Link href="/camille" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
      ← Volver a la guía
    </Link>
  );
}
