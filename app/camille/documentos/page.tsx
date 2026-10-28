import anim from "../animaciones.module.css";
import { EncabezadoSeccion } from "../components/EncabezadoSeccion";
import { Icono } from "../components/Icono";
import { Pantalla } from "../components/Pantalla";
import { TituloBloque } from "../components/TituloBloque";
import { retraso, tarjeta } from "../components/estilos";
import { documentos } from "../datos";

const tipos = [
  { tipo: "Reglamento", titulo: "Reglamentos" },
  { tipo: "Formato", titulo: "Formatos" },
  { tipo: "Circular", titulo: "Circulares" },
] as const;

const pasos = [
  "Busca abajo el documento que necesitas.",
  "Ve a la oficina que dice «Dónde se pide».",
  "Pide el documento y entrégalo lleno donde te indiquen.",
];

export default function Page() {
  return (
    <Pantalla>
      <EncabezadoSeccion ruta="documentos" />

      {/* Cómo pedir un documento, en tres pasos */}
      <section className={`${tarjeta} mt-6 p-4 ${anim.aparecer}`} style={retraso(1)}>
        <h2 className="font-semibold">¿Cómo pido un documento?</h2>
        <ol className="mt-3 flex flex-col gap-2.5">
          {pasos.map((paso, i) => (
            <li key={paso} className="flex items-center gap-3 text-sm">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white">
                {i + 1}
              </span>
              {paso}
            </li>
          ))}
        </ol>
      </section>

      {tipos.map(({ tipo, titulo }, t) => {
        const lista = documentos.filter((d) => d.tipo === tipo);
        return (
          <section key={tipo} className={`mt-8 ${anim.aparecer}`} style={retraso(t + 2)}>
            <TituloBloque titulo={`${titulo} · ${lista.length}`} />
            <ul className="grid gap-3 sm:grid-cols-2">
              {lista.map((d) => (
                <li key={d.titulo} className={`${tarjeta} flex gap-3 p-4`}>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                    <Icono nombre="documentos" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold">{d.titulo}</span>
                    <span className="mt-0.5 block text-sm text-slate-500 dark:text-slate-400">{d.descripcion}</span>
                    <span className="mt-2 flex items-center gap-1.5 text-xs font-medium text-sky-700 dark:text-sky-300">
                      <Icono nombre="ubicacion" className="size-4" /> Dónde se pide: {d.dondeSePide}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <p className="mt-8 text-center text-xs text-slate-400">Pronto se podrán descargar los documentos desde aquí.</p>
    </Pantalla>
  );
}
