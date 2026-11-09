import { useId } from "react";

// Logo propio de IAE School Guide: un búho con brújulas en los ojos, porque te guía por el colegio.
// Es inventado, no es el logo oficial del IAE. El mismo dibujo está en icon.svg (pestaña del navegador).
export function LogoApp({ className = "size-9" }: { className?: string }) {
  // Cada logo necesita su propio degradado: en celular el del menú lateral está oculto.
  const fondo = useId();
  return (
    <svg viewBox="0 0 64 64" className={`shrink-0 drop-shadow-md ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={fondo} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#7e22ce" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${fondo})`} />
      <path d="M12 12l12 8q8-3 16 0l12-8v28q0 16-20 19-20-3-20-19z" fill="#1e1b4b" />
      <circle cx="23" cy="31" r="10.5" fill="#fff" />
      <circle cx="41" cy="31" r="10.5" fill="#fff" />
      <g transform="rotate(40 23 31)">
        <path d="M23 22l3 9h-6z" fill="#f43f5e" />
        <path d="M20 31h6l-3 9z" fill="#4338ca" />
      </g>
      <g transform="rotate(40 41 31)">
        <path d="M41 22l3 9h-6z" fill="#f43f5e" />
        <path d="M38 31h6l-3 9z" fill="#4338ca" />
      </g>
      <path d="M32 40l4 5-4 5-4-5z" fill="#fbbf24" />
    </svg>
  );
}
