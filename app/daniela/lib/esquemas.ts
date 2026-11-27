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
