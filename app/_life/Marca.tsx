// Marca de IAE LIFE: el escudo del Instituto Alberto Einstein y el nombre.
// Escudo del IAE recortado y centrado (public/img/escudo-iae.png, sacado de logo-iae-ib.png).
export function Emblema({ className = "size-9" }: { className?: string }) {
  return (
    <span className={`block shrink-0 ${className}`} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/escudo-iae.png" alt="" className="size-full object-contain" />
    </span>
  );
}

export function Marca({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <Emblema />
      <span className="text-lg font-extrabold tracking-tight text-azul-900">
        IAE <span className="bg-linear-to-r from-azul-500 to-azul-800 bg-clip-text text-transparent">LIFE</span>
      </span>
    </span>
  );
}
