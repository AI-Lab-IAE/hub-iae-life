import { useEffect, useRef, useState, type Dispatch, type PointerEvent as ReactPointerEvent, type ReactNode, type SetStateAction } from "react";
import { DAYS, SCHOOL_DOMAIN } from "../lib/datos";
import { classDays, classesOnDay, emailUserFromTeacherName, normalizeSchoolEmail, sortSchedule } from "../lib/horario";
import {
  CAL_END_MIN,
  CAL_HEIGHT,
  CAL_PX_PER_MIN,
  CAL_START_MIN,
  calClampMin,
  calMinToY,
  calSnap5,
  calYToMin,
  formatTimeLabel,
  minutesToTimeStr,
  timeToMinutes,
} from "../lib/tiempo";
import type { ClassItem } from "../lib/tipos";
import { Icon } from "./Iconos";
import { TopMobileBrand } from "./Navegacion";

/* ---------- Pantalla: Horario ---------- */

function Modal({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,33,56,0.55)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div style={{ maxWidth: 420, width: "100%", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

type Draft = Omit<ClassItem, "id" | "startLabel" | "endLabel"> & { id: string | null; startLabel?: string; endLabel?: string };

function ClassEditRow({
  cls,
  onSave,
  onCancel,
  onDelete,
}: {
  cls: Draft;
  onSave: (c: Draft & { startLabel: string; endLabel: string }) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const [subject, setSubject] = useState(cls.subject);
  const [teacher, setTeacher] = useState(cls.teacher);
  const [emailUser, setEmailUser] = useState((cls.teacherEmail || "").split("@")[0]);
  const [start, setStart] = useState(cls.start);
  const [end, setEnd] = useState(cls.end);
  const [days, setDays] = useState(classDays(cls as ClassItem));
  // Si el correo ya guardado no coincide con el patrón automático (nombre.apellido),
  // asumimos que fue escrito a mano y no lo sobreescribimos al editar el nombre.
  const [emailTouched, setEmailTouched] = useState(() => {
    const current = (cls.teacherEmail || "").split("@")[0];
    return current !== "" && current.toLowerCase() !== emailUserFromTeacherName(cls.teacher);
  });

  const timesOk = !!start && !!end && timeToMinutes(start) < timeToMinutes(end);
  const canSave = !!subject.trim() && !!teacher.trim() && !!emailUser.trim() && timesOk && days.length > 0;

  function toggleDay(n: number) {
    setDays((prev) => (prev.includes(n) ? prev.filter((d) => d !== n) : [...prev, n].sort((a, b) => a - b)));
  }

  function handleTeacherChange(v: string) {
    setTeacher(v);
    if (!emailTouched) {
      setEmailUser(emailUserFromTeacherName(v));
    }
  }
  function handleEmailChange(v: string) {
    setEmailTouched(true);
    setEmailUser(v.replace("@" + SCHOOL_DOMAIN, ""));
  }

  function handleSave() {
    if (!canSave) return;
    onSave({
      ...cls,
      subject: subject.trim(),
      teacher: teacher.trim(),
      teacherEmail: normalizeSchoolEmail(emailUser),
      start,
      end,
      days,
      startLabel: formatTimeLabel(start),
      endLabel: formatTimeLabel(end),
    });
  }

  return (
    <div className="card soft-shadow" style={{ marginBottom: 10 }}>
      <label className="field-label">Días en que tienes esta clase</label>
      <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
        {DAYS.map((d) => (
          <button
            key={d.n}
            className={"chip" + (days.includes(d.n) ? " selected" : "")}
            style={{ padding: "9px 12px", fontSize: 13, flex: "1 1 56px" }}
            onClick={() => toggleDay(d.n)}
          >
            {d.short}
          </button>
        ))}
      </div>
      {days.length === 0 && <div style={{ fontSize: 12.5, color: "var(--danger)", marginBottom: 8 }}>Elige al menos un día.</div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10, marginTop: 10 }}>
        <div>
          <label className="field-label">Desde</label>
          <input type="time" className="text-input" value={start} onChange={(e) => setStart(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Hasta</label>
          <input type="time" className="text-input" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
      </div>
      <label className="field-label">Materia</label>
      <input className="text-input" style={{ marginBottom: 10 }} placeholder="Ej: Matemáticas" value={subject} onChange={(e) => setSubject(e.target.value)} />
      <label className="field-label">Profesor(a)</label>
      <input
        className="text-input"
        style={{ marginBottom: 10 }}
        placeholder="Ej: Profesor Prueba 8"
        value={teacher}
        onChange={(e) => handleTeacherChange(e.target.value)}
      />
      <label className="field-label">Correo del profesor</label>
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 6 }}>
        <input
          className="text-input"
          style={{ borderRadius: "12px 0 0 12px", minWidth: 0 }}
          placeholder="usuario"
          value={emailUser}
          onChange={(e) => handleEmailChange(e.target.value)}
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
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>
        {emailTouched ? "Editado a mano — no se actualiza solo." : "Se autocompleta con el nombre del profesor (nombre.apellido)."}
      </div>
      {!timesOk && <div style={{ fontSize: 12.5, color: "var(--danger)", marginBottom: 10 }}>La hora de inicio debe ser antes de la hora final.</div>}
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn-primary" disabled={!canSave} style={{ flex: 1 }} onClick={handleSave}>
          Guardar clase
        </button>
        <button className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        {onDelete && (
          <button className="btn-secondary" onClick={onDelete} title="Eliminar clase" aria-label="Eliminar clase">
            <Icon.x style={{ width: 16, height: 16 }} />
          </button>
        )}
      </div>
    </div>
  );
}

type Drag =
  | {
      id: string;
      mode: "move";
      moved: boolean;
      startClientY: number;
      startClientX: number;
      originStart: number;
      originEnd: number;
      originDay: number;
      hoverDay: number;
      newStart: number;
      newEnd: number;
      colWidth: number;
    }
  | {
      id: string;
      mode: "resize";
      moved: boolean;
      startClientY: number;
      originStart: number;
      originEnd: number;
      newEnd: number;
    };

function reassignDay(days: number[], fromDay: number, toDay: number): number[] {
  if (fromDay === toDay) return days;
  const next = days.filter((d) => d !== fromDay);
  if (!next.includes(toDay)) next.push(toDay);
  return next.sort((a, b) => a - b);
}

type Props = { schedule: ClassItem[]; setSchedule: Dispatch<SetStateAction<ClassItem[]>> };

export default function Horario({ schedule, setSchedule }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftClass, setDraftClass] = useState<Draft | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  // Copia del arrastre para los eventos de la ventana (siempre tiene el valor más reciente).
  const dragRef = useRef<Drag | null>(null);
  const bodyWrapRef = useRef<HTMLDivElement>(null);
  const dragging = drag !== null;

  function updateDrag(d: Drag | null) {
    dragRef.current = d;
    setDrag(d);
  }

  function handleSave(payload: Draft & { startLabel: string; endLabel: string }) {
    if (payload.id) {
      const updated = payload as ClassItem;
      setSchedule((prev) => sortSchedule(prev.map((c) => (c.id === updated.id ? updated : c))));
      setEditingId(null);
    } else {
      setSchedule((prev) => sortSchedule([...prev, { ...payload, id: "c" + Date.now() }]));
      setDraftClass(null);
    }
  }
  function handleDelete(id: string) {
    setSchedule((prev) => prev.filter((c) => c.id !== id));
    setEditingId(null);
  }

  function startMove(e: ReactPointerEvent, cls: ClassItem, dayNum: number) {
    e.stopPropagation();
    const rect = bodyWrapRef.current!.getBoundingClientRect();
    updateDrag({
      id: cls.id,
      mode: "move",
      moved: false,
      startClientY: e.clientY,
      startClientX: e.clientX,
      originStart: timeToMinutes(cls.start),
      originEnd: timeToMinutes(cls.end),
      originDay: dayNum,
      hoverDay: dayNum,
      newStart: timeToMinutes(cls.start),
      newEnd: timeToMinutes(cls.end),
      colWidth: rect.width / 5,
    });
  }
  function startResize(e: ReactPointerEvent, cls: ClassItem) {
    e.stopPropagation();
    updateDrag({
      id: cls.id,
      mode: "resize",
      moved: false,
      startClientY: e.clientY,
      originStart: timeToMinutes(cls.start),
      originEnd: timeToMinutes(cls.end),
      newEnd: timeToMinutes(cls.end),
    });
  }
  function handleEmptyPointerDown(e: ReactPointerEvent<HTMLDivElement>, dayNum: number) {
    if (e.target !== e.currentTarget) return; // ignora clics que vienen de una clase
    const rect = bodyWrapRef.current!.getBoundingClientRect();
    let start = calClampMin(calSnap5(calYToMin(e.clientY - rect.top)));
    if (start + 50 > CAL_END_MIN) start = CAL_END_MIN - 50;
    setDraftClass({
      id: null,
      days: [dayNum],
      subject: "",
      teacher: "",
      teacherEmail: "",
      start: minutesToTimeStr(start),
      end: minutesToTimeStr(start + 50),
    });
  }

  useEffect(() => {
    if (!dragging) return;
    function onMove(e: PointerEvent) {
      const d = dragRef.current;
      if (!d) return;
      const movedNow =
        Math.abs(e.clientY - d.startClientY) > 4 || (d.mode === "move" && Math.abs(e.clientX - d.startClientX) > 4);
      if (d.mode === "move") {
        const duration = d.originEnd - d.originStart;
        let newStart = calClampMin(calSnap5(d.originStart + (e.clientY - d.startClientY) / CAL_PX_PER_MIN));
        if (newStart + duration > CAL_END_MIN) newStart = CAL_END_MIN - duration;
        const rect = bodyWrapRef.current!.getBoundingClientRect();
        const dayIdx = Math.max(0, Math.min(4, Math.floor((e.clientX - rect.left) / d.colWidth)));
        updateDrag({ ...d, moved: d.moved || movedNow, newStart, newEnd: newStart + duration, hoverDay: DAYS[dayIdx].n });
      } else {
        let newEnd = calClampMin(calSnap5(d.originEnd + (e.clientY - d.startClientY) / CAL_PX_PER_MIN));
        newEnd = Math.max(newEnd, d.originStart + 15);
        updateDrag({ ...d, moved: d.moved || movedNow, newEnd });
      }
    }
    function onUp() {
      const d = dragRef.current;
      updateDrag(null);
      if (!d) return;
      if (d.mode === "move") {
        if (d.moved) {
          const start = minutesToTimeStr(d.newStart);
          const end = minutesToTimeStr(d.newEnd);
          setSchedule((prev) =>
            sortSchedule(
              prev.map((c) =>
                c.id === d.id
                  ? { ...c, start, end, startLabel: formatTimeLabel(start), endLabel: formatTimeLabel(end), days: reassignDay(c.days, d.originDay, d.hoverDay) }
                  : c,
              ),
            ),
          );
        } else {
          setEditingId(d.id); // fue un clic, no un arrastre: abre el editor
        }
      } else if (d.moved) {
        const end = minutesToTimeStr(d.newEnd);
        setSchedule((prev) => prev.map((c) => (c.id === d.id ? { ...c, end, endLabel: formatTimeLabel(end) } : c)));
      }
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging, setSchedule]);

  const hourMarks: number[] = [];
  for (let m = CAL_START_MIN; m <= CAL_END_MIN; m += 30) hourMarks.push(m);

  const editingCls = editingId ? schedule.find((c) => c.id === editingId) : null;

  return (
    <div className="page-wrap wide fade-in">
      <TopMobileBrand />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
        <h1 style={{ fontSize: 23, margin: 0 }}>Mi horario</h1>
        <button
          className="btn-secondary"
          onClick={() => setDraftClass({ id: null, days: [1], subject: "", teacher: "", teacherEmail: "", start: "08:00", end: "08:50" })}
        >
          <Icon.plus style={{ width: 15, height: 15 }} />
          Agregar clase
        </button>
      </div>
      <p style={{ color: "var(--muted)", marginTop: 0, marginBottom: 18, fontSize: 14.5 }}>
        Arrastra una clase para cambiar su hora o día. Toca el borde inferior para ajustar la duración, o toca un espacio vacío para agregar
        una nueva. AvisIA usa este horario para detectar automáticamente a quién avisar.
      </p>

      <div className="card soft-shadow" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <div style={{ display: "grid", gridTemplateColumns: "52px repeat(5, minmax(96px, 1fr))", minWidth: 560 }}>
            <div style={{ position: "sticky", left: 0, zIndex: 6, background: "#fff", borderBottom: "1px solid var(--line)" }}></div>
            {DAYS.map((d) => (
              <div key={d.n} style={{ textAlign: "center", fontWeight: 700, fontSize: 13, padding: "10px 4px", borderBottom: "1px solid var(--line)" }}>
                {d.short}
              </div>
            ))}

            <div style={{ position: "sticky", left: 0, zIndex: 6, height: CAL_HEIGHT, borderRight: "1px solid var(--line)", background: "#fff" }}>
              {hourMarks
                .filter((m) => m % 60 === 0)
                .map((m) => (
                  <div key={m} style={{ position: "absolute", top: calMinToY(m) - 6, right: 6, fontSize: 10.5, color: "var(--muted)" }}>
                    {formatTimeLabel(minutesToTimeStr(m))}
                  </div>
                ))}
            </div>

            <div
              ref={bodyWrapRef}
              style={{ gridColumn: "2 / span 5", position: "relative", height: CAL_HEIGHT, display: "grid", gridTemplateColumns: "repeat(5, 1fr)" }}
            >
              {hourMarks.map((m) => (
                <div
                  key={m}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: calMinToY(m),
                    borderTop: m % 60 === 0 ? "1px solid var(--line)" : "1px dashed #EEF1F5",
                    pointerEvents: "none",
                  }}
                ></div>
              ))}

              {DAYS.map((d, idx) => (
                <div
                  key={d.n}
                  style={{ position: "relative", borderLeft: idx > 0 ? "1px solid var(--line)" : "none", cursor: "pointer" }}
                  onPointerDown={(e) => handleEmptyPointerDown(e, d.n)}
                >
                  {classesOnDay(schedule, d.n).map((c) => {
                    const isDraggingThis = drag && drag.id === c.id;
                    if (isDraggingThis && drag.mode === "move") return null; // se dibuja como "fantasma" flotante más abajo
                    const resizing = isDraggingThis && drag.mode === "resize";
                    const startMin = resizing ? drag.originStart : timeToMinutes(c.start);
                    const endMin = resizing ? drag.newEnd : timeToMinutes(c.end);
                    const top = calMinToY(startMin),
                      height = Math.max(22, calMinToY(endMin) - calMinToY(startMin));
                    return (
                      <div
                        key={c.id}
                        onPointerDown={(e) => startMove(e, c, d.n)}
                        style={{
                          position: "absolute",
                          left: 2,
                          right: 2,
                          top,
                          height,
                          background: "var(--brand)",
                          color: "#fff",
                          borderRadius: 8,
                          padding: "4px 7px",
                          overflow: "hidden",
                          touchAction: "none",
                          boxShadow: isDraggingThis ? "0 6px 16px rgba(30,58,95,0.35)" : "0 1px 2px rgba(30,58,95,0.2)",
                          cursor: "grab",
                          zIndex: isDraggingThis ? 30 : 1,
                        }}
                      >
                        <div style={{ fontSize: 11.5, fontWeight: 700, lineHeight: 1.25, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {c.subject}
                        </div>
                        {height > 34 && (
                          <div style={{ fontSize: 10, opacity: 0.85, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.teacher}</div>
                        )}
                        {height > 50 && (
                          <div style={{ fontSize: 9.5, opacity: 0.8 }}>
                            {formatTimeLabel(minutesToTimeStr(startMin))}–{formatTimeLabel(minutesToTimeStr(endMin))}
                          </div>
                        )}
                        <div
                          onPointerDown={(e) => startResize(e, c)}
                          style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, cursor: "ns-resize", touchAction: "none" }}
                        ></div>
                      </div>
                    );
                  })}
                </div>
              ))}

              {drag &&
                drag.mode === "move" &&
                (() => {
                  const cls = schedule.find((c) => c.id === drag.id);
                  if (!cls) return null;
                  const dayIdx = DAYS.findIndex((d) => d.n === drag.hoverDay);
                  const top = calMinToY(drag.newStart),
                    height = Math.max(22, calMinToY(drag.newEnd) - calMinToY(drag.newStart));
                  return (
                    <div
                      style={{
                        position: "absolute",
                        left: `calc(${dayIdx} * (100% / 5) + 2px)`,
                        width: "calc(100% / 5 - 4px)",
                        top,
                        height,
                        background: "var(--brand)",
                        color: "#fff",
                        borderRadius: 8,
                        padding: "4px 7px",
                        overflow: "hidden",
                        opacity: 0.92,
                        boxShadow: "0 10px 22px rgba(30,58,95,0.4)",
                        pointerEvents: "none",
                        zIndex: 40,
                      }}
                    >
                      <div style={{ fontSize: 11.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cls.subject}</div>
                      <div style={{ fontSize: 9.5, opacity: 0.9 }}>
                        {formatTimeLabel(minutesToTimeStr(drag.newStart))}–{formatTimeLabel(minutesToTimeStr(drag.newEnd))}
                      </div>
                    </div>
                  );
                })()}
            </div>
          </div>
        </div>
      </div>

      {(editingCls || draftClass) && (
        <Modal
          onClose={() => {
            setEditingId(null);
            setDraftClass(null);
          }}
        >
          <ClassEditRow
            key={editingCls ? editingCls.id : "nueva"}
            cls={editingCls || draftClass!}
            onSave={handleSave}
            onCancel={() => {
              setEditingId(null);
              setDraftClass(null);
            }}
            onDelete={editingCls ? () => handleDelete(editingCls.id) : undefined}
          />
        </Modal>
      )}
    </div>
  );
}
