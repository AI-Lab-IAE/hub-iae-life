import { useId } from "react";

// Logo propio de IAE School Guide: una G de "Guide" con un avión de papel que sale volando de la letra.
// Es inventado, no es el logo oficial del IAE. El mismo dibujo está en icon.svg (pestaña del navegador).
export function LogoApp({ className = "size-9" }: { className?: string }) {
  // Cada logo necesita su propio degradado: en celular el del menú lateral está oculto.
  const fondo = useId();
  return (
    <svg viewBox="0 0 64 64" className={`shrink-0 drop-shadow-md ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={fondo} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#4338ca" />
          <stop offset="0.6" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${fondo})`} />
      <path d="M31 15A20 20 0 1 0 50 35H40" fill="none" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M60 5L38.5 13l7.5 4 4 7.5z" fill="#fde047" />
      <path d="M60 5L46 17l1.5 5.5 2.5 2z" fill="#fb923c" />
    </svg>
  );
}
