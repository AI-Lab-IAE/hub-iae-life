import { useId } from "react";

// Logo propio de IAE School Guide: una G de "Guide" con una aguja de brújula que se sale de la letra.
// Es inventado, no es el logo oficial del IAE. El mismo dibujo está en icon.svg (pestaña del navegador).
export function LogoApp({ className = "size-9" }: { className?: string }) {
  // Cada logo necesita sus propios degradados: en celular el del menú lateral está oculto.
  const id = useId();
  const fondo = `${id}fondo`;
  const aguja = `${id}aguja`;
  return (
    <svg viewBox="0 0 64 64" className={`shrink-0 drop-shadow-md ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={fondo} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a855f7" />
          <stop offset="0.55" stopColor="#4f46e5" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id={aguja} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde047" />
          <stop offset="1" stopColor="#fb7185" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${fondo})`} />
      <path d="M43.5 15.6A20 20 0 1 0 52 32H42" fill="none" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      <g transform="rotate(63 32 32)">
        <path d="M32 4l4.5 28h-9z" fill={`url(#${aguja})`} />
        <path d="M27.5 32h9L32 45z" fill="#ddd6fe" />
      </g>
    </svg>
  );
}
