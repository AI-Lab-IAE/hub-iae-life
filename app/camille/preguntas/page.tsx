import anim from "../animaciones.module.css";
import { EncabezadoSeccion } from "../components/EncabezadoSeccion";
import { Icono } from "../components/Icono";
import { Pantalla } from "../components/Pantalla";
import { TituloBloque } from "../components/TituloBloque";
import { retraso, tarjeta } from "../components/estilos";
import { preguntas } from "../datos";

const temas = ["Primeros días", "Trámites", "Organización"] as const;

export default function Page() {
  return (
    <Pantalla>
      <EncabezadoSeccion ruta="preguntas" />

      {temas.map((tema, t) => (
        <section key={tema} className={`mt-8 ${anim.aparecer}`} style={retraso(t + 1)}>
          <TituloBloque titulo={tema} />
          <div className={`${tarjeta} divide-y divide-slate-100 dark:divide-slate-800`}>
            {preguntas
              .filter((p) => p.tema === tema)
              .map((p) => (
                <details key={p.pregunta} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 font-semibold [&::-webkit-details-marker]:hidden">
                    {p.pregunta}
                    <Icono nombre="adelante" className="size-4 shrink-0 text-slate-400 transition duration-300 group-open:rotate-90" />
                  </summary>
                  <p className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300">{p.respuesta}</p>
                </details>
              ))}
          </div>
        </section>
      ))}
    </Pantalla>
  );
}
