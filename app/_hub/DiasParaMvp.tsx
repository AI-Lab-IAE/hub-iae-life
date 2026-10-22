"use client";

import { useSyncExternalStore } from "react";

// Fecha del MVP: jueves 13 de noviembre de 2026, hora de Panamá.
const MVP = new Date("2026-11-13T00:00:00-05:00").getTime();
const sinCambios = () => () => {};

// Días que faltan para el MVP. Se calcula en el navegador para que no quede fijo desde el build.
export default function DiasParaMvp() {
  const dias = useSyncExternalStore(
    sinCambios,
    () => Math.max(0, Math.ceil((MVP - Date.now()) / 86_400_000)),
    () => null,
  );
  return <>{dias ?? "—"}</>;
}
