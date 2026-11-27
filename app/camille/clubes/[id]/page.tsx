import { notFound } from "next/navigation";
import anim from "../../animaciones.module.css";
import { BotonUnirme } from "../../components/BotonUnirme";
import { Icono, type NombreIcono } from "../../components/Icono";
import { EstadoClub, LogoClub } from "../../components/LogoClub";
import { Seccion } from "../../components/Seccion";
import { TituloBloque } from "../../components/TituloBloque";
import { retraso, tarjeta } from "../../components/estilos";
import { clubes } from "../../datos";

export function generateStaticParams() {
  return clubes.map((c) => ({ id: c.id }));
}

// Página de un club: logo, de qué se trata, si está abierto, cuándo se reúne e integrantes.
export default async function Page({ params }: PageProps<"/camille/clubes/[id]">) {
  const { id } = await params;
  const club = clubes.find((c) => c.id === id);
  if (!club) notFound();

  const datos: { icono: NombreIcono; que: string; valor: string }[] = [
    { icono: "reloj", que: "Cuándo", valor: `${club.dia}, ${club.hora}` },
    { icono: "ubicacion", que: "Dónde", valor: club.lugar },
    { icono: "perfil", que: "Encargado", valor: club.encargado },
  ];

  return (
    <Seccion ruta="clubes" volver={{ href: "/camille/clubes", texto: "Clubes" }}>
      <section className={`${tarjeta} ${anim.aparecer} overflow-hidden`}>
        <div className="h-20 bg-linear-to-br from-azul-500 via-azul-800 to-azul-900" />
        <div className="-mt-10 flex flex-col items-center px-5 pb-5 text-center">
          <LogoClub club={club} className="size-20 ring-4 ring-white" icono="size-10" />
          <h1 className="mt-3 text-2xl font-bold">{club.nombre}</h1>
          <p className="mt-1 max-w-md text-sm text-azul-900/60">{club.descripcion}</p>
          <span className="mt-2">
            <EstadoClub abierto={club.abierto} />
          </span>
          <span className="mt-2 inline-block rounded-full bg-azul-100 px-2.5 py-0.5 text-[11px] font-medium text-azul-900">
            Datos de ejemplo, ficticios
          </span>
        </div>
      </section>

      <section className={`mt-8 ${anim.aparecer}`} style={retraso(1)}>
        <TituloBloque titulo="¿Te interesa?" />
        <div className={`${tarjeta} p-4`}>
          <dl className="mb-4 flex flex-col gap-2.5 text-sm">
            {datos.map((d) => (
              <div key={d.que} className="flex items-center gap-2">
                <Icono nombre={d.icono} className="size-4 shrink-0 text-azul-500" />
                <dt className="text-azul-900/60">{d.que}:</dt>
                <dd className="font-semibold">{d.valor}</dd>
              </div>
            ))}
          </dl>
          <BotonUnirme club={club} />
          <p className="mt-2 text-center text-xs text-azul-900/60">{club.abierto
              ? "Por ahora recibe integrantes, pero confirma con el encargado si hay cupo. Se anota en Organiza."
              : "Por ahora no recibe integrantes. Igual puedes ver de qué se trata y preguntarle al encargado."}</p>
        </div>
      </section>

      <section className={`mt-8 ${anim.aparecer}`} style={retraso(2)}>
        <TituloBloque titulo={`Integrantes · ${club.integrantes.length}`} />
        <ul className={`${tarjeta} divide-y divide-azul-100`}>
          {club.integrantes.map((p) => (
            <li key={p.nombre} className="flex items-center gap-3 p-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-azul-100 text-sm font-bold text-azul-800">
                {p.nombre[0]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{p.nombre}</span>
                <span className="block text-xs text-azul-900/60">{p.grado} grado</span>
              </span>
              {p.rol !== "Integrante" && (
                <span className="shrink-0 rounded-full bg-azul-50 px-2 py-0.5 text-xs font-medium text-azul-900">{p.rol}</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </Seccion>
  );
}
