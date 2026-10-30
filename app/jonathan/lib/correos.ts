import { CLOSINGS, REASON_PHRASES } from "./datos";
import type { EmailOptions, EmailState, TeacherGroup, Tone } from "./tipos";

/* ---------- Generador de correos: tono x largo ---------- */

type ToneTemplate = {
  greet: (t: string) => string;
  poss: string;
  intro: (d: string, p: string) => string;
  shortIntro: (d: string, p: string) => string;
  closings: string[];
  shortClosing: string;
  longExtra: string;
  thanks: string;
  sign: (n: string) => string;
  shortSign: (n: string) => string;
};

const EMAIL_TONES: Record<Tone, ToneTemplate> = {
  standard: {
    greet: (t) => `Hola ${t},`,
    poss: "su",
    intro: (d, p) => `Quería informarle que no podré asistir a ${d} porque ${p}.`,
    shortIntro: (d, p) => `No podré asistir a ${d} porque ${p}.`,
    closings: CLOSINGS,
    shortClosing: "¿Hay algo que deba recuperar?",
    longExtra:
      "Entiendo que faltar puede afectar el avance de la clase, así que me comprometo a ponerme al día con el contenido, las tareas y cualquier evaluación pendiente lo antes posible. Si es necesario, puedo acercarme a usted en otro momento para resolver dudas.",
    thanks: "Muchas gracias.",
    sign: (n) => n,
    shortSign: (n) => `Gracias, ${n}`,
  },
  formal: {
    greet: (t) => `Estimado/a ${t}:`,
    poss: "su",
    intro: (d, p) => `Le escribo para informarle que no podré asistir a ${d} porque ${p}.`,
    shortIntro: (d, p) => `Le informo que no asistiré a ${d} porque ${p}.`,
    closings: [
      "Le agradecería que me indicara si existe algún trabajo o contenido que deba recuperar.",
      "Quedo atento a sus indicaciones sobre el material o las actividades pendientes.",
      "Agradeceré me informe si hay alguna evaluación o tarea que deba reponer.",
    ],
    shortClosing: "Agradeceré sus indicaciones sobre el material pendiente.",
    longExtra:
      "Soy consciente de que mi ausencia puede afectar el desarrollo normal de la clase, por lo cual me comprometo a ponerme al día con los contenidos, las tareas y las evaluaciones correspondientes a la brevedad posible. De ser necesario, quedo a su disposición para acordar un horario en el que pueda resolver cualquier duda.",
    thanks: "Agradezco de antemano su comprensión.",
    sign: (n) => `Atentamente,\n${n}`,
    shortSign: (n) => `Atentamente,\n${n}`,
  },
  neutral: {
    greet: (t) => `Buen día ${t},`,
    poss: "su",
    intro: (d, p) => `Le informo que no asistiré a ${d} porque ${p}.`,
    shortIntro: (d, p) => `No asistiré a ${d} porque ${p}.`,
    closings: [
      "Agradeceré cualquier indicación sobre el material o las tareas pendientes.",
      "Quedo atento a la información sobre lo que deba recuperar.",
      "Por favor, indíqueme si hay actividades que deba reponer.",
    ],
    shortClosing: "Agradeceré indicaciones sobre el material pendiente.",
    longExtra:
      "A mi regreso revisaré el contenido y las tareas correspondientes a los días de ausencia. Si es necesario, puedo coordinar un horario para resolver dudas.",
    thanks: "Gracias.",
    sign: (n) => `Saludos,\n${n}`,
    shortSign: (n) => `Saludos,\n${n}`,
  },
  casual: {
    greet: (t) => `Hola ${t},`,
    poss: "tu",
    intro: (d, p) => `Te escribo para avisarte que no voy a poder ir a ${d} porque ${p}.`,
    shortIntro: (d, p) => `Te aviso que no voy a poder ir a ${d} porque ${p}.`,
    closings: [
      "¿Me puedes decir si hay algo que deba ponerme al día?",
      "Si hay tarea o material, me avisas y lo reviso cuando vuelva.",
      "Cuéntame si tengo algo pendiente para recuperar.",
    ],
    shortClosing: "¿Hay algo que deba recuperar?",
    longExtra:
      "Sé que me voy a perder cosas de la clase, así que apenas vuelva me pongo al día con el material y las tareas. Si necesitas que hablemos en algún recreo o después de clase para resolver dudas, con gusto.",
    thanks: "¡Gracias!",
    sign: (n) => n,
    shortSign: (n) => `¡Gracias! ${n}`,
  },
};

function describeClasses(cls: TeacherGroup, poss: string): string {
  const occ = cls.occurrences || [];
  if (occ.length === 0) return `${poss} clase de ${cls.subject}`;
  const bySubject: Record<string, string[]> = {};
  occ.forEach((o) => {
    (bySubject[o.subject] = bySubject[o.subject] || []).push(o.dateText);
  });
  const parts = Object.keys(bySubject).map((subj) => `${subj} (${bySubject[subj].join(", ")})`);
  return (occ.length === 1 ? `${poss} clase de ` : `${poss}s clases de `) + parts.join(" y ");
}

export function buildEmail(
  cls: TeacherGroup,
  reasonId: string,
  extra: string,
  studentName: string,
  opts: EmailOptions,
): { subject: string; body: string } {
  const T = EMAIL_TONES[opts.tone] || EMAIL_TONES.standard;
  const phrases = REASON_PHRASES[reasonId] || REASON_PHRASES.otro;
  const phrase = phrases[opts.phraseIdx % phrases.length];
  const d = describeClasses(cls, T.poss);
  const extraTxt = extra && extra.trim() ? ` ${extra.trim()}` : "";
  const closing = T.closings[opts.closingIdx % T.closings.length];
  const greet = T.greet(cls.teacher);

  let body;
  if (opts.length === "short") {
    body = `${greet}\n\n${T.shortIntro(d, phrase)}${extraTxt} ${T.shortClosing}\n\n${T.shortSign(studentName)}`;
  } else if (opts.length === "long") {
    body = `${greet}\n\n${T.intro(d, phrase)}${extraTxt}\n\n${T.longExtra}\n\n${closing}\n\n${T.thanks}\n\n${T.sign(studentName)}`;
  } else {
    body = `${greet}\n\n${T.intro(d, phrase)}${extraTxt}\n\n${closing}\n\n${T.thanks}\n\n${T.sign(studentName)}`;
  }
  return {
    subject: opts.length === "short" ? `Ausencia – ${studentName}` : `Ausencia a clase – ${studentName}`,
    body,
  };
}

/* Crea el estado de un correo. Con "prev" conserva el tono y el largo elegidos
   pero varía las frases (botón "Regenerar"). */
export function generateEmail(
  cls: TeacherGroup,
  reasonId: string,
  extra: string,
  studentName: string,
  prev?: EmailState,
): EmailState {
  const phrases = REASON_PHRASES[reasonId] || REASON_PHRASES.otro;
  const opts: EmailOptions = {
    tone: prev ? prev.tone : "standard",
    length: prev ? prev.length : "normal",
    phraseIdx: Math.floor(Math.random() * phrases.length),
    closingIdx: Math.floor(Math.random() * 3),
  };
  return { ...opts, ...buildEmail(cls, reasonId, extra, studentName, opts) };
}

export function buildMailtoUrl(to: string, subject: string, body: string, cc: string): string {
  const ccPart = cc ? `cc=${encodeURIComponent(cc)}&` : "";
  return `mailto:${encodeURIComponent(to)}?${ccPart}subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/* Abre directamente la ventana de redactar de Gmail (en el navegador) con todo precargado */
export function buildGmailUrl(to: string, subject: string, body: string, cc: string): string {
  const ccPart = cc ? `&cc=${encodeURIComponent(cc)}` : "";
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}${ccPart}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || "").trim());
}
