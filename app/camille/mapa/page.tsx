import anim from "../animaciones.module.css";
import { EncabezadoSeccion } from "../components/EncabezadoSeccion";
import { Icono, type NombreIcono } from "../components/Icono";
import { Pantalla } from "../components/Pantalla";
import { retraso, tarjeta } from "../components/estilos";
import { pisos } from "../datos";

// Ícono y color de cada tipo de lugar.
const tiposLugar: Record<string, { icono: NombreIcono; color: string }> = {
  Acceso: { icono: "puerta", color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  Oficina: { icono: "maletin", color: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300" },
  Servicio: { icono: "campana", color: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300" },
  Exterior: { icono: "arbol", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  Salón: { icono: "libro", color: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300" },
};

// "Planta baja" → "PB", "Primer piso" → "1", "Segundo piso" → "2".
const numeroPiso = ["PB", "1", "2", "3"];

export default function Page() {
  return (
    <Pantalla>
      <EncabezadoSeccion ruta="mapa" />

      {/* Leyenda de colores */}
      <ul className={`mt-6 flex flex-wrap gap-2 ${anim.aparecer}`} style={retraso(1)}>
        {Object.entries(tiposLugar).map(([tipo, { icono, color }]) => (
          <li key={tipo} className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${color}`}>
            <Icono nombre={icono} className="size-3.5" /> {tipo}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-col gap-4">
        {/* Del piso más alto al más bajo, como se ve un edificio. */}
        {pisos
          .map((piso, i) => ({ ...piso, numero: numeroPiso[i] }))
          .reverse()
          .map((piso, i) => (
            <section key={piso.nombre} className={`${tarjeta} overflow-hidden ${anim.aparecer}`} style={retraso(i + 2)}>
              <h2 className="flex items-center gap-3 border-b border-sky-50 bg-sky-50/60 px-4 py-3 font-semibold dark:border-sky-900/40 dark:bg-sky-950/40">
                <span className="flex size-8 items-center justify-center rounded-lg bg-sky-500 text-sm font-bold text-white">
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
