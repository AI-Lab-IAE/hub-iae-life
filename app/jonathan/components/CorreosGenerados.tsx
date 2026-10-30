import { useState, type CSSProperties } from "react";
import { buildEmail, buildGmailUrl, buildMailtoUrl, generateEmail, isValidEmail } from "../lib/correos";
import { LENGTH_ORDER, TONE_ORDER } from "../lib/datos";
import type { EmailOptions, EmailState, Report, SentEmail, Student, TeacherGroup } from "../lib/tipos";
import { Icon } from "./Iconos";
import { TopMobileBrand } from "./Navegacion";

/* ---------- Slider de opciones (tono y longitud) ---------- */

function OptionSlider<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const idx = Math.max(0, options.findIndex((o) => o.id === value));
  const frac = options.length > 1 ? idx / (options.length - 1) : 0;
  return (
    <div style={{ marginTop: 14 }}>
      <div className="field-label" style={{ marginBottom: 0 }}>
        {label}
      </div>
      <input
        type="range"
        className="slider"
        min={0}
        max={options.length - 1}
        step={1}
        value={idx}
        aria-label={label}
        style={{ "--pct": `calc(12px + (100% - 24px) * ${frac})` } as CSSProperties}
        onChange={(e) => onChange(options[Number(e.target.value)].id)}
      />
      <div className="slider-labels">
        {options.map((o, i) => (
          <button key={o.id} type="button" className={"slider-label" + (i === idx ? " active" : "")} onClick={() => onChange(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Pantalla: Correos generados ---------- */

type Props = {
  report: Report;
  classes: TeacherGroup[];
  student: Student;
  onBack: () => void;
  onSent: (sent: SentEmail[]) => void;
};

export default function CorreosGenerados({ report, classes, student, onBack, onSent }: Props) {
  const [emails, setEmails] = useState<Record<string, EmailState>>(() => {
    const map: Record<string, EmailState> = {};
    classes.forEach((c) => {
      map[c.id] = generateEmail(c, report.reasonId, report.extra, student.name);
    });
    return map;
  });
  const [activeTeachers, setActiveTeachers] = useState(() => new Set(classes.map((c) => c.id)));
  const [provider, setProvider] = useState<"gmail" | "mailto">("gmail");
  const [openedIds, setOpenedIds] = useState<Set<string>>(() => new Set()); // correos ya abiertos (uno por profesor)
  const [linkVisibleIds, setLinkVisibleIds] = useState<Set<string>>(() => new Set()); // tarjetas con el enlace a la vista
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const remaining = classes.filter((c) => activeTeachers.has(c.id));
  const openedInRemaining = remaining.filter((c) => openedIds.has(c.id));
  const nextTeacher = remaining.find((c) => !openedIds.has(c.id)) || null;
  const allOpened = remaining.length > 0 && !nextTeacher;

  const parentCc = isValidEmail(student.parentEmail) ? student.parentEmail.trim() : "";

  function urlFor(c: TeacherGroup, which: "gmail" | "mailto") {
    const email = emails[c.id];
    return which === "gmail"
      ? buildGmailUrl(c.teacherEmail, email.subject, email.body, parentCc)
      : buildMailtoUrl(c.teacherEmail, email.subject, email.body, parentCc);
  }

  function updateEmail(id: string, field: "subject" | "body", value: string) {
    setEmails((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }
  function regenerate(cls: TeacherGroup) {
    setEmails((prev) => ({ ...prev, [cls.id]: generateEmail(cls, report.reasonId, report.extra, student.name, prev[cls.id]) }));
  }
  // Cambia el tono y/o el largo y reescribe el mensaje con esas opciones
  function changeEmail(cls: TeacherGroup, patch: Partial<EmailOptions>) {
    setEmails((prev) => {
      const cur = prev[cls.id];
      const opts: EmailOptions = { tone: cur.tone, length: cur.length, phraseIdx: cur.phraseIdx, closingIdx: cur.closingIdx, ...patch };
      return { ...prev, [cls.id]: { ...opts, ...buildEmail(cls, report.reasonId, report.extra, student.name, opts) } };
    });
  }
  function removeTeacher(id: string) {
    setActiveTeachers((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  // Cada apertura es el clic real de un enlace (no window.open), así que ningún
  // bloqueador de ventanas emergentes ni política de Chromebook escolar la bloquea.
  function handleOpened(id: string) {
    setOpenedIds((prev) => new Set(prev).add(id));
  }

  function toggleLink(id: string) {
    setLinkVisibleIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function copyLink(id: string, url: string) {
    const done = () => {
      setCopiedId(id);
      setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(done);
    } else {
      done();
    }
  }

  function handleFinish() {
    onSent(
      remaining.map((c) => ({
        teacher: c.teacher,
        subject: emails[c.id].subject,
        body: emails[c.id].body,
        cc: parentCc,
      })),
    );
  }

  return (
    <div className="page-wrap fade-in">
      <TopMobileBrand />
      <button className="btn-ghost" style={{ marginBottom: 10 }} onClick={onBack}>
        ← Volver a clases afectadas
      </button>
      <h1 style={{ fontSize: 23, marginBottom: 6 }}>Correos generados</h1>
      <p style={{ color: "var(--muted)", marginTop: 0, marginBottom: 22, fontSize: 14.5 }}>
        Un correo por profesor. Revisa y edita cada uno, y ábrelos de a uno para enviarlos — así ningún navegador bloquea la apertura.
      </p>

      {parentCc ? (
        <div
          style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.5, marginBottom: 20, padding: "12px 14px", background: "var(--brand-soft)", borderRadius: 12 }}
        >
          Cada correo se enviará con <strong style={{ color: "var(--ink)" }}>copia (CC)</strong> a tu padre/madre:{" "}
          <strong style={{ color: "var(--ink)" }}>{parentCc}</strong>
        </div>
      ) : (
        <div
          style={{ fontSize: 13.5, color: "var(--amber)", lineHeight: 1.5, marginBottom: 20, padding: "12px 14px", background: "var(--amber-soft)", borderRadius: 12 }}
        >
          Aún no tienes un correo válido de tu padre/madre, así que los correos irán sin copia. Agrégalo en la pestaña{" "}
          <strong>Perfil</strong> para incluirlo en CC.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 26 }}>
        {remaining.map((c) => {
          const email = emails[c.id];
          return (
            <div key={c.id} className="email-card soft-shadow">
              <div className="email-header">
                <div style={{ minWidth: 0, overflowWrap: "anywhere" }}>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>
                    {c.subject} — {c.teacher}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>Para: {c.teacherEmail}</div>
                  {parentCc && <div style={{ fontSize: 12, color: "var(--muted)" }}>CC: {parentCc}</div>}
                </div>
                <button className="btn-ghost" onClick={() => removeTeacher(c.id)} title="Quitar profesor" aria-label="Quitar profesor">
                  <Icon.x style={{ width: 16, height: 16 }} />
                </button>
              </div>
              <div className="email-body">
                <label className="field-label">Asunto</label>
                <input
                  className="text-input"
                  style={{ marginBottom: 14 }}
                  value={email.subject}
                  onChange={(e) => updateEmail(c.id, "subject", e.target.value)}
                />
                <label className="field-label">Mensaje</label>
                <textarea
                  className="text-input"
                  style={{ minHeight: 150 }}
                  value={email.body}
                  onChange={(e) => updateEmail(c.id, "body", e.target.value)}
                />
                <OptionSlider label="Tono" options={TONE_ORDER} value={email.tone} onChange={(v) => changeEmail(c, { tone: v })} />
                <OptionSlider label="Longitud" options={LENGTH_ORDER} value={email.length} onChange={(v) => changeEmail(c, { length: v })} />
                <div style={{ marginTop: 16 }}>
                  <button className="btn-secondary" style={{ width: "100%" }} onClick={() => regenerate(c)}>
                    Regenerar
                  </button>
                </div>
                <div style={{ marginTop: 10 }}>
                  <button className="btn-ghost" style={{ width: "100%" }} onClick={() => toggleLink(c.id)}>
                    {linkVisibleIds.has(c.id) ? "Ocultar enlace" : "Ver enlace"}
                  </button>
                  {linkVisibleIds.has(c.id) && (
                    <div style={{ marginTop: 10 }}>
                      <div className="field-label" style={{ marginBottom: 6 }}>
                        Enlace que se abre ({provider === "gmail" ? "Gmail" : "app de correo"})
                      </div>
                      <div className="link-box">{urlFor(c, provider)}</div>
                      <button className="btn-secondary" style={{ width: "100%", marginTop: 8 }} onClick={() => copyLink(c.id, urlFor(c, provider))}>
                        {copiedId === c.id ? "¡Copiado!" : "Copiar enlace"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {remaining.length === 0 && (
          <div className="card" style={{ textAlign: "center", color: "var(--muted)" }}>
            Quitaste a todos los profesores. Vuelve atrás para seleccionar de nuevo.
          </div>
        )}
      </div>

      <div className="card soft-shadow" style={{ marginBottom: 14 }}>
        <label className="field-label">Enviar con</label>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className={"chip" + (provider === "gmail" ? " selected" : "")}
            style={{ flex: 1 }}
            onClick={() => {
              setProvider("gmail");
              setOpenedIds(new Set());
            }}
          >
            Gmail
          </button>
          <button
            className={"chip" + (provider === "mailto" ? " selected" : "")}
            style={{ flex: 1 }}
            onClick={() => {
              setProvider("mailto");
              setOpenedIds(new Set());
            }}
          >
            App de correo
          </button>
        </div>
      </div>

      {remaining.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 12 }}>
          {remaining.map((c) => (
            <span
              key={c.id}
              style={{ width: 9, height: 9, borderRadius: "50%", background: openedIds.has(c.id) ? "var(--success)" : "var(--line)" }}
            ></span>
          ))}
        </div>
      )}

      {!allOpened ? (
        <a
          className="btn-primary"
          style={{
            width: "100%",
            fontSize: 15,
            opacity: remaining.length === 0 ? 0.5 : 1,
            pointerEvents: remaining.length === 0 ? "none" : "auto",
          }}
          href={nextTeacher ? urlFor(nextTeacher, provider) : "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => nextTeacher && handleOpened(nextTeacher.id)}
        >
          {remaining.length === 0 || !nextTeacher
            ? "Enviar correos"
            : `Abrir correo ${openedInRemaining.length + 1} de ${remaining.length} — ${nextTeacher.teacher}`}
        </a>
      ) : (
        <button className="btn-primary" style={{ width: "100%", fontSize: 15 }} onClick={handleFinish}>
          Ya envié los {remaining.length} correos — continuar
        </button>
      )}

      <p style={{ textAlign: "center", fontSize: 12, color: "var(--muted)", marginTop: 10 }}>
        {allOpened
          ? "Revisa que cada pestaña se haya enviado correctamente antes de continuar."
          : provider === "gmail"
            ? "Cada clic abre una pestaña de Gmail con ese correo listo. Necesitas tener la sesión de Gmail iniciada."
            : "Cada clic abre tu app de correo predeterminada con ese mensaje precargado."}
      </p>
    </div>
  );
}
