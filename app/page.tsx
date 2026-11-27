import type { Metadata } from "next";
import Hoy from "./hoy/Hoy";

// La portada de IAE LIFE es Hoy: tu próxima clase, tus tareas y los avisos.
// Qué proyecto es cada función y quién la hizo está en /creditos.
export const metadata: Metadata = { title: { absolute: "IAE LIFE · Hoy" } };

export default function Inicio() {
  return <Hoy />;
}
