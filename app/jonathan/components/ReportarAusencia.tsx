import { useState } from "react";
import { REASONS } from "../lib/datos";
import { addDaysIso, formatTimeLabel, isoToDate, labelDate, labelDateLong, timeToMinutes, todayIso } from "../lib/tiempo";
import type { Report } from "../lib/tipos";
import { TopMobileBrand } from "./Navegacion";

/* ---------- Pantalla: Reportar ausencia (paso 1) ---------- */

type Mode = "allDay" | "interval" | "multi";

const MODE_CHIP_STYLE = { justifyContent: "center", textAlign: "center", padding: "12px 6px", fontSize: 13.5, lineHeight: 1.25 } as const;

export default function ReportarAusencia({ onContinue }: { onContinue: (r: Report) => void }) {
  const [date, setDate] = useState(todayIso);
  const [endDate, setEndDate] = useState(() => addDaysIso(todayIso(), 1));
  const [mode, setMode] = useState<Mode>("allDay");
  const [fromTime, setFromTime] = useState("10:00");
  const [toTime, setToTime] = useState("13:00");
  const [reason, setReason] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");
  const [extra, setExtra] = useState("");

  const multiDay = mode === "multi";
  const effAllDay = mode !== "interval";
  const startWeekday = date ? isoToDate(date).getDay() : 1;
  const isWeekend = !multiDay && (startWeekday === 0 || startWeekday === 6);
  const multiValid = !multiDay || (!!endDate && endDate > date);
  const timesValid = mode !== "interval" || (!!fromTime && !!toTime && timeToMinutes(fromTime) < timeToMinutes(toTime));

  const canContinue = !!reason && (reason !== "otro" || otherText.trim().length > 0) && timesValid && multiValid && !!date;

  function rangeLabel() {
    return multiDay && endDate > date
      ? `${labelDate(date)} al ${labelDate(endDate)}`
      : labelDate(date) + " de " + isoToDate(date).getFullYear();
  }
  function handleStartChange(v: string) {
    setDate(v);
    if (v && (!endDate || endDate <= v)) setEndDate(addDaysIso(v, 1));
  }
  function selectMulti() {
    setMode("multi");
    if (!endDate || endDate <= date) setEndDate(addDaysIso(date, 1));
  }
  function handleContinue() {
    if (!canContinue || !reason) return;
    onContinue({
      date,
      endDate: multiDay ? endDate : "",
      dateLabel: multiDay ? `${labelDate(date)} al ${labelDate(endDate)}` : labelDateLong(date),
      allDay: effAllDay,
      fromTime: effAllDay ? "00:00" : fromTime,
      toTime: effAllDay ? "23:59" : toTime,
      timeLabel: effAllDay ? "Todo el día" : `${formatTimeLabel(fromTime)} – ${formatTimeLabel(toTime)}`,
      reasonId: reason,
      reasonLabel: reason === "otro" ? otherText : REASONS.find((r) => r.id === reason)!.label,
      extra,
    });
  }

  return (
    <div className="page-wrap fade-in">
      <TopMobileBrand />
      <h1 style={{ fontSize: 23, marginBottom: 4 }}>Reportar una ausencia</h1>
      <p style={{ color: "var(--muted)", marginTop: 0, marginBottom: 26, fontSize: 14.5 }}>
        Cuéntanos cuándo faltarás y por qué. AvisIA se encarga del resto.
      </p>

      <div className="card soft-shadow" style={{ marginBottom: 18 }}>
        <label className="field-label">{multiDay ? "Fecha de inicio" : "Fecha"}</label>
        <input type="date" className="text-input" value={date} onChange={(e) => handleStartChange(e.target.value)} />
        {date && <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 8 }}>{rangeLabel()}</div>}
        {isWeekend && (
          <div style={{ fontSize: 12.5, color: "var(--amber)", marginTop: 6 }}>
            Esa fecha es fin de semana: probablemente no tengas clases ese día.
          </div>
        )}
      </div>

      <div className="card soft-shadow" style={{ marginBottom: 18 }}>
        <label className="field-label">Tiempo de ausencia</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: mode === "allDay" ? 0 : 14 }}>
          <button className={"chip" + (mode === "allDay" ? " selected" : "")} style={MODE_CHIP_STYLE} onClick={() => setMode("allDay")}>
            Todo el día
          </button>
          <button className={"chip" + (mode === "interval" ? " selected" : "")} style={MODE_CHIP_STYLE} onClick={() => setMode("interval")}>
            Seleccionar horario
          </button>
          <button className={"chip" + (mode === "multi" ? " selected" : "")} style={MODE_CHIP_STYLE} onClick={selectMulti}>
            Varios días
          </button>
        </div>

        {mode === "interval" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label className="field-label">Desde</label>
                <input type="time" className="text-input" value={fromTime} onChange={(e) => setFromTime(e.target.value)} />
              </div>
              <div>
                <label className="field-label">Hasta</label>
                <input type="time" className="text-input" value={toTime} onChange={(e) => setToTime(e.target.value)} />
              </div>
            </div>
            {!timesValid && (
              <div style={{ fontSize: 12.5, color: "var(--danger)", marginTop: 8 }}>La hora de inicio debe ser antes de la hora final.</div>
            )}
          </div>
        )}

        {mode === "multi" && (
          <div>
            <label className="field-label">Hasta el día</label>
            <input
              type="date"
              className="text-input"
              min={date ? addDaysIso(date, 1) : undefined}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            {!multiValid ? (
              <div style={{ fontSize: 12.5, color: "var(--danger)", marginTop: 8 }}>
                La fecha final debe ser posterior a la fecha de inicio.
              </div>
            ) : (
              <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, marginTop: 10 }}>
                AvisIA incluirá <strong style={{ color: "var(--ink)" }}>todas tus clases</strong> de esos días según tu horario
                semanal, y enviará un solo correo por profesor.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card soft-shadow" style={{ marginBottom: 18 }}>
        <label className="field-label">Motivo</label>
        <div className="stagger" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {REASONS.map((r, i) => (
            <button
              key={r.id}
              className={"chip" + (reason === r.id ? " selected" : "")}
              style={i === REASONS.length - 1 && REASONS.length % 2 === 1 ? { gridColumn: "1 / -1" } : undefined}
              onClick={() => setReason(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>
        {reason === "otro" && (
          <input
            className="text-input"
            style={{ marginTop: 12 }}
            placeholder="Describe el motivo"
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
          />
        )}
        {reason === "familiar" && (
          <div
            style={{
              fontSize: 13,
              color: "var(--muted)",
              lineHeight: 1.5,
              marginTop: 12,
              padding: "10px 12px",
              background: "var(--brand-soft)",
              borderRadius: 10,
            }}
          >
            Es un tema sensible: el correo solo dirá que se trata de un asunto familiar,{" "}
            <strong style={{ color: "var(--ink)" }}>sin dar detalles</strong>. Si escribes algo en &quot;Información adicional&quot;,
            también se incluirá, así que déjalo vacío si prefieres no compartirlo.
          </div>
        )}
      </div>

      <div className="card soft-shadow" style={{ marginBottom: 26 }}>
        <label className="field-label">Información adicional (opcional)</label>
        <textarea
          className="text-input"
          placeholder="Ej: Voy a representar al colegio en una competencia de inteligencia artificial."
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
        />
      </div>

      <button
        className="btn-primary"
        disabled={!canContinue}
        style={{ width: "100%", justifyContent: "center", fontSize: 15 }}
        onClick={handleContinue}
      >
        Continuar
      </button>
      {!canContinue && (
        <p style={{ textAlign: "center", fontSize: 12.5, color: "var(--muted)", marginTop: 8 }}>
          {!reason ? "Elige un motivo para continuar." : "Revisa las fechas y horas para continuar."}
        </p>
      )}
    </div>
  );
}
