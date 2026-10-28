// Las seis secciones de la guía. Para cambiar el nombre, el ícono, la descripción o la explicación de una tarjeta, edita esta lista.
export const secciones = [
  {
    ruta: "mapa",
    icono: "mapa",
    nombre: "Mapa",
    descripcion: "Encuentra salones y oficinas del colegio.",
    explicacion: "Busca en qué piso está cada salón, oficina o servicio. Los pisos van del más alto al más bajo, como se ve el edificio desde afuera.",
  },
  {
    ruta: "contactos",
    icono: "contactos",
    nombre: "Contactos",
    descripcion: "Profesores y personal del colegio.",
    explicacion: "Escribe un nombre, una materia o una oficina en el buscador. Toca un correo para abrir tu aplicación de correo con la dirección lista.",
  },
  {
    ruta: "documentos",
    icono: "documentos",
    nombre: "Documentos",
    descripcion: "Reglamentos, formatos y circulares.",
    explicacion: "Mira qué documentos existen, para qué sirve cada uno y en qué oficina se piden. Están agrupados por tipo.",
  },
  {
    ruta: "calendario",
    icono: "calendario",
    nombre: "Calendario",
    descripcion: "Exámenes, vacaciones y eventos.",
    explicacion: "Todas las fechas del año escolar, ordenadas por mes. Usa los filtros para ver solo exámenes, eventos o vacaciones.",
  },
  {
    ruta: "anuncios",
    icono: "anuncios",
    nombre: "Anuncios",
    descripcion: "Avisos importantes del colegio.",
    explicacion: "Los avisos del colegio, del más nuevo al más viejo. Toca un anuncio para leerlo completo. Los importantes tienen una etiqueta roja.",
  },
  {
    ruta: "informacion",
    icono: "informacion",
    nombre: "Información general",
    descripcion: "Horarios, reglas y servicios.",
    explicacion: "El horario de clases de secundaria día por día, las reglas básicas de convivencia y los servicios del colegio con su horario.",
  },
] as const;

export type RutaSeccion = (typeof secciones)[number]["ruta"];
