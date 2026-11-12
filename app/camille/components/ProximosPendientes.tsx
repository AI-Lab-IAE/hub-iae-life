"use client";

import Link from "next/link";
import { tarjeta } from "./estilos";
import { BotonHecho, EtiquetaEntrega } from "./PartesPendiente";
import { usePendientes } from "./pendientes";

// Bloque del inicio con los tres pendientes más próximos.
export function ProximosPendientes() {
  const { listo, pendientes } = usePendientes();
  if (!listo) return <div className={`${tarjeta} h-24 animate-pulse`} />;

  const proximos = pendientes.filter((p) => !p.hecho).slice(0, 3);

  if (proximos.length === 0) {
    return (
      <Link href="/camille/pendientes" className={`${tarjeta} block p-4 text-center text-sm text-slate-500 dark:text-slate-400`}>
        No tienes pendientes. <span className="font-semibold text-indigo-700 dark:text-indigo-300">Anota tu primera tarea</span>
      </Link>
    );
  }

  return (
    <ul className={`${tarjeta} divide-y divide-slate-100 dark:divide-slate-800`}>
      {proximos.map((p) => (
        <li key={p.id} className="flex items-center gap-3 p-3">
          <BotonHecho pendiente={p} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">{p.titulo}</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400">
              {p.materia || p.tipo} <EtiquetaEntrega pendiente={p} />
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
