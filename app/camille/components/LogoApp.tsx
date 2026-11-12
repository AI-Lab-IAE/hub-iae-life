import { useId } from "react";

// Logo propio de la app: un 101 con birrete sobre el cero y las letras IAE. "101" es la clase de introducción a un tema.
// Es inventado, no es el logo oficial del IAE. El mismo dibujo está en icon.svg (pestaña del navegador).
export function LogoApp({ className = "size-8" }: { className?: string }) {
  // Cada logo necesita su propio degradado: en celular el del menú lateral está oculto.
  const fondo = useId();
  const numero = "M9.5 27l6-4v23M32 21.500c5 0 9 5.6 9 12.500s-4 12.5-9 12.5-9-5.6-9-12.5 4-12.5 9-12.500zM48.5 27l6-4v23";
  return (
    <svg viewBox="0 0 64 64" className={`shrink-0 drop-shadow-md ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={fondo} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#3730a3" />
          <stop offset="0.6" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${fondo})`} />
      <path d="M11 6l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.500z" fill="#67e8f9" />
      <g fill="none" strokeWidth="6.2" strokeLinecap="round" strokeLinejoin="round">
        <path d={numero} stroke="#1e1b4b" transform="translate(1.5 1.8)" />
        <path d={numero} stroke="#fff" />
      </g>
      <g transform="rotate(-12 32 15)">
        <path d="M23 18v5c5 3.5 13 3.5 18 0v-5l-9 4.200z" fill="#f59e0b" />
        <path d="M32 6l17 7.8-17 7.8-17-7.800z" fill="#fde047" />
        <path d="M49 13.800v9" stroke="#fde047" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="49" cy="24.5" r="2.4" fill="#22d3ee" />
      </g>
      <rect x="18" y="51" width="28" height="10" rx="5" fill="#fde047" />
      <path d="M24 53.200v5.600M27.5 58.800l2.9-5.6 2.9 5.600M28.6 57h3.600M40.5 53.200H36.500v5.600h4M36.5 56h3.4" fill="none" stroke="#312e81" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
