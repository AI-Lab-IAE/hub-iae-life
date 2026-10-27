// Datos de ejemplo de la guía. Todo es inventado: no hay personas, teléfonos ni correos reales.
// El repositorio es público: aquí NUNCA van datos reales de personas, ni ahora ni más adelante.

export const anuncios = [
  {
    fecha: "2026-11-10",
    titulo: "Feria de Ciencias de Prueba",
    texto: "La feria será en el Patio Prueba A. Cada grupo presenta su proyecto de 8:00 a 11:00.",
    importante: true,
  },
  {
    fecha: "2026-11-03",
    titulo: "Cambio de horario de la biblioteca",
    texto: "Durante esta semana, la Biblioteca Prueba abre de 7:30 a 13:00.",
    importante: false,
  },
  {
    fecha: "2026-10-27",
    titulo: "Entrega de boletas de ejemplo",
    texto: "Las boletas del primer periodo se entregan en Coordinación Prueba.",
    importante: true,
  },
  {
    fecha: "2026-10-20",
    titulo: "Nuevo club de lectura",
    texto: "El Profesor Prueba 3 abre inscripciones al club de lectura de los viernes.",
    importante: false,
  },
];

export const eventos = [
  { fecha: "2026-11-02", titulo: "Día sin clases", tipo: "Vacaciones" },
  { fecha: "2026-11-10", titulo: "Feria de Ciencias de Prueba", tipo: "Evento" },
  { fecha: "2026-11-16", titulo: "Inicio de exámenes del segundo periodo", tipo: "Examen" },
  { fecha: "2026-11-20", titulo: "Fin de exámenes del segundo periodo", tipo: "Examen" },
  { fecha: "2026-11-27", titulo: "Junta de padres de ejemplo", tipo: "Evento" },
  { fecha: "2026-12-18", titulo: "Último día de clases del año", tipo: "Evento" },
  { fecha: "2026-12-21", titulo: "Inicio de vacaciones de invierno", tipo: "Vacaciones" },
] as const;

// Los correos usan example.com, un dominio reservado oficialmente para ejemplos.
export const contactos = [
  { nombre: "Profesor Prueba 1", cargo: "Matemáticas", correo: "profesor1@example.com", lugar: "Salón Prueba 101" },
  { nombre: "Profesora Prueba 2", cargo: "Español", correo: "profesora2@example.com", lugar: "Salón Prueba 102" },
  { nombre: "Profesor Prueba 3", cargo: "Ciencias", correo: "profesor3@example.com", lugar: "Laboratorio Prueba" },
  { nombre: "Profesora Prueba 4", cargo: "Inglés", correo: "profesora4@example.com", lugar: "Salón Prueba 201" },
  { nombre: "Coordinador Prueba", cargo: "Coordinación académica", correo: "coordinacion@example.com", lugar: "Coordinación Prueba" },
  { nombre: "Persona Prueba de Enfermería", cargo: "Enfermería", correo: "enfermeria@example.com", lugar: "Enfermería Prueba" },
  { nombre: "Persona Prueba de Control Escolar", cargo: "Control escolar", correo: "control@example.com", lugar: "Oficina Prueba 1" },
];

// Por ahora son solo descripciones; los archivos reales van en DESPUES.md.
export const documentos = [
  { titulo: "Reglamento escolar", tipo: "Reglamento", descripcion: "Normas de convivencia, uniforme y puntualidad.", dondeSePide: "Coordinación Prueba" },
  { titulo: "Formato de justificante de falta", tipo: "Formato", descripcion: "Se llena cuando faltas por enfermedad o un motivo familiar.", dondeSePide: "Control escolar" },
  { titulo: "Solicitud de constancia de estudios", tipo: "Formato", descripcion: "Para pedir una constancia que diga que eres estudiante del colegio.", dondeSePide: "Oficina Prueba 1" },
  { titulo: "Permiso de salida anticipada", tipo: "Formato", descripcion: "Para salir antes de la hora con autorización de tu familia.", dondeSePide: "Coordinación Prueba" },
  { titulo: "Circular de la Feria de Ciencias de Prueba", tipo: "Circular", descripcion: "Fechas, horarios y reglas para presentar tu proyecto.", dondeSePide: "Tablero de avisos" },
  { titulo: "Lista de útiles de ejemplo", tipo: "Circular", descripcion: "Materiales que se necesitan para el segundo periodo.", dondeSePide: "Tablero de avisos" },
] as const;

// Mapa simple por pisos. El mapa interactivo y el plano real van en DESPUES.md.
export const pisos = [
  {
    nombre: "Planta baja",
    lugares: [
      { nombre: "Entrada principal", tipo: "Acceso" },
      { nombre: "Control escolar (Oficina Prueba 1)", tipo: "Oficina" },
      { nombre: "Coordinación Prueba", tipo: "Oficina" },
      { nombre: "Enfermería Prueba", tipo: "Servicio" },
      { nombre: "Cafetería Prueba", tipo: "Servicio" },
      { nombre: "Patio Prueba A", tipo: "Exterior" },
    ],
  },
  {
    nombre: "Primer piso",
    lugares: [
      { nombre: "Salón Prueba 101", tipo: "Salón" },
      { nombre: "Salón Prueba 102", tipo: "Salón" },
      { nombre: "Biblioteca Prueba", tipo: "Servicio" },
      { nombre: "Laboratorio Prueba", tipo: "Salón" },
      { nombre: "Baños", tipo: "Servicio" },
    ],
  },
  {
    nombre: "Segundo piso",
    lugares: [
      { nombre: "Salón Prueba 201", tipo: "Salón" },
      { nombre: "Salón Prueba 202", tipo: "Salón" },
      { nombre: "Sala de cómputo Prueba", tipo: "Salón" },
      { nombre: "Baños", tipo: "Servicio" },
    ],
  },
];

// Horario de secundaria. Las horas son las del timbre del colegio; las materias y los salones
// son de ejemplo (cada grupo tiene su propio horario y no se publica el de nadie).
export const bloquesSecundaria = [
  { nombre: "Rezo", hora: "7:15 – 8:00 a. m.", tipo: "rezo" },
  { nombre: "Periodo 2", hora: "8:05 – 8:45 a. m.", tipo: "clase" },
  { nombre: "Periodo 3", hora: "8:50 – 9:30 a. m.", tipo: "clase" },
  { nombre: "Recreo", hora: "9:30 – 9:55 a. m.", tipo: "descanso" },
  { nombre: "Periodo 4", hora: "9:55 – 10:35 a. m.", tipo: "clase" },
  { nombre: "Periodo 5", hora: "10:40 – 11:20 a. m.", tipo: "clase" },
  { nombre: "Periodo 6", hora: "11:25 a. m. – 12:05 p. m.", tipo: "clase" },
  { nombre: "Periodo 7", hora: "12:10 – 12:50 p. m.", tipo: "clase" },
  { nombre: "Almuerzo", hora: "12:50 – 1:25 p. m.", tipo: "descanso" },
  { nombre: "Periodo 9", hora: "1:30 – 2:05 p. m.", tipo: "clase" },
  { nombre: "Periodo 10", hora: "2:10 – 2:50 p. m.", tipo: "clase" },
  { nombre: "Periodo 11", hora: "2:55 – 3:30 p. m.", tipo: "clase" },
] as const;

// Materias de ejemplo de cada día, en orden de periodo (sin contar rezo, recreo ni almuerzo).
// El viernes la salida es a las 12:50 p. m., así que solo hay clases hasta el periodo 7.
export const semanaSecundaria = [
  { dia: "Lunes", corto: "Lun", materias: ["Matemáticas", "Ciencias", "Español", "Inglés", "Historia", "Arte", "Tecnología", "Educación Física", "Inglés"] },
  { dia: "Martes", corto: "Mar", materias: ["Inglés", "Matemáticas", "Historia", "Ciencias", "Español", "Música", "Matemáticas", "Tecnología", "Español"] },
  { dia: "Miércoles", corto: "Mié", materias: ["Ciencias", "Español", "Matemáticas", "Educación Física", "Inglés", "Historia", "Arte", "Ciencias", "Matemáticas"] },
  { dia: "Jueves", corto: "Jue", materias: ["Historia", "Inglés", "Ciencias", "Matemáticas", "Tecnología", "Español", "Inglés", "Música", "Historia"] },
  { dia: "Viernes", corto: "Vie", materias: ["Español", "Matemáticas", "Inglés", "Ciencias", "Educación Física", "Orientación"] },
];

export const salonDeEjemplo: Record<string, string> = {
  Matemáticas: "Salón Prueba 201",
  Ciencias: "Laboratorio Prueba",
  Español: "Salón Prueba 202",
  Inglés: "Salón Prueba 101",
  Historia: "Salón Prueba 102",
  Arte: "Salón Prueba 201",
  Música: "Salón Prueba 102",
  Tecnología: "Sala de cómputo Prueba",
  "Educación Física": "Patio Prueba A",
  Orientación: "Biblioteca Prueba",
};

export const horarioSecundaria = {
  entrada: "7:15 a. m.",
  salida: "3:30 p. m.",
  salidaViernes: "12:50 p. m.",
};




export const reglas = [
  "Llega a tiempo: después de la hora de entrada se registra un retardo.",
  "Usa el uniforme completo de lunes a viernes.",
  "El celular se guarda durante las clases, salvo que el profesor indique lo contrario.",
  "Cuida los salones, la biblioteca y los laboratorios.",
  "Si faltas, entrega tu justificante en Control escolar (ver Documentos).",
];

export const servicios = [
  { nombre: "Biblioteca Prueba", detalle: "Préstamo de libros y espacio para estudiar.", horario: "7:30 a 15:00" },
  { nombre: "Enfermería Prueba", detalle: "Primeros auxilios y atención si te sientes mal.", horario: "7:00 a 14:30" },
  { nombre: "Cafetería Prueba", detalle: "Desayunos y comida durante el recreo.", horario: "7:00 a 14:00" },
  { nombre: "Sala de cómputo Prueba", detalle: "Computadoras e impresión de tareas.", horario: "8:00 a 14:00" },
];
