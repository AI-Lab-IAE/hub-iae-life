// Generador de correos de AvisIA: tono × largo × motivo, con frases de Jonathan.
// No usa IA: "Regenerar" solo elige otra combinación de frases.
import type { Clase } from "./horario";
import type { Ausencia, Correo, Largo, MotivoId, Opciones, Tono } from "./tipos";

export const MOTIVOS: { id: MotivoId; etiqueta: string }[] = [
  { id: "enfermedad", etiqueta: "Enfermedad" },
  { id: "cita", etiqueta: "Cita médica" },
  { id: "competencia", etiqueta: "Competencia" },
  { id: "viaje", etiqueta: "Viaje familiar" },
  { id: "otro", etiqueta: "Otro" },
];

// Frases que completan "no podré asistir ... porque ___".
const FRASES: Record<MotivoId, string[]> = {
  enfermedad: ["no me estoy sintiendo bien", "no me encuentro bien de salud"],
  cita: ["tengo una cita médica programada", "debo asistir a una cita médica"],
  competencia: [
    "estaré representando al colegio en una competencia",
    "voy a participar en una competencia en nombre del colegio",
  ],
  viaje: ["estaré de viaje con mi familia", "tengo un viaje familiar programado"],
  otro: ["surgió un compromiso que no pude reprogramar", "tengo un compromiso que no puedo mover"],
};

export const TONOS: { id: Tono; etiqueta: string }[] = [
  { id: "formal", etiqueta: "Formal" },
  { id: "neutral", etiqueta: "Neutral" },
  { id: "estandar", etiqueta: "Estándar" },
  { id: "casual", etiqueta: "Casual" },
];

export const LARGOS: { id: Largo; etiqueta: string }[] = [
  { id: "corto", etiqueta: "Corto" },
  { id: "medio", etiqueta: "Medio" },
  { id: "largo", etiqueta: "Largo" },
];

type Plantilla = {
  saludo: (profe: string) => string;
  su: string; // "su" (de usted) o "tu"
  intro: (clases: string, motivo: string) => string;
  introCorta: (clases: string, motivo: string) => string;
  cierres: string[];
  cierresCortos: string[]; // también 3, para que "Regenerar" cambie el correo corto
  extraLargo: string;
  gracias: string;
  firma: (n: string) => string;
  firmaCorta: (n: string) => string;
};

// " porque ___" solo si hay motivo.
const porque = (m: string) => (m ? ` porque ${m}` : "");

const PLANTILLAS: Record<Tono, Plantilla> = {
  formal: {
    saludo: (p) => `Estimado/a ${p}:`,
    su: "su",
    intro: (c, m) => `Le escribo para informarle que no podré asistir a ${c}${porque(m)}.`,
    introCorta: (c, m) => `Le informo que no asistiré a ${c}${porque(m)}.`,
    cierres: [
      "Le agradecería que me indicara si existe algún trabajo o contenido que deba recuperar.",
      "Quedo atento a sus indicaciones sobre el material o las actividades pendientes.",
      "Agradeceré me informe si hay alguna evaluación o tarea que deba reponer.",
    ],
    cierresCortos: [
      "Agradeceré sus indicaciones sobre el material pendiente.",
      "Quedo atento a lo que deba recuperar.",
      "Le agradeceré que me indique si hay tareas pendientes.",
    ],
    extraLargo:
      "Soy consciente de que mi ausencia puede afectar el desarrollo normal de la clase, por lo cual me comprometo a ponerme al día con los contenidos, las tareas y las evaluaciones correspondientes a la brevedad posible. De ser necesario, quedo a su disposición para acordar un horario en el que pueda resolver cualquier duda.",
    gracias: "Agradezco de antemano su comprensión.",
    firma: (n) => `Atentamente,\n${n}`,
    firmaCorta: (n) => `Atentamente,\n${n}`,
  },
  neutral: {
    saludo: (p) => `Buen día, ${p}:`,
    su: "su",
    intro: (c, m) => `Le informo que no asistiré a ${c}${porque(m)}.`,
    introCorta: (c, m) => `No asistiré a ${c}${porque(m)}.`,
    cierres: [
      "Agradeceré cualquier indicación sobre el material o las tareas pendientes.",
      "Quedo atento a la información sobre lo que deba recuperar.",
      "Por favor, indíqueme si hay actividades que deba reponer.",
    ],
    cierresCortos: [
      "Agradeceré indicaciones sobre el material pendiente.",
      "Por favor, indíqueme qué debo recuperar.",
      "Quedo atento a las tareas pendientes.",
    ],
    extraLargo:
      "A mi regreso revisaré el contenido y las tareas correspondientes a la clase. Si es necesario, puedo coordinar un horario para resolver dudas.",
    gracias: "Gracias.",
    firma: (n) => `Saludos,\n${n}`,
    firmaCorta: (n) => `Saludos,\n${n}`,
  },
  estandar: {
    saludo: (p) => `Hola, ${p}:`,
    su: "su",
    intro: (c, m) => `Quería informarle que no podré asistir a ${c}${porque(m)}.`,
    introCorta: (c, m) => `No podré asistir a ${c}${porque(m)}.`,
    cierres: [
      "¿Podría indicarme si hay algún trabajo o contenido que deba recuperar?",
      "Le agradecería si me puede compartir qué material voy a perder para ponerme al día.",
      "Quedo atento a cualquier tarea o material que deba revisar al volver.",
    ],
    cierresCortos: [
      "¿Hay algo que deba recuperar?",
      "¿Me podría decir qué material voy a perder?",
      "Me pondré al día al volver.",
    ],
    extraLargo:
      "Entiendo que faltar puede afectar el avance de la clase, así que me comprometo a ponerme al día con el contenido, las tareas y cualquier evaluación pendiente lo antes posible. Si es necesario, puedo acercarme a usted en otro momento para resolver dudas.",
    gracias: "Muchas gracias.",
    firma: (n) => n,
    firmaCorta: (n) => `Gracias,\n${n}`,
  },
  casual: {
    saludo: (p) => `Hola, ${p}:`,
    su: "tu",
    intro: (c, m) => `Te escribo para avisarte que no voy a poder ir a ${c}${porque(m)}.`,
    introCorta: (c, m) => `Te aviso que no voy a poder ir a ${c}${porque(m)}.`,
    cierres: [
      "¿Me puedes decir si hay algo con lo que deba ponerme al día?",
      "Si hay tarea o material, me avisas y lo reviso cuando vuelva.",
      "Cuéntame si tengo algo pendiente para recuperar.",
    ],
    cierresCortos: [
      "¿Hay algo que deba recuperar?",
      "Si hay tarea, me avisas.",
      "Cuando vuelva me pongo al día.",
    ],
    extraLargo:
      "Sé que me voy a perder cosas de la clase, así que apenas vuelva me pongo al día con el material y las tareas. Si necesitas que hablemos en algún recreo o después de clase para resolver dudas, con gusto.",
    gracias: "¡Gracias!",
    firma: (n) => n,
    firmaCorta: (n) => `¡Gracias!\n${n}`,
  },
};

// "2026-10-30" -> "viernes 30 de octubre"
export function fechaEnPalabras(fecha: string): string {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const d = new Date(anio, mes - 1, dia);
  const nombreDia = d.toLocaleDateString("es", { weekday: "long" });
  const nombreMes = d.toLocaleDateString("es", { month: "long" });
  return `${nombreDia} ${dia} de ${nombreMes}`;
}

// ["a", "b", "c"] -> "a, b y c"
export function unir(partes: string[]): string {
  if (partes.length <= 1) return partes.join("");
  return `${partes.slice(0, -1).join(", ")} y ${partes[partes.length - 1]}`;
}

export function materiasDe(clases: Clase[]): string {
  return unir([...new Set(clases.map((c) => c.materia))]);
}

// "su clase de Matemáticas (8:05–8:45) del viernes 30 de octubre"
function describirClases(clases: Clase[], su: string, fecha: string): string {
  const horas = unir(clases.map((c) => `${c.inicio}–${c.fin}`));
  const varias = clases.length > 1;
  return `${su}${varias ? "s clases" : " clase"} de ${materiasDe(clases)} (${horas}) del ${fechaEnPalabras(fecha)}`;
}

function frasesDe(ausencia: Ausencia): string[] {
  return ausencia.motivo ? FRASES[ausencia.motivo] : [""];
}

const CIERRES = 3; // todas las plantillas tienen 3 cierres

function escribir(clases: Clase[], ausencia: Ausencia, o: Opciones): { asunto: string; cuerpo: string } {
  const T = PLANTILLAS[o.tono];
  const frases = frasesDe(ausencia);
  const motivo = frases[o.frase % frases.length];
  const c = describirClases(clases, T.su, ausencia.fecha);
  const detalle = ausencia.detalle.trim();
  const extra = detalle ? ` ${detalle.replace(/[.\s]*$/, "")}.` : "";
  const cierre = T.cierres[o.cierre % T.cierres.length];
  const saludo = T.saludo(clases[0].profesor.nombre);
  const nombre = ausencia.nombre;

  let cuerpo: string;
  if (o.largo === "corto") {
    cuerpo = `${saludo}\n\n${T.introCorta(c, motivo)}${extra} ${T.cierresCortos[o.cierre % T.cierresCortos.length]}\n\n${T.firmaCorta(nombre)}`;
  } else if (o.largo === "largo") {
    cuerpo = `${saludo}\n\n${T.intro(c, motivo)}${extra}\n\n${T.extraLargo}\n\n${cierre}\n\n${T.gracias}\n\n${T.firma(nombre)}`;
  } else {
    cuerpo = `${saludo}\n\n${T.intro(c, motivo)}${extra}\n\n${cierre}\n\n${T.gracias}\n\n${T.firma(nombre)}`;
  }

  const asunto =
    o.largo === "corto"
      ? `Ausencia – ${nombre}`
      : `Ausencia a ${materiasDe(clases)} el ${fechaEnPalabras(ausencia.fecha)} – ${nombre}`;
  return { asunto, cuerpo };
}

// Reescribe un correo con otras opciones (tono, largo o frases).
export function reescribir(correo: Correo, ausencia: Ausencia, cambios: Partial<Opciones>): Correo {
  const o: Opciones = {
    tono: correo.tono,
    largo: correo.largo,
    frase: correo.frase,
    cierre: correo.cierre,
    ...cambios,
  };
  return { ...correo, ...o, ...escribir(correo.clases, ausencia, o) };
}

// "Regenerar": otra combinación de frase y cierre, siempre distinta de la actual.
export function regenerar(correo: Correo, ausencia: Ausencia): Correo {
  const frases = frasesDe(ausencia).length;
  const total = frases * CIERRES;
  const actual = (correo.frase % frases) * CIERRES + (correo.cierre % CIERRES);
  const otra = (actual + 1 + Math.floor(Math.random() * (total - 1))) % total;
  return reescribir(correo, ausencia, { frase: Math.floor(otra / CIERRES), cierre: otra % CIERRES });
}

// Un correo por cada profesor, en el orden del horario (si pierdes dos horas con él, va en el mismo).
export function generarCorreos(ausencia: Ausencia, tono: Tono = "estandar", largo: Largo = "medio"): Correo[] {
  const grupos = new Map<string, Clase[]>();
  for (const clase of ausencia.clases) {
    const k = clase.profesor.correo;
    grupos.set(k, [...(grupos.get(k) ?? []), clase]);
  }
  return [...grupos.entries()].map(([id, clases], i) => {
    const o: Opciones = { tono, largo, frase: i, cierre: i };
    return { id, profesor: clases[0].profesor, clases, ...o, ...escribir(clases, ausencia, o) };
  });
}

// La misma regla que usa Perfil para el correo de los padres. Los caracteres raros (?, &, #, %...)
// no rompen el enlace porque cada parte se codifica con encodeURIComponent.
const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function correoValido(v: string | undefined): v is string {
  return !!v && CORREO.test(v.trim());
}

// Solo deja pasar un correo válido; si no, queda vacío y el enlace sale sin ese campo.
const limpio = (v: string) => (correoValido(v) ? v.trim() : "");

// Abre la app de correo del dispositivo con todo escrito. No envía nada solo.
export function enlaceMailto(para: string, asunto: string, cuerpo: string, cc: string): string {
  const c = limpio(cc);
  const partes = [
    c && `cc=${encodeURIComponent(c)}`,
    `subject=${encodeURIComponent(asunto)}`,
    `body=${encodeURIComponent(cuerpo)}`,
  ];
  return `mailto:${encodeURIComponent(limpio(para))}?${partes.filter(Boolean).join("&")}`;
}

// Abre la ventana de "Redactar" de Gmail en el navegador, ya escrita. El estudiante revisa y envía.
export function enlaceGmail(para: string, asunto: string, cuerpo: string, cc: string): string {
  const c = limpio(cc);
  const partes = [
    "view=cm",
    "fs=1",
    `to=${encodeURIComponent(limpio(para))}`,
    c && `cc=${encodeURIComponent(c)}`,
    `su=${encodeURIComponent(asunto)}`,
    `body=${encodeURIComponent(cuerpo)}`,
  ];
  return `https://mail.google.com/mail/?${partes.filter(Boolean).join("&")}`;
}
