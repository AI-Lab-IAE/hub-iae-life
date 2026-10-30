import Link from "next/link";
import type { Page } from "../lib/tipos";
import { Icon, type IconComponent } from "./Iconos";

/* ---------- Navegación ---------- */

const NAV_ITEMS: { id: Page; label: string; icon: IconComponent }[] = [
  { id: "inicio", label: "Inicio", icon: Icon.home },
  { id: "reportar", label: "Reportar ausencia", icon: Icon.plus },
  { id: "historial", label: "Historial", icon: Icon.history },
  { id: "horario", label: "Horario", icon: Icon.calendar },
  { id: "perfil", label: "Perfil", icon: Icon.user },
];

type NavProps = { page: Page; setPage: (p: Page) => void };

export function Sidebar({ page, setPage }: NavProps) {
  return (
    <div className="sidebar">
      <div className="brand">
        <div className="brand-mark">A</div>
        <div>
          <div className="brand-name">AvisIA</div>
          <div className="brand-tag">Avisa en segundos</div>
        </div>
      </div>
      {NAV_ITEMS.map((item) => {
        const Ic = item.icon;
        return (
          <button
            key={item.id}
            className={"nav-item" + (page === item.id ? " active" : "")}
            onClick={() => setPage(item.id)}
          >
            <Ic className="nav-icon" />
            {item.label}
          </button>
        );
      })}
      <div className="sidebar-footer">
        Prototipo para Desafío IA 2026.
        <br />
        Construido con Claude (Anthropic).
        <br />
        <Link href="/">← Volver al HUB</Link>
      </div>
    </div>
  );
}

export function MobileNav({ page, setPage }: NavProps) {
  return (
    <div className="mobile-nav">
      {NAV_ITEMS.map((item) => {
        const Ic = item.icon;
        return (
          <button
            key={item.id}
            className={"mobile-nav-item" + (page === item.id ? " active" : "")}
            onClick={() => setPage(item.id)}
          >
            <Ic className="nav-icon" style={{ width: 20, height: 20 }} />
            {item.label.split(" ")[0]}
          </button>
        );
      })}
    </div>
  );
}

export function TopMobileBrand() {
  return (
    <div className="top-mobile-brand">
      <div className="brand-mark">A</div>
      <div>
        <div className="display" style={{ fontSize: 17 }}>
          AvisIA
        </div>
      </div>
    </div>
  );
}
