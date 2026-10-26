// Las seis secciones de la guía. Para cambiar el nombre, el ícono o la descripción de una tarjeta, edita esta lista.
export const secciones = [
  {
    ruta: "mapa",
    icono: "🗺️",
    nombre: "Mapa",
    descripcion: "Encuentra salones y oficinas del colegio.",
  },
  {
    ruta: "contactos",
    icono: "📞",
    nombre: "Contactos",
    descripcion: "Profesores y personal del colegio.",
  },
  {
    ruta: "documentos",
    icono: "📄",
    nombre: "Documentos",
    descripcion: "Reglamentos, formatos y circulares.",
  },
  {
    ruta: "calendario",
    icono: "📅",
    nombre: "Calendario",
    descripcion: "Exámenes, vacaciones y eventos.",
  },
  {
    ruta: "anuncios",
    icono: "📢",
    nombre: "Anuncios",
    descripcion: "Avisos importantes del colegio.",
  },
  {
    ruta: "informacion",
    icono: "ℹ️",
    nombre: "Información general",
    descripcion: "Horarios, reglas y servicios.",
  },
] as const;

export type RutaSeccion = (typeof secciones)[number]["ruta"];
