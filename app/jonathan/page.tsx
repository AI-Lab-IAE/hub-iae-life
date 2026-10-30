import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import AvisIACliente from "./components/AvisIACliente";
import { info } from "./info";
import "./avisia.css";

const titulo = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-avisia-titulo" });
const texto = Inter({ subsets: ["latin"], variable: "--font-avisia-texto" });

export const metadata: Metadata = {
  title: `${info.proyecto} — Avisa a tus profesores en segundos`,
  description: info.descripcion,
};

export default function Page() {
  return (
    <div className={`avisia ${titulo.variable} ${texto.variable}`}>
      <AvisIACliente />
    </div>
  );
}
