// Datos de ejemplo para la pantalla «Hoy». Todo es inventado.
// Cuando Jonathan (horario y datos) defina el perfil y el horario únicos, «Hoy» los leerá de ahí.

export const estudianteEjemplo = { nombre: "Estudiante Prueba", grado: "10.º B" };

type Clase = { inicio: string; fin: string; materia: string; profesor: string; salon: string };

// Lunes (1) a viernes (5).
const BASE: Clase[] = [
  { inicio: "07:30", fin: "08:15", materia: "Matemáticas", profesor: "Prof. Prueba A", salon: "Salón 201" },
  { inicio: "08:15", fin: "09:00", materia: "Español", profesor: "Prof. Prueba B", salon: "Salón 201" },
  { inicio: "09:20", fin: "10:05", materia: "Ciencias", profesor: "Prof. Prueba C", salon: "Laboratorio 1" },
  { inicio: "10:05", fin: "10:50", materia: "Inglés", profesor: "Prof. Prueba D", salon: "Salón 204" },
  { inicio: "11:30", fin: "12:15", materia: "Historia", profesor: "Prof. Prueba E", salon: "Salón 201" },
  { inicio: "12:15", fin: "13:00", materia: "Tecnología", profesor: "Prof. Prueba F", salon: "AI Lab" },
];

const rotar = (n: number) => [...BASE.slice(n), ...BASE.slice(0, n)].map((c, i) => ({ ...c, inicio: BASE[i].inicio, fin: BASE[i].fin }));

export const horarioEjemplo: Record<number, Clase[]> = {
  1: rotar(0),
  2: rotar(2),
  3: rotar(4),
  4: rotar(1),
  5: rotar(3),
};

export const tareasEjemplo = [
  { titulo: "Guía de ecuaciones", materia: "Matemáticas", dias: 1 },
  { titulo: "Ensayo: un cuento corto", materia: "Español", dias: 3 },
  { titulo: "Informe de laboratorio", materia: "Ciencias", dias: 5 },
];
