import anim from "../animaciones.module.css";
import { Icono } from "../components/Icono";
import { tiposLugar } from "../components/lugares";
import { MapaInteractivo } from "../components/MapaInteractivo";
import { Seccion } from "../components/Seccion";
import { TituloBloque } from "../components/TituloBloque";
import { retraso, tarjeta } from "../components/estilos";
import { pisos } from "../datos";

// "Planta baja" → "PB", "Primer piso" → "1", "Segundo piso" → "2".
const numeroPiso = ["PB", "1", "2", "3"];

export default function Page() {
  return (
    <Seccion ruta="mapa">

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
              <h2 className="flex items-center gap-3 border-b border-azul-100 bg-azul-50/60 px-4 py-3 font-semibold">
                <span className="flex size-8 items-center justify-center rounded-lg bg-azul-800 text-sm font-bold text-white">
                  {piso.numero}
                </span>
                {piso.nombre}
                <span className="ml-auto text-xs font-normal text-azul-900/60">{piso.lugares.length} lugares</span>
              </h2>
              <ul className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2">
                {piso.lugares.map((l) => (
                  <li key={l.nombre} className="flex items-center gap-3 rounded-xl p-2">
                    <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${tiposLugar[l.tipo].color}`}>
                      <Icono nombre={tiposLugar[l.tipo].icono} className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{l.nombre}</span>
                      <span className="block text-xs text-azul-900/60">{l.tipo}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </div>
    </Seccion>
  );
}
