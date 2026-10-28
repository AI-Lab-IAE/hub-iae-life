import type { Metadata, Viewport } from "next";
import { BarraPestanas } from "./components/BarraPestanas";
import { BarraSuperior } from "./components/BarraSuperior";
import { MenuLateral } from "./components/MenuLateral";
import { info } from "./info";

export const metadata: Metadata = {
  title: info.proyecto,
  description: info.descripcion,
};

// Color de la barra del navegador en el celular.
export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

// Estructura de la app: menú lateral (computadora), barra superior, contenido y pestañas abajo (celular).
export default function Layout({ children }: LayoutProps<"/camille">) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-indigo-50/60 text-slate-800 dark:bg-slate-950 dark:text-slate-100 sm:pl-24">
      <MenuLateral />
      <BarraSuperior />
      <div className="flex flex-1 flex-col pb-24 sm:pb-10">{children}</div>
      <BarraPestanas />
    </div>
  );
}
