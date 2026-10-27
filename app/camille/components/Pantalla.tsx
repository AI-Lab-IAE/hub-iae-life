import type { ReactNode } from "react";
import anim from "../animaciones.module.css";

// Contenedor de cada sección: aparece deslizándose al entrar.
export function Pantalla({ children }: { children: ReactNode }) {
  return <main className={`mx-auto w-full max-w-4xl flex-1 px-4 py-6 ${anim.aparecer}`}>{children}</main>;
}
