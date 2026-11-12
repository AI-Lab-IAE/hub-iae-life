"use client";

import { usePendientes } from "./pendientes";
import { Tarjeta } from "./Tarjeta";

// Tarjeta de "Mis secciones" con los pendientes que faltan en este dispositivo.
export function TarjetaPendientes({ nombre }: { nombre: string }) {
  const { pendientes } = usePendientes();
  return <Tarjeta ruta="pendientes" icono="lista" nombre={nombre} numero={pendientes.filter((p) => !p.hecho).length} texto="por hacer" />;
}
