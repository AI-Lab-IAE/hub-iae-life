import { useMemo, useState } from "react";
import { computeOccurrences, groupByTeacher } from "../lib/horario";
import { capitalize } from "../lib/tiempo";
import type { ClassItem, Report, TeacherGroup } from "../lib/tipos";
import { Icon } from "./Iconos";
import { TopMobileBrand } from "./Navegacion";

/* ---------- Pantalla: Clases afectadas ---------- */

type Props = {
  report: Report;
  schedule: ClassItem[];
  onBack: () => void;
  onGenerate: (groups: TeacherGroup[]) => void;
};

export default function ClasesAfectadas({ report, schedule, onBack, onGenerate }: Props) {
  const classes = useMemo(() => computeOccurrences(schedule, report), [report, schedule]);

  const [included, setIncluded] = useState(() => new Set(classes.map((c) => c.occId)));

  const selected = classes.filter((c) => included.has(c.occId));
  const teachersCount = groupByTeacher(selected).length;

  function toggle(id: string) {
    setIncluded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="page-wrap fade-in">
      <TopMobileBrand />
      <button className="btn-ghost" style={{ marginBottom: 10 }} onClick={onBack}>
        ← Editar ausencia
      </button>
      <h1 style={{ fontSize: 23, marginBottom: 6 }}>Clases afectadas</h1>
      <p style={{ color: "var(--muted)", marginTop: 0, marginBottom: 22, fontSize: 14.5 }}>
        Detectamos{" "}
        <strong style={{ color: "var(--ink)" }}>
          {classes.length} {classes.length === 1 ? "clase que vas a perder" : "clases que vas a perder"}
        </strong>{" "}
        ({report.dateLabel}). Se avisará a{" "}
        <strong style={{ color: "var(--ink)" }}>
          {teachersCount} {teachersCount === 1 ? "profesor" : "profesores"}
        </strong>
        .
      </p>

      <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 }}>
        {classes.map((c) => {
          const isIn = included.has(c.occId);
          return (
            <div key={c.occId} className={"class-card" + (isIn ? "" : " excluded")}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <button
                  className={"checkbox" + (isIn ? " checked" : "")}
                  onClick={() => toggle(c.occId)}
                  aria-label={isIn ? `Quitar ${c.subject}` : `Incluir ${c.subject}`}
                >
                  {isIn && <Icon.check style={{ width: 15, height: 15, color: "#fff" }} />}
                </button>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14.5 }}>{c.subject}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>
                    {c.teacher} · {c.startLabel}–{c.endLabel}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--brand-2)", fontWeight: 600, marginTop: 2 }}>{capitalize(c.dateText)}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", overflowWrap: "anywhere" }}>{c.teacherEmail}</div>
            </div>
          );
        })}
        {classes.length === 0 && (
          <div className="card" style={{ textAlign: "center", color: "var(--muted)", lineHeight: 1.5 }}>
            No tienes clases registradas en ese día u horario según tu horario semanal.
            <br />
            <span style={{ fontSize: 13 }}>
              Revisa la fecha o ajusta tu horario en la pestaña <strong>Horario</strong>.
            </span>
          </div>
        )}
      </div>

      <button
        className="btn-primary"
        disabled={selected.length === 0}
        style={{ width: "100%", justifyContent: "center", fontSize: 15 }}
        onClick={() => onGenerate(groupByTeacher(selected))}
      >
        <Icon.sparkles className="nav-icon" style={{ width: 17, height: 17 }} />
        Generar correos
      </button>
    </div>
  );
}
