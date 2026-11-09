// Logo propio de IAE School Guide: un pin de mapa con un birrete. Es inventado, no es el logo oficial del IAE.
// El mismo dibujo está en icon.svg, que es el ícono de la pestaña del navegador.
export function LogoApp({ className = "size-9 rounded-xl" }: { className?: string }) {
  return (
    <span className={`flex shrink-0 items-center justify-center bg-linear-to-br from-indigo-400 to-indigo-700 shadow-md shadow-indigo-500/30 ${className}`}>
      <svg viewBox="0 0 24 24" className="size-[78%]" aria-hidden="true">
        <path d="M12 22.5s-8-6.9-8-12.8a8 8 0 0 1 16 0c0 5.9-8 12.8-8 12.8z" fill="#fff" />
        <path d="M12 5.2l5.6 2.8-5.6 2.8L6.4 8z" fill="#4338ca" />
        <path d="M8.8 10.2v2.2c1.8 1.5 4.6 1.5 6.4 0v-2.2L12 11.8z" fill="#4338ca" />
        <path d="M17.6 8v3.6" stroke="#a78bfa" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    </span>
  );
}
