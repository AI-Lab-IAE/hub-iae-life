"use client";

import { useEffect, useState } from "react";
import { ESTADOS, type Estado, type Seguridad } from "../lib/mapa";

export function Insignia({ estado, grande = false }: { estado: Estado; grande?: boolean }) {
  const e = ESTADOS[estado];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full font-semibold ${grande ? "px-3 py-1.5 text-sm" : "px-2.5 py-1 text-xs"}`}
      style={{ color: e.color, background: e.fondo }}
    >
      <span className="size-1.5 rounded-full" style={{ background: e.color }} />
      {e.nombre}
    </span>
  );
}

const OPCIONES_SEGURIDAD: { valor: Seguridad; titulo: string; detalle: string }[] = [
  { valor: "seguro", titulo: "Seguro", detalle: "Lo sé" },
  { valor: "dudo", titulo: "Dudo", detalle: "Creo que sí" },
  { valor: "adivino", titulo: "Adivino", detalle: "Ni idea" },
];

export function SelectorSeguridad({
  valor,
  onCambio,
  deshabilitado,
}: {
  valor: Seguridad | undefined;
  onCambio: (s: Seguridad) => void;
  deshabilitado?: boolean;
}) {
  return (
    <fieldset disabled={deshabilitado}>
      <legend className="mb-2.5 text-sm font-medium text-[#4a5475]">¿Qué tan seguro estás?</legend>
      <div className="grid grid-cols-3 gap-2">
        {OPCIONES_SEGURIDAD.map((o) => {
          const activo = valor === o.valor;
          return (
            <button
              key={o.valor}
              type="button"
              onClick={() => onCambio(o.valor)}
              aria-pressed={activo}
              className={`rounded-2xl border px-3 py-3 text-left transition-all disabled:cursor-default ${
                activo
                  ? "border-[#15203b] bg-[#15203b] text-[#faf7f0] shadow-[0_4px_0_-1px_#ffe45c]"
                  : "border-[#d6ccb6] bg-[#fffdf8] hover:border-[#7c849e]"
              }`}
            >
              <span className="block font-semibold">{o.titulo}</span>
              <span className={`block text-xs ${activo ? "text-[#faf7f0]/70" : "text-[#7c849e]"}`}>{o.detalle}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Aviso({ children, tipo = "error" }: { children: React.ReactNode; tipo?: "error" | "info" }) {
  return (
    <div
      role={tipo === "error" ? "alert" : "status"}
      className="rounded-2xl border px-4 py-3 text-sm leading-relaxed"
      style={
        tipo === "error"
          ? { borderColor: "#e0492f", background: "#fde6df", color: "#8a2a19" }
          : { borderColor: "#d6ccb6", background: "#f3eee2", color: "#4a5475" }
      }
    >
      {children}
    </div>
  );
}

export function Cargando({ pasos, titulo, onCancelar }: { pasos: string[]; titulo: string; onCancelar?: () => void }) {
  const [segundos, setSegundos] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const indice = Math.min(pasos.length - 1, Math.floor(segundos / 7));

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center py-16 text-center">
      <div className="relative size-24">
        <svg viewBox="0 0 100 100" className="size-24 animate-[spin_2.4s_linear_infinite]" aria-hidden>
          <circle cx="50" cy="50" r="42" fill="none" stroke="#e4dccb" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#15203b"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="70 200"
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center font-serif text-2xl">
          <span className="bg-[#ffe45c] px-1">IA</span>
        </span>
      </div>
      <h2 className="mt-8 font-serif text-3xl tracking-tight">{titulo}</h2>
      <ul className="mt-6 w-full space-y-2 text-left" aria-live="polite">
        {pasos.map((p, i) => (
          <li
            key={p}
            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all duration-500 ${
              i < indice
                ? "text-[#7c849e]"
                : i === indice
                  ? "bg-[#fffdf8] font-medium text-[#15203b] shadow-sm"
                  : "text-[#7c849e]/50"
            }`}
          >
            <span
              className={`grid size-5 shrink-0 place-items-center rounded-full text-[10px] ${
                i < indice ? "bg-[#1f9466] text-white" : i === indice ? "bg-[#ffe45c]" : "border border-[#d6ccb6]"
              }`}
            >
              {i < indice ? "✓" : ""}
            </span>
            {p}
          </li>
        ))}
      </ul>
      <p className="mt-6 font-mono text-xs text-[#7c849e]">{segundos}s · suele tardar entre 30 y 90 segundos</p>
      {onCancelar && (
        <button onClick={onCancelar} className="mt-4 text-sm text-[#4a5475] underline underline-offset-4 hover:text-[#15203b]">
          Cancelar
        </button>
      )}
    </div>
  );
}

export function Letra({ i }: { i: number }) {
  return <>{String.fromCharCode(65 + i)}</>;
}
