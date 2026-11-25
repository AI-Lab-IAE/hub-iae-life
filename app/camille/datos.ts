// Datos de ejemplo de la guía. Todo es inventado: no hay personas, teléfonos ni correos reales.
// El repositorio es público: aquí NUNCA van datos reales de personas, ni ahora ni más adelante.

// Los anuncios del colegio ahora viven en Avisos (app/abraham/datos.ts): un solo lugar para los avisos.

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

// Clubes inventados. Nombres, encargados e integrantes son de prueba: el repositorio es público
// y los estudiantes son menores, así que aquí nunca van personas reales.
// "abierto" dice si el club está recibiendo integrantes ahora: no siempre lo está.
export const clubes = [
  {
    id: "robotica",
    nombre: "Club Prueba de Robótica",
    logo: "robot",
    color: "sky",
    descripcion: "Armamos y programamos robots pequeños para retos entre equipos.",
    dia: "Martes",
    hora: "3:45 p. m.",
    lugar: "Laboratorio Prueba",
    encargado: "Profesor Prueba 3",
    abierto: true,
    integrantes: [
      { nombre: "Estudiante Prueba 1", grado: "11.º", rol: "Presidencia" },
      { nombre: "Estudiante Prueba 2", grado: "10.º", rol: "Secretaría" },
      { nombre: "Estudiante Prueba 3", grado: "9.º", rol: "Integrante" },
      { nombre: "Estudiante Prueba 4", grado: "8.º", rol: "Integrante" },
    ],
  },
  {
    id: "ajedrez",
    nombre: "Club Prueba de Ajedrez",
    logo: "corona",
    color: "amber",
    descripcion: "Partidas amistosas, problemas de ajedrez y torneos internos.",
    dia: "Miércoles",
    hora: "3:45 p. m.",
    lugar: "Biblioteca Prueba",
    encargado: "Profesora Prueba 4",
    abierto: false,
    integrantes: [
      { nombre: "Estudiante Prueba 5", grado: "12.º", rol: "Presidencia" },
      { nombre: "Estudiante Prueba 6", grado: "9.º", rol: "Integrante" },
      { nombre: "Estudiante Prueba 7", grado: "7.º", rol: "Integrante" },
    ],
  },
  {
    id: "arte",
    nombre: "Club Prueba de Arte",
    logo: "paleta",
    color: "rose",
    descripcion: "Dibujo, pintura y murales para decorar el colegio.",
    dia: "Jueves",
    hora: "3:45 p. m.",
    lugar: "Salón Prueba 102",
    encargado: "Profesora Prueba 2",
    abierto: true,
    integrantes: [
      { nombre: "Estudiante Prueba 8", grado: "10.º", rol: "Presidencia" },
      { nombre: "Estudiante Prueba 9", grado: "10.º", rol: "Tesorería" },
      { nombre: "Estudiante Prueba 10", grado: "8.º", rol: "Integrante" },
      { nombre: "Estudiante Prueba 11", grado: "7.º", rol: "Integrante" },
      { nombre: "Estudiante Prueba 12", grado: "7.º", rol: "Integrante" },
    ],
  },
  {
    id: "musica",
    nombre: "Club Prueba de Música",
    logo: "musica",
    color: "violet",
    descripcion: "Practicamos canciones en grupo y tocamos en los eventos del colegio.",
    dia: "Lunes",
    hora: "3:45 p. m.",
    lugar: "Salón Prueba 201",
    encargado: "Profesor Prueba 1",
    abierto: false,
    integrantes: [
      { nombre: "Estudiante Prueba 13", grado: "11.º", rol: "Presidencia" },
      { nombre: "Estudiante Prueba 14", grado: "9.º", rol: "Integrante" },
      { nombre: "Estudiante Prueba 15", grado: "8.º", rol: "Integrante" },
    ],
  },
  {
    id: "ambiente",
    nombre: "Club Prueba de Ambiente",
    logo: "arbol",
    color: "emerald",
    descripcion: "Cuidamos el huerto y organizamos campañas de reciclaje.",
    dia: "Jueves",
    hora: "3:45 p. m.",
    lugar: "Patio Prueba A",
    encargado: "Profesor Prueba 3",
    abierto: true,
    integrantes: [
      { nombre: "Estudiante Prueba 16", grado: "12.º", rol: "Presidencia" },
      { nombre: "Estudiante Prueba 17", grado: "10.º", rol: "Secretaría" },
      { nombre: "Estudiante Prueba 18", grado: "7.º", rol: "Integrante" },
      { nombre: "Estudiante Prueba 19", grado: "7.º", rol: "Integrante" },
    ],
  },
  {
    id: "debate",
    nombre: "Club Prueba de Debate",
    logo: "burbuja",
    color: "indigo",
    descripcion: "Aprendemos a defender ideas con respeto y a hablar en público.",
    dia: "Miércoles",
    hora: "3:45 p. m.",
    lugar: "Salón Prueba 101",
    encargado: "Profesora Prueba 2",
    abierto: true,
    integrantes: [
      { nombre: "Estudiante Prueba 20", grado: "12.º", rol: "Presidencia" },
      { nombre: "Estudiante Prueba 21", grado: "11.º", rol: "Integrante" },
      { nombre: "Estudiante Prueba 22", grado: "9.º", rol: "Integrante" },
    ],
  },
] as const;

export type Club = (typeof clubes)[number];

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

// El horario de clases ahora vive en Horario (app/_life/horario.ts): un solo horario para toda la app.

export const reglas = [
  "Llega a tiempo: después de la hora de entrada se registra un retardo.",
  "Usa el uniforme completo de lunes a viernes.",
  "El celular se guarda durante las clases, salvo que el profesor indique lo contrario.",
  "Cuida los salones, la biblioteca y los laboratorios.",
  "Si faltas, entrega tu justificante en Control escolar.",
];
