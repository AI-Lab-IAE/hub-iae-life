import Link from "next/link";
import { BorrarDatos } from "./components/BorrarDatos";
import { botonPrimario, botonSecundario, tarjeta } from "./components/estilos";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
      <h1 className="font-serif text-3xl font-bold tracking-tight">
        Estud<span className="bg-[#ffe45c] px-1">IA</span>
      </h1>
      <p className="mt-2 text-[#4a5475]">Encuentra lo que no sabes antes del examen.</p>

      <div className={`${tarjeta} mt-8 p-6 sm:p-8`}>
        <p className="leading-relaxed text-[#4a5475]">
          Sube tus apuntes (foto, PDF o texto) y la IA los divide en temas y arma un quiz corto por cada uno. Con tus
          respuestas, y qué tan seguro estabas de cada una, EstudIA te muestra un mapa de 4 niveles: lo dominas, frágil,
          por aprender y <strong className="text-[#15203b]">punto ciego</strong> — cuando respondiste con confianza
          pero estabas mal. Así sabes justo qué repasar antes del examen, no después.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/marco/estudiar" className={`${botonPrimario} px-6 py-3`}>
            Subir mis apuntes →
          </Link>
          <Link href="/marco/estudiar?ejemplo=1" className={`${botonSecundario} px-6 py-3`}>
            Probar con un ejemplo
          </Link>
        </div>
        <p className="mt-4 text-sm text-[#7c849e]">
          Por ahora, sin cuenta: tus diagnósticos se guardan solo en este navegador.
        </p>
      </div>

      <BorrarDatos />
    </main>
  );
}
