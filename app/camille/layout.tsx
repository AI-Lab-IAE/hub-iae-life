import type { Metadata, Viewport } from "next";
import { BarraPestanas } from "./components/BarraPestanas";
import { BarraSuperior } from "./components/BarraSuperior";
import { info } from "./info";

export const metadata: Metadata = {
  title: info.proyecto,
  description: info.descripcion,
};

// Color de la barra del navegador en el celular.
export const viewport: Viewport = {
  themeColor: "#0ea5e9",
};

// Estructura de la app: barra superior, contenido y pestañas abajo.
export default function Layout({ children }: LayoutProps<"/camille">) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-sky-50/70 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <BarraSuperior />
      <div className="flex flex-1 flex-col pb-24 sm:pb-10">{children}</div>
      <BarraPestanas />
    </div>
  );
}
