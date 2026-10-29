// Datos inventados para la demo. Nada de nombres reales.

export type Estudiante = { id: string; nombre: string; grado: string; salon: string };

export type TipoAudiencia = "todos" | "grado" | "salon" | "individual";

export type Aviso = {
  id: string;
  texto: string;
  urgente: boolean;
  audiencia: string; // descripción legible: "Salón 10A", "Grado 11", ...
  destinatarios: string[]; // ids de estudiantes, resueltos al publicar
  vistos: Record<string, string>; // id de estudiante -> fecha ISO en que lo vio
  creado: string; // fecha ISO
};

export const estudiantes: Estudiante[] = [
  { id: "e1", nombre: "Estudiante Prueba 1", grado: "10", salon: "10A" },
  { id: "e2", nombre: "Estudiante Prueba 2", grado: "10", salon: "10A" },
  { id: "e3", nombre: "Estudiante Prueba 3", grado: "10", salon: "10A" },
  { id: "e4", nombre: "Estudiante Prueba 4", grado: "10", salon: "10B" },
  { id: "e5", nombre: "Estudiante Prueba 5", grado: "10", salon: "10B" },
  { id: "e6", nombre: "Estudiante Prueba 6", grado: "10", salon: "10B" },
  { id: "e7", nombre: "Estudiante Prueba 7", grado: "11", salon: "11A" },
  { id: "e8", nombre: "Estudiante Prueba 8", grado: "11", salon: "11A" },
  { id: "e9", nombre: "Estudiante Prueba 9", grado: "11", salon: "11B" },
  { id: "e10", nombre: "Estudiante Prueba 10", grado: "11", salon: "11B" },
];

export const grados = [...new Set(estudiantes.map((e) => e.grado))];
export const salones = [...new Set(estudiantes.map((e) => e.salon))];

/** Avisos con los que arranca la demo, para que no se vea vacía. */
export const avisosIniciales: Aviso[] = [
  {
    id: "a1",
    texto: "Mañana la clase de Física del 10A es en el laboratorio 2.",
    urgente: true,
    audiencia: "Salón 10A",
    destinatarios: ["e1", "e2", "e3"],
    vistos: { e1: "2026-10-27T13:05:00.000Z" },
    creado: "2026-10-27T12:30:00.000Z",
  },
  {
    id: "a2",
    texto: "El viernes hay salida temprana a las 12:30.",
    urgente: false,
    audiencia: "Toda la escuela",
    destinatarios: estudiantes.map((e) => e.id),
    vistos: { e2: "2026-10-26T15:00:00.000Z", e4: "2026-10-26T16:10:00.000Z", e7: "2026-10-26T18:45:00.000Z" },
    creado: "2026-10-26T14:00:00.000Z",
  },
];

/** Estudiantes que reciben un aviso según la audiencia elegida. */
export function resolverAudiencia(
  tipo: TipoAudiencia,
  valor: string,
  ids: string[]
): { destinatarios: string[]; descripcion: string } {
  if (tipo === "todos") return { destinatarios: estudiantes.map((e) => e.id), descripcion: "Toda la escuela" };
  if (tipo === "grado")
    return {
      destinatarios: estudiantes.filter((e) => e.grado === valor).map((e) => e.id),
      descripcion: `Grado ${valor}`,
    };
  if (tipo === "salon")
    return {
      destinatarios: estudiantes.filter((e) => e.salon === valor).map((e) => e.id),
      descripcion: `Salón ${valor}`,
    };
  return { destinatarios: ids, descripcion: `${ids.length} estudiante(s)` };
}

export function nombreDe(id: string): string {
  return estudiantes.find((e) => e.id === id)?.nombre ?? "—";
}
