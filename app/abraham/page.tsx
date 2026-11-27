import type { Metadata } from "next";
import { Megaphone } from "lucide-react";
import { Pantalla } from "../_life/Pantalla";
import { AvisoYa } from "./components/AvisoYa";

export const metadata: Metadata = { title: "Avisos" };

// Avisos: el único lugar de IAE LIFE para los avisos del colegio. Todo pasa dentro de la app.
export default function Page() {
  return (
    <Pantalla
      icono={Megaphone}
      titulo="Avisos"
      texto="El profesor manda un aviso a un salón, un grado o un estudiante; cada estudiante lo marca como visto y el profesor ve quién falta."
    >
      <AvisoYa />
      <p className="mt-8 text-center text-xs text-azul-900/45">Vista previa: datos inventados, guardados solo en tu navegador.</p>
    </Pantalla>
  );
}
