// Marca de IAE LIFE: un escudo redondo en azul IAE con una chispa, y el nombre.
// No usa el logo oficial del colegio (el repositorio es público); el azul es el del escudo.
export function Emblema({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <defs>
        <linearGradient id="life-emblema" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2c55c4" />
          <stop offset="1" stopColor="#172f6c" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="19" fill="url(#life-emblema)" />
      <circle cx="20" cy="20" r="15.5" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="1" />
      <text
        x="20"
        y="24"
        textAnchor="middle"
        fontSize="11"
        fontWeight="800"
        letterSpacing="0.5"
        fill="#fff"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        IAE
      </text>
      <path d="M29 8.5l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z" fill="#c9d8f9" />
    </svg>
  );
}

export function Marca({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <Emblema />
      <span className="text-lg font-extrabold tracking-tight text-azul-900">
        IAE{" "}
        <span className="bg-linear-to-r from-azul-500 to-azul-800 bg-clip-text text-transparent">LIFE</span>
      </span>
    </span>
  );
}
