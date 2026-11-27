import Link from "next/link";
import { CalendarDays, ChevronRight, ClipboardCheck, Compass, Mail, Megaphone, type LucideIcon } from "lucide-react";
import { Pantalla, tarjeta } from "../_life/Pantalla";
import anim from "./animaciones.module.css";
import { Tarjeta } from "./components/Tarjeta";
import { TituloBloque } from "./components/TituloBloque";
import { elevar, retraso, tocar } from "./components/estilos";
import { clubes, contactos, eventos, pisos, reglas } from "./datos";
import { diaYMes } from "./formato";
import { secciones, type RutaSeccion } from "./secciones";

// Número y texto que aparecen en cada tarjeta de las secciones (el número sube al abrir la página).
const datoSeccion: Record<RutaSeccion, { numero: number; texto: string }> = {
  mapa: { numero: pisos.length, texto: "pisos" },
  contactos: { numero: contactos.length, texto: "contactos" },
  clubes: { numero: clubes.length, texto: "clubes" },
  calendario: { numero: eventos.length, texto: "fechas" },
  informacion: { numero: reglas.length, texto: "reglas" },
};

// Lo que antes repetía la guía y ahora vive en una sola función de IAE LIFE.
const EN_OTRA_FUNCION: { href: string; titulo: string; texto: string; icono: LucideIcon }[] = [
  { href: "/horario", titulo: "Horario", texto: "Tu horario de clases", icono: CalendarDays },
  { href: "/daniela", titulo: "Tareas", texto: "Tus pendientes", icono: ClipboardCheck },
  { href: "/abraham", titulo: "Avisos", texto: "Los anuncios del colegio", icono: Megaphone },
];

export default function Page() {
  const fechas = [...eventos].sort((a, b) => a.fecha.localeCompare(b.fecha)).slice(0, 4);
  const coordinacion = contactos.find((c) => c.cargo === "Coordinación académica")!;

  return (
    <Pantalla icono={Compass} titulo="Colegio" texto="Mapa, contactos, clubes, calendario y reglas del IAE." ancho="ancho">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-8 lg:col-span-2">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {secciones.map((s, i) => (
              <div key={s.ruta} className={anim.crecer} style={retraso(i + 1)}>
                <Tarjeta ruta={s.ruta} nombre={s.nombre} {...datoSeccion[s.ruta]} />
              </div>
            ))}
          </div>

          {/* Próximas fechas */}
          <section className={anim.aparecer} style={retraso(3)}>
            <TituloBloque titulo="Próximas fechas" href="/camille/calendario" />
            <ul className="flex flex-col gap-3">
              {fechas.map((e) => {
                const { dia, mes } = diaYMes(e.fecha);
                return (
                  <li key={e.titulo} className={`${tarjeta} flex items-center gap-3 p-3`}>
                    <span className="flex size-11 shrink-0 flex-col items-center justify-center rounded-xl bg-azul-800 leading-none text-white">
                      <span className="font-bold">{dia}</span>
                      <span className="text-[9px] uppercase">{mes}</span>
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-azul-950">{e.titulo}</span>
                      <span className="block text-xs text-azul-700">{e.tipo}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <aside className="flex flex-col gap-8">
          <section className={anim.aparecer} style={retraso(4)}>
            <TituloBloque titulo="También en IAE LIFE" />
            <ul className={`${tarjeta} divide-y divide-azul-100`}>
              {EN_OTRA_FUNCION.map((f) => (
                <li key={f.href}>
                  <Link href={f.href} className="flex items-center gap-3 p-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-azul-100 text-azul-800">
                      <f.icono className="size-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-azul-950">{f.titulo}</span>
                      <span className="block text-sm text-azul-900/60">{f.texto}</span>
                    </span>
                    <ChevronRight className="size-5 shrink-0 text-azul-900/40" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className={anim.aparecer} style={retraso(5)}>
            <a href={`mailto:${coordinacion.correo}`} className={`${tarjeta} ${elevar} ${tocar} flex items-center gap-3 p-4`}>
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-azul-100 text-azul-800">
                <Mail className="size-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-azul-950">¿Necesitas ayuda?</span>
                <span className="block text-sm text-azul-900/60">Escríbele a {coordinacion.lugar}</span>
              </span>
              <ChevronRight className="size-5 shrink-0 text-azul-900/40" aria-hidden />
            </a>
          </section>
        </aside>
      </div>

      <p className="mt-10 text-center text-xs text-azul-900/45">Vista previa: los datos son de ejemplo, ficticios.</p>
    </Pantalla>
  );
}
