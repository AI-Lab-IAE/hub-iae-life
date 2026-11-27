// Las secciones de Colegio. Los pendientes están en Tareas, los anuncios en Avisos y el horario en Horario.
// Para cambiar el nombre, el ícono, la descripción o la explicación de una tarjeta, edita esta lista.
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
    ruta: "clubes",
    icono: "estrella",
    nombre: "Clubes",
    descripcion: "Grupos para conocer gente y aprender.",
    explicacion: "Toca un club para ver de qué se trata, cuándo se reúne y quiénes lo forman. No todos reciben integrantes siempre: puedes preguntarle al encargado o intentar unirte si está abierto.",
  },
  {
    ruta: "calendario",
    icono: "calendario",
    nombre: "Calendario",
    descripcion: "Exámenes, vacaciones y eventos.",
    explicacion: "Todas las fechas del año escolar, ordenadas por mes. Usa los filtros para ver solo exámenes, eventos o vacaciones.",
  },
  {
    ruta: "informacion",
    icono: "informacion",
    nombre: "Información general",
    descripcion: "Reglas del colegio.",
    explicacion: "Las reglas básicas de convivencia. Tu horario de clases está en Horario.",
  },
] as const;

export type RutaSeccion = (typeof secciones)[number]["ruta"];
