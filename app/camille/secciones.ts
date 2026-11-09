// Las secciones de la guía. Para cambiar el nombre, el ícono, la descripción o la explicación de una tarjeta, edita esta lista.
export const secciones = [
  {
    ruta: "mapa",
    icono: "mapa",
    nombre: "Mapa",
    descripcion: "Encuentra salones y oficinas del colegio.",
    explicacion: "Busca un salón por número o nombre y su pin brinca en el plano. Cambia de piso, filtra por tipo, acerca con + y toca un pin para ver qué lugar es. El plano es inventado.",
  },
  {
    ruta: "contactos",
    icono: "contactos",
    nombre: "Contactos",
    descripcion: "Profesores y personal del colegio.",
    explicacion: "Escribe un nombre, una materia o una oficina en el buscador. Toca un correo para abrir tu aplicación de correo con la dirección lista.",
  },
  {
    ruta: "pendientes",
    icono: "lista",
    nombre: "Mis pendientes",
    descripcion: "Tus tareas, exámenes y proyectos.",
    explicacion: "Anota lo que debes hacer, para cuándo es y dónde está la información. Toca el círculo cuando lo termines. Lo que falta se ordena por fecha de entrega.",
  },
  {
    ruta: "clubes",
    icono: "estrella",
    nombre: "Clubes",
    descripcion: "Grupos para conocer gente y aprender.",
    explicacion: "Toca un club para ver su logo, cuándo se reúne y quiénes lo forman. Con «Me quiero unir» se anota en tus pendientes hablar con el encargado.",
  },
  {
    ruta: "preguntas",
    icono: "pregunta",
    nombre: "Preguntas frecuentes",
    descripcion: "Respuestas a las dudas más comunes.",
    explicacion: "Las dudas más comunes, agrupadas por tema. Toca una pregunta para ver la respuesta.",
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
