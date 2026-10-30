import { useState } from "react";
import { isValidEmail } from "../lib/correos";
import { SCHOOL_DOMAIN } from "../lib/datos";
import { classDays, daysSummary, normalizeSchoolEmail, sortSchedule, uniqueTeachers } from "../lib/horario";
import type { ClassItem, Student } from "../lib/tipos";
import { TopMobileBrand } from "./Navegacion";

/* ---------- Pantalla: Perfil ---------- */

type Props = { schedule: ClassItem[]; student: Student; setStudent: (s: Student) => void };

export default function Perfil({ schedule, student, setStudent }: Props) {
  const sorted = sortSchedule(schedule);
  const teachers = uniqueTeachers(sorted);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(student.name);
  const [grade, setGrade] = useState(student.grade);
  const [school, setSchool] = useState(student.school);
  const [emailUser, setEmailUser] = useState((student.email || "").split("@")[0]);
  const [parentEmail, setParentEmail] = useState(student.parentEmail || "");

  const parentEmailOk = !parentEmail.trim() || isValidEmail(parentEmail);

  function startEdit() {
    setName(student.name);
    setGrade(student.grade);
    setSchool(student.school);
    setEmailUser((student.email || "").split("@")[0]);
    setParentEmail(student.parentEmail || "");
    setEditing(true);
  }

  function handleSave() {
    if (!name.trim() || !parentEmailOk) return;
    setStudent({
      name: name.trim(),
      grade: grade.trim(),
      school: school.trim(),
      email: normalizeSchoolEmail(emailUser),
      parentEmail: parentEmail.trim(),
    });
    setEditing(false);
  }

  return (
    <div className="page-wrap fade-in">
      <TopMobileBrand />
      <h1 style={{ fontSize: 23, marginBottom: 22 }}>Perfil</h1>

      {editing ? (
        <div className="card soft-shadow" style={{ marginBottom: 20 }}>
          <label className="field-label">Nombre completo</label>
          <input className="text-input" style={{ marginBottom: 12 }} placeholder="Tu nombre y apellido" value={name} onChange={(e) => setName(e.target.value)} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label className="field-label">Grado</label>
              <input className="text-input" placeholder="Ej: 11°" value={grade} onChange={(e) => setGrade(e.target.value)} />
            </div>
            <div>
              <label className="field-label">Colegio</label>
              <input className="text-input" placeholder="Ej: Instituto Alberto Einstein" value={school} onChange={(e) => setSchool(e.target.value)} />
            </div>
          </div>
          <label className="field-label">Tu correo</label>
          <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 16 }}>
            <input
              className="text-input"
              style={{ borderRadius: "12px 0 0 12px", minWidth: 0 }}
              placeholder="usuario"
              value={emailUser}
              onChange={(e) => setEmailUser(e.target.value.replace("@" + SCHOOL_DOMAIN, ""))}
            />
            <div
              style={{
                border: "1.5px solid var(--line)",
                borderLeft: "none",
                borderRadius: "0 12px 12px 0",
                padding: "12px 14px",
                background: "#F4F7FA",
                fontSize: 14.5,
                color: "var(--muted)",
                whiteSpace: "nowrap",
              }}
            >
              @{SCHOOL_DOMAIN}
            </div>
          </div>
          <label className="field-label">Correo de tu padre/madre o tutor</label>
          <input type="email" className="text-input" placeholder="Ej: familia@correo.com" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} />
          <div style={{ fontSize: 12.5, color: parentEmailOk ? "var(--muted)" : "var(--danger)", marginTop: 6, marginBottom: 16, lineHeight: 1.4 }}>
            {parentEmailOk
              ? "Cada correo a un profesor se enviará con copia (CC) a este correo."
              : "Escribe un correo válido, por ejemplo nombre@correo.com."}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-primary" disabled={!parentEmailOk || !name.trim()} style={{ flex: 1 }} onClick={handleSave}>
              Guardar perfil
            </button>
            <button className="btn-secondary" onClick={() => setEditing(false)}>
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="card soft-shadow" style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
          <div
            className="display"
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "var(--brand-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              color: "var(--brand)",
              flexShrink: 0,
            }}
          >
            {student.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div style={{ flex: 1, minWidth: 0, overflowWrap: "anywhere" }}>
            <div style={{ fontWeight: 700, fontSize: 17 }}>{student.name}</div>
            <div style={{ color: "var(--muted)", fontSize: 13.5 }}>
              {student.grade} · {student.school}
            </div>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>{student.email}</div>
            <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
              Padre/madre (CC):{" "}
              {student.parentEmail ? (
                <strong style={{ color: "var(--ink)", fontWeight: 600 }}>{student.parentEmail}</strong>
              ) : (
                <span style={{ color: "var(--amber)" }}>sin agregar — toca Editar</span>
              )}
            </div>
          </div>
          <button className="btn-ghost" style={{ flexShrink: 0 }} onClick={startEdit}>
            Editar
          </button>
        </div>
      )}

      <h2 style={{ fontSize: 15, marginBottom: 10 }}>Horario escolar</h2>
      <div className="card soft-shadow" style={{ marginBottom: 20, padding: "4px 18px" }}>
        {sorted.length === 0 ? (
          <div style={{ padding: "14px 0", color: "var(--muted)", fontSize: 13.5 }}>Aún no has personalizado tu horario.</div>
        ) : (
          sorted.map((s, i) => (
            <div
              key={s.id}
              style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderTop: i !== 0 ? "1px solid var(--line)" : "none" }}
            >
              <span style={{ fontSize: 14, fontWeight: 500 }}>{s.subject}</span>
              <span style={{ fontSize: 13, color: "var(--muted)", textAlign: "right" }}>
                {daysSummary(classDays(s))} · {s.startLabel}
              </span>
            </div>
          ))
        )}
      </div>

      <h2 style={{ fontSize: 15, marginBottom: 10 }}>Profesores registrados</h2>
      <div className="card soft-shadow" style={{ marginBottom: 20, padding: "4px 18px" }}>
        {teachers.length === 0 ? (
          <div style={{ padding: "14px 0", color: "var(--muted)", fontSize: 13.5 }}>
            Agrega tu horario en la pestaña <strong>Horario</strong> para ver tus profesores aquí.
          </div>
        ) : (
          teachers.map((t, i) => (
            <div
              key={t.teacherEmail || t.teacher}
              style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderTop: i !== 0 ? "1px solid var(--line)" : "none" }}
            >
              <span style={{ fontSize: 14, fontWeight: 500 }}>{t.teacher}</span>
              <span style={{ fontSize: 12.5, color: "var(--muted)", overflowWrap: "anywhere", textAlign: "right" }}>{t.teacherEmail}</span>
            </div>
          ))
        )}
      </div>

      <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 8 }}>
        Prototipo AvisIA · Desafío IA 2026 · Instituto Alberto Einstein
        <br />
        Construido con Claude (Anthropic) · Datos de ejemplo, sin información real de estudiantes o docentes.
      </div>
    </div>
  );
}
