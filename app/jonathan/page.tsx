import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { Pantalla } from "../_life/Pantalla";
import AvisIA from "./components/AvisIA";

export const metadata: Metadata = { title: "Retoma" };

export default function Page() {
  return (
    <Pantalla
      icono={Mail}
      titulo="Retoma"
      texto="Si no vas a poder venir, escribimos un correo para cada profesor para que te pongas al día. Tú lo revisas y lo envías."
      ancho="angosto"
    >
      <AvisIA />
    </Pantalla>
  );
}
