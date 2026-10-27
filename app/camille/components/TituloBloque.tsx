import Link from "next/link";

// Título de un bloque del inicio, con un enlace opcional "Ver todo".
export function TituloBloque({ titulo, href }: { titulo: string; href?: string }) {
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">{titulo}</h2>
      {href && (
        <Link href={href} className="text-sm font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400">
          Ver todo
        </Link>
      )}
    </div>
  );
}
