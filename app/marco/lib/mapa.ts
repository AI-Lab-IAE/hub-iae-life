import type { Analisis, Pregunta, Repaso } from "./esquemas";

export type Seguridad = "seguro" | "dudo" | "adivino";
export type Veredicto = "correcta" | "parcial" | "incorrecta";
export type Estado = "ciego" | "pendiente" | "fragil" | "domina";

export type Respuesta = {
  elegida?: number;
  texto?: string;
  seguridad: Seguridad;
  veredicto?: Veredicto;
  feedback?: string;
};

export type Sesion = {
  id: string;
  creada: number;
  analisis: Analisis;
  respuestas: Record<string, Respuesta>;
  repaso?: Repaso;
  respuestasRepaso?: Record<string, Respuesta>;
  ejemplo?: boolean;
};

export const ESTADOS: Record<
  Estado,
  { nombre: string; corto: string; descripcion: string; color: string; fondo: string; orden: number }
> = {
  ciego: {
    nombre: "Punto ciego",
    corto: "Crees que lo sabes, pero no",
    descripcion: "Fallaste estando seguro. Es lo más peligroso: el día del examen no lo vas a ver venir.",
    color: "#e0492f",
    fondo: "#fde6df",
    orden: 0,
  },
  pendiente: {
    nombre: "Por aprender",
    corto: "Sabes que te falta",
    descripcion: "Fallaste y lo sabías. Al menos no te va a sorprender: toca aprenderlo desde la base.",
    color: "#3e5bd8",
    fondo: "#e3e8fc",
    orden: 1,
  },
  fragil: {
    nombre: "Frágil",
    corto: "Aciertas, pero dudando",
    descripcion: "Respondiste bien, pero no estabas seguro. Con nervios de examen se te puede ir.",
    color: "#d98a0f",
    fondo: "#fcefd6",
    orden: 2,
  },
  domina: {
    nombre: "Lo dominas",
    corto: "Sabes y sabes que sabes",
    descripcion: "Acertaste con seguridad. No gastes tiempo repasando esto.",
    color: "#1f9466",
    fondo: "#dcf2e7",
    orden: 3,
  },
};

export function acierto(pregunta: Pregunta, r: Respuesta | undefined): number | null {
  if (!r) return null;
  if (pregunta.tipo === "opcion") return r.elegida === pregunta.correcta ? 1 : 0;
  if (!r.veredicto) return null;
  return r.veredicto === "correcta" ? 1 : r.veredicto === "parcial" ? 0.5 : 0;
}

export type ResultadoTema = {
  temaId: string;
  estado: Estado;
  aciertos: number;
  total: number;
  ciegos: number;
};

export function evaluarTema(
  preguntas: { pregunta: Pregunta; respuesta: Respuesta | undefined }[],
  temaId: string,
): ResultadoTema {
  let suma = 0;
  let total = 0;
  let ciegos = 0;
  let dudas = 0;
  for (const { pregunta, respuesta } of preguntas) {
    const a = acierto(pregunta, respuesta);
    if (a === null || !respuesta) continue;
    total++;
    suma += a;
    const seguro = respuesta.seguridad === "seguro";
    if (a < 0.5 && seguro) ciegos++;
    if (a >= 0.5 && !seguro) dudas++;
  }
  let estado: Estado;
  if (ciegos > 0) estado = "ciego";
  else if (total === 0 || suma / total < 0.6) estado = "pendiente";
  else if (dudas > 0 || suma < total) estado = "fragil";
  else estado = "domina";
  return { temaId, estado, aciertos: suma, total, ciegos };
}

export function evaluarSesion(sesion: Sesion) {
  const temas = sesion.analisis.temas.map((tema) =>
    evaluarTema(
      tema.preguntas.map((p) => ({ pregunta: p, respuesta: sesion.respuestas[p.id] })),
      tema.id,
    ),
  );

  let calibradas = 0;
  let contadas = 0;
  let aciertos = 0;
  for (const tema of sesion.analisis.temas) {
    for (const p of tema.preguntas) {
      const r = sesion.respuestas[p.id];
      const a = acierto(p, r);
      if (a === null || !r) continue;
      contadas++;
      aciertos += a;
      const seguro = r.seguridad === "seguro";
      if ((a >= 0.5 && seguro) || (a < 0.5 && !seguro)) calibradas++;
    }
  }

  return {
    temas,
    nota: contadas ? Math.round((aciertos / contadas) * 100) : 0,
    calibracion: contadas ? Math.round((calibradas / contadas) * 100) : 0,
    ciegos: temas.filter((t) => t.estado === "ciego").length,
  };
}

export function evaluarRepaso(sesion: Sesion, temaId: string): number | null {
  const repasoTema = sesion.repaso?.temas.find((t) => t.temaId === temaId);
  if (!repasoTema || !sesion.respuestasRepaso || repasoTema.preguntas.length === 0) return null;
  const respondidas = repasoTema.preguntas.filter((p) => sesion.respuestasRepaso?.[p.id]);
  if (respondidas.length < repasoTema.preguntas.length) return null;
  const bien = respondidas.filter((p) => sesion.respuestasRepaso?.[p.id]?.elegida === p.correcta).length;
  return Math.round((bien / repasoTema.preguntas.length) * 100);
}
