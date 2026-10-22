"use client";

import Link from "next/link";
import { useRef, type CSSProperties, type PointerEvent } from "react";

type Props = {
  href: string;
  numero: string;
  proyecto: string;
  estudiante: string;
  descripcion: string;
  color: string;
  completa: boolean;
};

// Tarjeta de un módulo que se inclina en 3D siguiendo el puntero.
export default function TarjetaModulo({ href, numero, proyecto, estudiante, descripcion, color, completa }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const mover = (e: PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 14}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 18}deg`);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };

  const salir = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <Link
      ref={ref}
      href={href}
      onPointerMove={mover}
      onPointerLeave={salir}
      className="hub-tarjeta group"
      style={{ "--color": color } as CSSProperties}
    >
      <span className="hub-tarjeta-borde" aria-hidden />
      <span className="hub-tarjeta-cuerpo">
        <span className="hub-tarjeta-brillo" aria-hidden />
        <span className="flex items-start justify-between">
          <span className="hub-orbe" aria-hidden />
          <span className="font-mono text-xs tracking-widest text-white/40">{numero}</span>
        </span>
        <span className="hub-capa mt-8 block text-2xl font-semibold text-white">{proyecto}</span>
        <span className="hub-capa mt-1 block text-sm text-white/50">de {estudiante}</span>
        <span className="hub-capa mt-4 block text-[15px] leading-relaxed text-white/70">{descripcion}</span>
        <span className="hub-capa mt-6 flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-white/60">
            <span
              className={`size-2 rounded-full ${completa ? "hub-latido bg-[var(--color)]" : "bg-white/30"}`}
              aria-hidden
            />
            {completa ? "En construcción" : "Idea por definir"}
          </span>
          <span className="font-medium text-[var(--color)] transition-transform duration-300 group-hover:translate-x-1">
            Abrir →
          </span>
        </span>
      </span>
    </Link>
  );
}
