import type { NombreIcono } from "./Icono";

// Pestañas de la barra de navegación. Documentos e Información se abren desde el inicio.
export const pestanas: { href: string; nombre: string; icono: NombreIcono }[] = [
  { href: "/camille", nombre: "Inicio", icono: "inicio" },
  { href: "/camille/anuncios", nombre: "Anuncios", icono: "anuncios" },
  { href: "/camille/calendario", nombre: "Calendario", icono: "calendario" },
  { href: "/camille/contactos", nombre: "Contactos", icono: "contactos" },
  { href: "/camille/mapa", nombre: "Mapa", icono: "mapa" },
];
