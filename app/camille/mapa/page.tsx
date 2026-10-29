import anim from "../animaciones.module.css";
import { EncabezadoSeccion } from "../components/EncabezadoSeccion";
import { Icono } from "../components/Icono";
import { tiposLugar } from "../components/lugares";
import { MapaInteractivo } from "../components/MapaInteractivo";
import { Pantalla } from "../components/Pantalla";
import { TituloBloque } from "../components/TituloBloque";
import { retraso, tarjeta } from "../components/estilos";
import { pisos } from "../datos";

// "Planta baja" → "PB", "Primer piso" → "1", "Segundo piso" → "2".
const numeroPiso = ["PB", "1", "2", "3"];

export default function Page() {
  return (
    <Pantalla>
      <EncabezadoSeccion ruta="mapa" />

      <section className={`mt-6 ${anim.aparecer}`} style={retraso(1)}>
        <MapaInteractivo />
      </section>

      <section className={`mt-10 ${anim.aparecer}`} style={retraso(2)}>
        <TituloBloque titulo="Todos los lugares por piso" />
      </section>
      <div className="flex flex-col gap-4">
        {/* Del piso más alto al más bajo, como se ve un edificio. */}
        {pisos
          .map((piso, i) => ({ ...piso, numero: numeroPiso[i] }))
          .reverse()
          .map((piso, i) => (
            <section key={piso.nombre} className={`${tarjeta} overflow-hidden ${anim.aparecer}`} style={retraso(i + 2)}>
              <h2 className="flex items-center gap-3 border-b border-slate-100 bg-indigo-50/60 px-4 py-3 font-semibold dark:border-slate-800 dark:bg-indigo-950/40">
                <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
                  {piso.numero}
                </span>
                {piso.nombre}
                <span className="ml-auto text-xs font-normal text-slate-500 dark:text-slate-400">{piso.lugares.length} lugares</span>
              </h2>
              <ul className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2">
                {piso.lugares.map((l) => (
                  <li key={l.nombre} className="flex items-center gap-3 rounded-xl p-2">
                    <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${tiposLugar[l.tipo].color}`}>
                      <Icono nombre={tiposLugar[l.tipo].icono} className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{l.nombre}</span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400">{l.tipo}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </div>
    </Pantalla>
  );
}
