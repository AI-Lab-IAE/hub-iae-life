import { useState, type CSSProperties } from "react";
import type { SentEmail } from "../lib/tipos";
import { Icon } from "./Iconos";

/* ---------- Pantalla: Confirmación ---------- */

const CONFETTI_COLORS = ["#3B82C4", "#E8795A", "#8B6FC9", "#D9A441", "#3D8B6E"];

function makeConfetti() {
  return Array.from({ length: 14 }).map((_, i) => ({
    id: i,
    left: 50 + (Math.random() - 0.5) * 30,
    dx: (Math.random() - 0.5) * 160 + "px",
    dy: Math.random() * -90 - 40 + "px",
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 6 + Math.random() * 5,
    delay: Math.random() * 0.15,
  }));
}

export default function Confirmacion({ sentEmails, onDone }: { sentEmails: SentEmail[]; onDone: () => void }) {
  const [confetti] = useState(makeConfetti);

  return (
    <div className="page-wrap fade-in" style={{ textAlign: "center", paddingTop: 40, position: "relative" }}>
      <div style={{ position: "relative", height: 0 }}>
        {confetti.map((c) => (
          <span
            key={c.id}
            className="confetti-dot"
            style={
              {
                left: `calc(50% + ${c.left - 50}px)`,
                top: 60,
                width: c.size,
                height: c.size,
                background: c.color,
                "--dx": c.dx,
                "--dy": c.dy,
                animationDelay: `${c.delay}s`,
              } as CSSProperties
            }
          ></span>
        ))}
      </div>
      <div className="success-check">
        <Icon.check style={{ width: 30, height: 30, color: "var(--success)" }} />
      </div>
      <h1 style={{ fontSize: 24, marginBottom: 6 }}>¡Listo!</h1>
      <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 28 }}>
        <strong style={{ color: "var(--ink)" }}>
          {sentEmails.length} {sentEmails.length === 1 ? "profesor fue notificado" : "profesores fueron notificados"}.
        </strong>
        <br />
        <span style={{ fontSize: 13 }}>Revisa las pestañas o app de correo que se abrieron y confirma el envío ahí.</span>
      </p>
      <div className="card soft-shadow stagger" style={{ maxWidth: 380, margin: "0 auto 30px auto", textAlign: "left" }}>
        {sentEmails.map((e, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 4px", fontSize: 14.5, fontWeight: 500 }}>
            <Icon.check style={{ width: "1em", height: "1em", color: "var(--success)", flexShrink: 0 }} />
            <span>{e.teacher}</span>
          </div>
        ))}
      </div>
      <button className="btn-primary" onClick={onDone}>
        Volver al inicio
      </button>
    </div>
  );
}
