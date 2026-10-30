"use client";

import dynamic from "next/dynamic";

// AvisIA guarda el perfil, el horario y el historial en el navegador (localStorage),
// así que se carga solo en el navegador y no en el servidor.
const AvisIA = dynamic(() => import("./AvisIA"), { ssr: false });

export default function AvisIACliente() {
  return <AvisIA />;
}
