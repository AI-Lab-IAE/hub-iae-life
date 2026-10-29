import Link from "next/link";

// Barra superior de IAE LIFE, con la marca (un cubo 3D que gira) y los enlaces.
export default function BarraHub({ actual }: { actual: "inicio" | "coordinador" | "creditos" }) {
  const enlace = (activo: boolean) =>
    `rounded-full px-4 py-2 transition-colors ${activo ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav className="hub-vidrio mx-auto flex max-w-6xl items-center justify-between rounded-full py-2 pl-4 pr-2 text-sm">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-wide text-white">
          <span className="hub-cubo" aria-hidden>
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
          IAE LIFE
        </Link>
        <div className="flex items-center gap-1">
          <Link href="/#funciones" className={`hidden sm:block ${enlace(false)}`}>
            Funciones
          </Link>
          <Link href="/creditos" className={enlace(actual === "creditos")}>
            Créditos
          </Link>
          <Link href="/coordinador" className={`hidden sm:block ${enlace(actual === "coordinador")}`}>
            Coordinador
          </Link>
        </div>
      </nav>
    </header>
  );
}
