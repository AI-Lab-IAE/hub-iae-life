import "server-only";
import type { Analisis, Repaso } from "./esquemas";

// El modelo tiende a repetir la posición de la respuesta correcta; se mezcla aquí para que no haya patrón.
function mezclarOpciones<T extends { opciones: string[]; correcta: number }>(pregunta: T): T {
  const orden = pregunta.opciones.map((_, i) => i);
  for (let i = orden.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [orden[i], orden[j]] = [orden[j], orden[i]];
  }
  return {
    ...pregunta,
    opciones: orden.map((i) => pregunta.opciones[i]),
    correcta: orden.indexOf(pregunta.correcta),
  };
}

function opcionValida(p: { opciones: string[]; correcta: number }) {
  return p.opciones.length >= 2 && p.correcta >= 0 && p.correcta < p.opciones.length;
}

export function limpiarAnalisis(analisis: Analisis): Analisis {
  const temas = analisis.temas
    .map((tema) => ({
      ...tema,
      preguntas: tema.preguntas
        .filter((p) => (p.tipo === "abierta" ? p.enunciado.trim().length > 0 : opcionValida(p)))
        .map((p) => (p.tipo === "opcion" ? mezclarOpciones(p) : { ...p, opciones: [], correcta: -1 })),
    }))
    .filter((tema) => tema.preguntas.length > 0);
  return { ...analisis, temas, suficiente: analisis.suficiente && temas.length > 0 };
}

export function limpiarRepaso(repaso: Repaso): Repaso {
  return {
    temas: repaso.temas.map((tema) => ({
      ...tema,
      preguntas: tema.preguntas.filter(opcionValida).map(mezclarOpciones),
    })),
  };
}
