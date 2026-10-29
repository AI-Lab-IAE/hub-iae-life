// Plano del colegio visto desde arriba. Es un DIBUJO INVENTADO para el ejemplo.
// Si el coordinador autoriza una foto real, se cambia este dibujo por la foto
// y se ubican los pines con el modo "Ubicar" del mapa.
export function PlanoColegio() {
  return (
    <svg viewBox="0 0 100 70" className="absolute inset-0 size-full" role="img" aria-label="Plano inventado del colegio, visto desde arriba">
      {/* Terreno y caminos */}
      <rect width="100" height="70" className="fill-emerald-50 dark:fill-emerald-950/40" />
      <path d="M50 70V60M4 32h92M50 32v4" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="3" fill="none" />

      {/* Edificio Prueba A */}
      <rect x="5" y="6" width="47" height="22" rx="1.5" className="fill-white stroke-indigo-300 dark:fill-slate-800 dark:stroke-indigo-700" strokeWidth="0.6" />
      <path d="M17 6v22M29 6v22M41 6v22" className="stroke-indigo-100 dark:stroke-slate-700" strokeWidth="0.4" />
      <text x="28.5" y="10" textAnchor="middle" className="fill-indigo-400" fontSize="2.4" fontWeight="600">EDIFICIO PRUEBA A</text>

      {/* Edificio Prueba B */}
      <rect x="62" y="6" width="33" height="22" rx="1.5" className="fill-white stroke-indigo-300 dark:fill-slate-800 dark:stroke-indigo-700" strokeWidth="0.6" />
      <path d="M80 6v22" className="stroke-indigo-100 dark:stroke-slate-700" strokeWidth="0.4" />
      <text x="78.5" y="10" textAnchor="middle" className="fill-indigo-400" fontSize="2.4" fontWeight="600">EDIFICIO PRUEBA B</text>

      {/* Patio Prueba A */}
      <rect x="5" y="36" width="52" height="22" rx="2" className="fill-amber-50 stroke-amber-200 dark:fill-amber-950/40 dark:stroke-amber-900" strokeWidth="0.5" />
      <text x="31" y="56" textAnchor="middle" className="fill-amber-500" fontSize="2.4" fontWeight="600">PATIO PRUEBA A</text>

      {/* Cancha Prueba */}
      <rect x="63" y="37" width="31" height="20" rx="1" className="fill-emerald-200 dark:fill-emerald-900" />
      <rect x="65" y="39" width="27" height="16" className="stroke-white" strokeWidth="0.4" fill="none" />
      <path d="M78.5 39v16" className="stroke-white" strokeWidth="0.4" />
      <circle cx="78.5" cy="47" r="3" className="stroke-white" strokeWidth="0.4" fill="none" />
      <text x="78.5" y="61" textAnchor="middle" className="fill-emerald-600" fontSize="2.2" fontWeight="600">CANCHA PRUEBA</text>

      {/* Árboles */}
      {[
        [58, 4],
        [58, 44],
        [97, 33],
        [3, 62],
        [40, 64],
        [62, 64],
        [90, 64],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" className="fill-emerald-300 dark:fill-emerald-800" />
      ))}

      {/* Entrada */}
      <rect x="45" y="66" width="10" height="4" rx="0.5" className="fill-slate-300 dark:fill-slate-600" />
    </svg>
  );
}
