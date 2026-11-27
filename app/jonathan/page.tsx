import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { Pantalla } from "../_life/Pantalla";
import AvisIA from "./components/AvisIA";

export const metadata: Metadata = { title: "Faltar" };

export default function Page() {
  return (
    <Pantalla
      icono={Mail}
      titulo="Faltar"
      texto="Dinos el día y escribimos un correo para cada profesor. Tú lo revisas y lo envías."
      ancho="angosto"
    >
      <AvisIA />
    </Pantalla>
  );
}
