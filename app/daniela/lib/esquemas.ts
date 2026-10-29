import { z } from "zod";

const Idioma = z.enum(["es", "en"]);

export const PedidoAsistenteSchema = z.object({
  lang: Idioma,
  contexto: z.string().max(20_000),
  mensajes: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(4000) }))
    .min(1)
    .max(40),
});

export const PedidoEstudiarSchema = z
  .object({
    lang: Idioma,
    tarea: z.string().max(200),
    texto: z.string().max(30_000).optional(),
    // Imagen como data URL (data:image/png;base64,...). Vercel acepta pedidos de hasta ~4.5 MB.
    imagen: z
      .string()
      .max(4_200_000)
      .regex(/^data:image\/(jpeg|png|gif|webp);base64,/)
      .optional(),
  })
  .refine((p) => Boolean(p.texto?.trim()) !== Boolean(p.imagen), { message: "Manda texto o imagen, uno de los dos." });

export const MaterialSchema = z.object({
  flashcards: z.array(z.object({ front: z.string(), back: z.string() })),
  quiz: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()),
      correctIndex: z.number().int(),
    }),
  ),
});
