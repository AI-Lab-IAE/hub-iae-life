import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Pantalla } from "../_life/Pantalla";
import { BorrarDatos } from "./components/BorrarDatos";
import { botonPrimario, botonSecundario, tarjeta } from "./components/estilos";

export const metadata: Metadata = { title: "Estudiar" };

export default function Page() {
  return (
    <Pantalla icono={BookOpen} titulo="Estudiar" texto="Encuentra lo que no sabes antes del examen.">
      <div className={`${tarjeta} p-6 sm:p-8`}>
        <p className="leading-relaxed text-azul-900/70">
          Sube tus apuntes (foto, PDF o texto) y la IA los divide en temas y arma un quiz corto por cada uno. Con tus
          respuestas, y qué tan seguro estabas de cada una, te mostramos un mapa de 4 niveles: lo dominas, frágil, por
          aprender y <strong className="text-azul-950">punto ciego</strong> — cuando respondiste con confianza pero
          estabas mal. Así sabes justo qué repasar antes del examen, no después.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/marco/estudiar" className={`${botonPrimario} px-6 py-3`}>
            Subir mis apuntes →
          </Link>
          <Link href="/marco/estudiar?ejemplo=1" className={`${botonSecundario} px-6 py-3`}>
            Probar con un ejemplo
          </Link>
        </div>
        <p className="mt-4 text-sm text-azul-900/55">Tus diagnósticos se guardan solo en este navegador.</p>
      </div>

      <BorrarDatos />
    </Pantalla>
  );
}
