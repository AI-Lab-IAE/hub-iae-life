import type { ReactNode } from "react";
import anim from "../animaciones.module.css";

// Contenedor de cada sección: entra deslizándose desde la derecha.
export function Pantalla({ children }: { children: ReactNode }) {
  return <main className={`mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-8 ${anim.entrar}`}>{children}</main>;
}
