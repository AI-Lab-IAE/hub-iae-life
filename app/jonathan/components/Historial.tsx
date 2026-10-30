import { useState } from "react";
import type { HistoryEntry } from "../lib/tipos";
import { Icon } from "./Iconos";
import { TopMobileBrand } from "./Navegacion";

/* ---------- Pantalla: Historial ---------- */

export default function Historial({ history }: { history: HistoryEntry[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openItem = history.find((h) => h.id === openId);

  if (openItem) {
    return (
      <div className="page-wrap fade-in">
        <TopMobileBrand />
        <button className="btn-ghost" style={{ marginBottom: 10 }} onClick={() => setOpenId(null)}>
          ← Volver al historial
        </button>
        <h1 style={{ fontSize: 22, marginBottom: 4 }}>{openItem.reasonLabel}</h1>
        <p style={{ color: "var(--muted)", marginTop: 0, marginBottom: 22, fontSize: 14 }}>
          {openItem.dateLabel} · {openItem.timeLabel}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {openItem.teachers.map((t, i) => (
            <div key={i} className="email-card">
              <div className="email-header">
                <div style={{ minWidth: 0, overflowWrap: "anywhere" }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {t.subject} — {t.teacher}
                  </div>
                  {t.cc && <div style={{ fontSize: 12, color: "var(--muted)" }}>CC: {t.cc}</div>}
                </div>
                <span className="pill pill-green">Enviado</span>
              </div>
              <div className="email-body">
                <div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.6, color: "var(--ink)" }}>{t.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap fade-in">
      <TopMobileBrand />
      <h1 style={{ fontSize: 23, marginBottom: 6 }}>Historial</h1>
      <p style={{ color: "var(--muted)", marginTop: 0, marginBottom: 22, fontSize: 14.5 }}>Todas las ausencias que has notificado con AvisIA.</p>
      {history.length === 0 ? (
        <div className="card" style={{ textAlign: "center", color: "var(--muted)", padding: 32 }}>
          Todavía no tienes ausencias registradas.
        </div>
      ) : (
        <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {history.map((h) => (
            <button key={h.id} className="history-item card-hoverable" style={{ textAlign: "left" }} onClick={() => setOpenId(h.id)}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{h.reasonLabel}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
                  {h.dateLabel} · {h.timeLabel}
                </div>
              </div>
              <span className="pill pill-green">{h.teachers.length} notificados</span>
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "var(--brand-soft)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon.chevronRight style={{ width: 14, height: 14, color: "var(--brand)" }} />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
