import { z } from "zod";

export const PreguntaSchema = z.object({
  id: z.string(),
  tipo: z.enum(["opcion", "abierta"]),
  enunciado: z.string(),
  opciones: z.array(z.string()),
  correcta: z.number().int(),
  respuestaModelo: z.string(),
  explicacion: z.string(),
  fuente: z.string(),
});

export const TemaSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  contenido: z.string(),
  preguntas: z.array(PreguntaSchema),
});

export const AnalisisSchema = z.object({
  materia: z.string(),
  titulo: z.string(),
  resumen: z.string(),
  suficiente: z.boolean(),
  aviso: z.string(),
  temas: z.array(TemaSchema),
});

export const CalificacionSchema = z.object({
  resultados: z.array(
    z.object({
      id: z.string(),
      veredicto: z.enum(["correcta", "parcial", "incorrecta"]),
      feedback: z.string(),
    }),
  ),
});

export const PreguntaRepasoSchema = z.object({
  id: z.string(),
  enunciado: z.string(),
  opciones: z.array(z.string()),
  correcta: z.number().int(),
  explicacion: z.string(),
});

export const RepasoSchema = z.object({
  temas: z.array(
    z.object({
      temaId: z.string(),
      explicacion: z.string(),
      claves: z.array(z.string()),
      ejemplo: z.string(),
      tuError: z.string(),
      truco: z.string(),
      preguntas: z.array(PreguntaRepasoSchema),
    }),
  ),
});

export type Pregunta = z.infer<typeof PreguntaSchema>;
export type Tema = z.infer<typeof TemaSchema>;
export type Analisis = z.infer<typeof AnalisisSchema>;
export type Calificacion = z.infer<typeof CalificacionSchema>;
export type Repaso = z.infer<typeof RepasoSchema>;
export type PreguntaRepaso = z.infer<typeof PreguntaRepasoSchema>;

export const MaterialSchema = z.object({
  materia: z.string().max(80),
  texto: z.string().max(60_000),
  archivos: z
    .array(
      z.object({
        nombre: z.string().max(200),
        tipo: z.enum(["image/jpeg", "image/png", "image/webp", "application/pdf"]),
        datos: z.string().max(3_000_000),
      }),
    )
    .max(8),
});

export const PedidoCalificarSchema = z.object({
  materia: z.string().max(80),
  respuestas: z
    .array(
      z.object({
        id: z.string().max(40),
        tema: z.string().max(200),
        contenidoTema: z.string().max(3000),
        enunciado: z.string().max(1000),
        respuestaModelo: z.string().max(2000),
        respuestaAlumno: z.string().max(2000),
      }),
    )
    .min(1)
    .max(12),
});

export const PedidoRepasoSchema = z.object({
  materia: z.string().max(80),
  temas: z
    .array(
      z.object({
        temaId: z.string().max(40),
        nombre: z.string().max(200),
        contenido: z.string().max(3000),
        estado: z.enum(["ciego", "pendiente", "fragil", "domina"]),
        fallos: z
          .array(
            z.object({
              enunciado: z.string().max(1000),
              respuestaAlumno: z.string().max(2000),
              respuestaCorrecta: z.string().max(2000),
              seguridad: z.enum(["seguro", "dudo", "adivino"]),
            }),
          )
          .max(6),
      }),
    )
    .min(1)
    .max(4),
});

export type PedidoRepaso = z.infer<typeof PedidoRepasoSchema>;
