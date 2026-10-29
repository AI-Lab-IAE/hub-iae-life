import Link from "next/link";

// Título de un bloque del inicio, con un enlace opcional "Ver todo".
export function TituloBloque({ titulo, href }: { titulo: string; href?: string }) {
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{titulo}</h2>
      {href && (
        <Link href={href} className="text-sm font-medium text-indigo-700 hover:text-indigo-700 dark:text-indigo-400">
          Ver todo
        </Link>
      )}
    </div>
  );
}
