import { classesOnDay, findNextClass } from "../lib/horario";
import { capitalize, WEEKDAYS_ES } from "../lib/tiempo";
import type { ClassItem, HistoryEntry, Page, Student } from "../lib/tipos";
import { Icon } from "./Iconos";
import { TopMobileBrand } from "./Navegacion";

/* ---------- Pantalla: Inicio ---------- */

type Props = {
  setPage: (p: Page) => void;
  history: HistoryEntry[];
  schedule: ClassItem[];
  student: Student;
};

export default function Inicio({ setPage, history, schedule, student }: Props) {
  const now = new Date();
  const next = findNextClass(schedule, now);
  const nextClass = next ? next.cls : null;
  const nextWhen = !next ? "" : next.off === 0 ? "Hoy" : next.off === 1 ? "Mañana" : capitalize(WEEKDAYS_ES[next.weekday]);
  const todayWd = now.getDay();
  const todaysClasses = classesOnDay(schedule, todayWd);
  const recent = history.slice(0, 3);

  return (
    <div className="page-wrap fade-in">
      <TopMobileBrand />
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <div className="icon-badge blue icon-badge-pop float-slow" style={{ width: 56, height: 56, borderRadius: 18 }}>
          <Icon.sparkles style={{ width: 28, height: 28 }} />
        </div>
        <div>
          <h1 style={{ fontSize: 26, margin: "0 0 4px 0", letterSpacing: "-0.01em" }}>
            Hola, {student.name.split(" ")[0]} 👋
          </h1>
          <p style={{ color: "var(--muted)", margin: 0, fontSize: 15 }}>¿Necesitas avisar que faltarás a clases?</p>
        </div>
      </div>

      <button className="btn-primary" style={{ fontSize: 15.5, padding: "15px 24px", marginBottom: 30 }} onClick={() => setPage("reportar")}>
        <Icon.plus className="nav-icon" style={{ width: 18, height: 18 }} />
        Reportar una ausencia
      </button>

      <div
        className="stagger"
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 26 }}
      >
        <div className="card soft-shadow card-hoverable" style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div className="icon-badge coral sm">
            <Icon.clock />
          </div>
          <div>
            <div className="pill pill-blue" style={{ marginBottom: 8 }}>
              Próxima clase
            </div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{nextClass ? nextClass.subject : "Sin clases registradas"}</div>
            <div style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 3 }}>
              {nextClass ? `${nextWhen} · ${nextClass.startLabel} · ${nextClass.teacher}` : "Agrega tu horario en la pestaña Horario"}
            </div>
          </div>
        </div>
        <div className="card soft-shadow card-hoverable" style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div className="icon-badge green sm">
            <Icon.check />
          </div>
          <div>
            <div className="pill pill-green" style={{ marginBottom: 8 }}>
              En total
            </div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>
              {history.length} {history.length === 1 ? "ausencia" : "ausencias"}
            </div>
            <div style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 3 }}>notificadas con AvisIA</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h2 style={{ fontSize: 16, margin: 0 }}>Horario de hoy · {WEEKDAYS_ES[todayWd]}</h2>
        <button className="btn-ghost" onClick={() => setPage("horario")}>
          Ver semana
        </button>
      </div>
      <div className="card soft-shadow" style={{ marginBottom: 26, padding: "6px 18px" }}>
        {schedule.length === 0 ? (
          <div style={{ padding: "18px 4px", color: "var(--muted)", fontSize: 13.5 }}>
            Aún no has agregado tu horario. Ve a <strong>Horario</strong> para personalizarlo.
          </div>
        ) : todaysClasses.length === 0 ? (
          <div style={{ padding: "18px 4px", color: "var(--muted)", fontSize: 13.5 }}>
            Hoy no tienes clases registradas. Puedes ver tu semana completa en <strong>Horario</strong>.
          </div>
        ) : (
          todaysClasses.map((s) => (
            <div className="sched-row" key={s.id}>
              <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>{s.startLabel}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14.5 }}>{s.subject}</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{s.teacher}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h2 style={{ fontSize: 16, margin: 0 }}>Últimas ausencias notificadas</h2>
        {history.length > 0 && (
          <button className="btn-ghost" onClick={() => setPage("historial")}>
            Ver todo
          </button>
        )}
      </div>
      {recent.length === 0 ? (
        <div className="card" style={{ textAlign: "center", color: "var(--muted)", fontSize: 14, padding: 28 }}>
          Aún no has notificado ninguna ausencia.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {recent.map((h) => (
            <div key={h.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14.5 }}>{h.reasonLabel}</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                  {h.dateLabel} · {h.timeLabel}
                </div>
              </div>
              <span className="pill pill-green">{h.teachers.length} notificados</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
