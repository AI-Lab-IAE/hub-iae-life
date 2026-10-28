// Datos de ejemplo de la guía. Todo es inventado: no hay personas, teléfonos ni correos reales.
// El repositorio es público: aquí NUNCA van datos reales de personas, ni ahora ni más adelante.

export const anuncios = [
  {
    fecha: "2026-11-10",
    titulo: "Feria de Ciencias de Prueba",
    texto: "La feria será en el Patio Prueba A. Cada grupo presenta su proyecto de 8:00 a 11:00.",
    detalle:
      "Trae tu cartel y tu proyecto armado desde las 7:30 a. m. Los jueces de ejemplo pasarán por cada mesa. Las familias pueden visitar la feria de 10:00 a 11:00.",
    importante: true,
  },
  {
    fecha: "2026-11-03",
    titulo: "Cambio de horario de la biblioteca",
    texto: "Durante esta semana, la Biblioteca Prueba abre de 7:30 a 13:00.",
    detalle: "Si necesitas devolver un libro después de la 1:00 p. m., déjalo en Coordinación Prueba. La próxima semana vuelve el horario normal.",
    importante: false,
  },
  {
    fecha: "2026-10-27",
    titulo: "Entrega de boletas de ejemplo",
    texto: "Las boletas del primer periodo se entregan en Coordinación Prueba.",
    detalle: "Cada familia recoge la boleta en el horario que le toca. Si no puedes ir ese día, escribe a Coordinación Prueba para pedir otra fecha.",
    importante: true,
  },
  {
    fecha: "2026-10-20",
    titulo: "Nuevo club de lectura",
    texto: "El Profesor Prueba 3 abre inscripciones al club de lectura de los viernes.",
    detalle: "El club se reúne los viernes en la Biblioteca Prueba. Para inscribirte, habla con el Profesor Prueba 3 o escríbele desde Contactos.",
    importante: false,
  },
];

export const eventos = [
  { fecha: "2026-11-02", titulo: "Día sin clases", tipo: "Vacaciones", descripcion: "No hay clases ni actividades en el colegio." },
  { fecha: "2026-11-10", titulo: "Feria de Ciencias de Prueba", tipo: "Evento", descripcion: "Presentación de proyectos en el Patio Prueba A." },
  { fecha: "2026-11-16", titulo: "Inicio de exámenes del segundo periodo", tipo: "Examen", descripcion: "Revisa con cada profesor qué temas entran." },
  { fecha: "2026-11-20", titulo: "Fin de exámenes del segundo periodo", tipo: "Examen", descripcion: "Último día de exámenes de la semana." },
  { fecha: "2026-11-27", titulo: "Junta de padres de ejemplo", tipo: "Evento", descripcion: "Reunión de familias con los profesores guía." },
  { fecha: "2026-12-18", titulo: "Último día de clases del año", tipo: "Evento", descripcion: "La salida es a la hora normal." },
  { fecha: "2026-12-21", titulo: "Inicio de vacaciones de fin de año", tipo: "Vacaciones", descripcion: "Las clases regresan en la fecha que anuncie el colegio." },
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

// Lugares del colegio por piso. "x" y "y" son la posición del pin en el plano (en %, de 0 a 100)
// y "codigo" es lo que dice el pin. El plano es inventado; ver components/PlanoColegio.tsx.
export const pisos = [
  {
    nombre: "Planta baja",
    lugares: [
      { nombre: "Entrada principal", tipo: "Acceso", codigo: "E", x: 50, y: 92 },
      { nombre: "Control escolar (Oficina Prueba 1)", tipo: "Oficina", codigo: "O1", x: 14, y: 33 },
      { nombre: "Coordinación Prueba", tipo: "Oficina", codigo: "CO", x: 26, y: 33 },
      { nombre: "Enfermería Prueba", tipo: "Servicio", codigo: "+", x: 38, y: 33 },
      { nombre: "Cafetería Prueba", tipo: "Servicio", codigo: "CAF", x: 77, y: 33 },
      { nombre: "Patio Prueba A", tipo: "Exterior", codigo: "P", x: 31, y: 66 },
    ],
  },
  {
    nombre: "Primer piso",
    lugares: [
      { nombre: "Salón Prueba 101", tipo: "Salón", codigo: "101", x: 13, y: 33 },
      { nombre: "Salón Prueba 102", tipo: "Salón", codigo: "102", x: 25, y: 33 },
      { nombre: "Biblioteca Prueba", tipo: "Servicio", codigo: "BIB", x: 39, y: 33 },
      { nombre: "Laboratorio Prueba", tipo: "Salón", codigo: "LAB", x: 72, y: 33 },
      { nombre: "Baños", tipo: "Servicio", codigo: "WC", x: 87, y: 33 },
    ],
  },
  {
    nombre: "Segundo piso",
    lugares: [
      { nombre: "Salón Prueba 201", tipo: "Salón", codigo: "201", x: 14, y: 33 },
      { nombre: "Salón Prueba 202", tipo: "Salón", codigo: "202", x: 28, y: 33 },
      { nombre: "Sala de cómputo Prueba", tipo: "Salón", codigo: "PC", x: 72, y: 33 },
      { nombre: "Baños", tipo: "Servicio", codigo: "WC", x: 87, y: 33 },
    ],
  },
];

// Horario de secundaria con las horas del timbre del colegio. No se ponen materias ni salones,
// porque cada grupo tiene su propio horario.
// "desde" y "hasta" van en formato de 24 horas para saber qué bloque toca ahora.
export const bloquesSecundaria = [
  { nombre: "Rezo", hora: "7:15 – 8:00 a. m.", tipo: "rezo", desde: "07:15", hasta: "08:00" },
  { nombre: "Período 2", hora: "8:05 – 8:45 a. m.", tipo: "clase", desde: "08:05", hasta: "08:45" },
  { nombre: "Período 3", hora: "8:50 – 9:30 a. m.", tipo: "clase", desde: "08:50", hasta: "09:30" },
  { nombre: "Recreo", hora: "9:30 – 9:55 a. m.", tipo: "descanso", desde: "09:30", hasta: "09:55" },
  { nombre: "Período 4", hora: "9:55 – 10:35 a. m.", tipo: "clase", desde: "09:55", hasta: "10:35" },
  { nombre: "Período 5", hora: "10:40 – 11:20 a. m.", tipo: "clase", desde: "10:40", hasta: "11:20" },
  { nombre: "Período 6", hora: "11:25 a. m. – 12:05 p. m.", tipo: "clase", desde: "11:25", hasta: "12:05" },
  { nombre: "Período 7", hora: "12:10 – 12:50 p. m.", tipo: "clase", desde: "12:10", hasta: "12:50" },
  { nombre: "Almuerzo", hora: "12:50 – 1:25 p. m.", tipo: "descanso", desde: "12:50", hasta: "13:25" },
  { nombre: "Período 9", hora: "1:30 – 2:05 p. m.", tipo: "clase", desde: "13:30", hasta: "14:05" },
  { nombre: "Período 10", hora: "2:10 – 2:50 p. m.", tipo: "clase", desde: "14:10", hasta: "14:50" },
  { nombre: "Período 11", hora: "2:55 – 3:30 p. m.", tipo: "clase", desde: "14:55", hasta: "15:30" },
] as const;

// Cuántas clases hay cada día. El viernes la salida es a las 12:50 p. m.: solo hasta el periodo 7.
export const semanaSecundaria = [
  { dia: "Lunes", corto: "Lun", clases: 9 },
  { dia: "Martes", corto: "Mar", clases: 9 },
  { dia: "Miércoles", corto: "Mié", clases: 9 },
  { dia: "Jueves", corto: "Jue", clases: 9 },
  { dia: "Viernes", corto: "Vie", clases: 6 },
];

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
