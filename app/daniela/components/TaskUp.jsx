"use client";

// Varios efectos ajustan el estado cuando cambian los datos (días disponibles, bloque a editar,
// recordatorios). Funciona bien; pasarlos a estado derivado queda en DESPUES.md.
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } from "react";
import {
  Home, CalendarDays, PlusCircle, CheckCircle2, TrendingUp, Settings as SettingsIcon,
  Info, Plus, X, Check, Undo2, Trash2, PencilLine, Moon, SunMedium, Bell, BellOff,
  ChevronLeft, ChevronRight, Clock, AlertTriangle, RotateCcw, Sparkles, BookOpen,
  ClipboardList, History as HistoryIcon, User, GraduationCap, ShieldCheck, Wrench,
  Landmark, Store, MoreHorizontal, Menu, Wand2,
  CircleDot, GripVertical, ArrowRight, Loader2, PartyPopper, CalendarRange, CalendarClock
} from "lucide-react";

/* ============================================================
   CONSTANTES
============================================================ */
const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_LABEL = {
  es: { mon: "Lunes", tue: "Martes", wed: "Miércoles", thu: "Jueves", fri: "Viernes", sat: "Sábado", sun: "Domingo" },
  en: { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" },
};
const DAY_SHORT = {
  es: { mon: "Lun", tue: "Mar", wed: "Mié", thu: "Jue", fri: "Vie", sat: "Sáb", sun: "Dom" },
  en: { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" },
};

const TYPE_KEYS = ["tarea", "proyecto", "examen", "estudio", "presentacion", "trabajo_escrito", "lectura", "investigacion", "tiempo_personal", "otro"];
const TYPE_LABEL = {
  es: { tarea: "Tarea", proyecto: "Proyecto", examen: "Examen", estudio: "Estudio", presentacion: "Presentación", trabajo_escrito: "Trabajo escrito", lectura: "Lectura", investigacion: "Investigación", tiempo_personal: "Tiempo personal", otro: "Otro" },
  en: { tarea: "Homework", proyecto: "Project", examen: "Exam", estudio: "Study", presentacion: "Presentation", trabajo_escrito: "Written work", lectura: "Reading", investigacion: "Research", tiempo_personal: "Personal time", otro: "Other" },
};

const DIFF_KEYS = ["facil", "media", "dificil"];
const DIFF_LABEL = {
  es: { facil: "Fácil", media: "Media", dificil: "Difícil" },
  en: { facil: "Easy", media: "Medium", dificil: "Hard" },
};

const PRI_KEYS = ["alta", "media", "baja"];
const PRI_LABEL = {
  es: { alta: "Alta", media: "Media", baja: "Baja" },
  en: { alta: "High", media: "Medium", baja: "Low" },
};

const ROLE_KEYS = ["estudiante", "profesor", "seguridad", "mantenimiento", "junta", "kiosco", "otro"];
const ROLE_LABEL = {
  es: { estudiante: "Estudiante", profesor: "Profesor/a", seguridad: "Seguridad", mantenimiento: "Mantenimiento", junta: "Junta Directiva", kiosco: "Kiosco", otro: "Otro" },
  en: { estudiante: "Student", profesor: "Teacher", seguridad: "Security", mantenimiento: "Maintenance", junta: "Board", kiosco: "Kiosk", otro: "Other" },
};
const ROLE_ICON = { estudiante: GraduationCap, profesor: BookOpen, seguridad: ShieldCheck, mantenimiento: Wrench, junta: Landmark, kiosco: Store, otro: MoreHorizontal };

const BLOCK_CAT_KEYS = ["clase", "actividad", "compromiso"];
const BLOCK_CAT_LABEL = {
  es: { clase: "Clase", actividad: "Actividad", compromiso: "Compromiso" },
  en: { clase: "Class", actividad: "Activity", compromiso: "Commitment" },
};

const COLORS = {
  clase: "#2F80ED",
  actividad: "#F2994A",
  compromiso: "#9B51E0",
  sueno: "#6C63FF",
  personal: "#27AE60",
  shabbat: "#5B6178",
  alta: "#EB5757",
  media: "#F2994A",
  baja: "#27AE60",
};

const EVENT_COLORS = ["#2F80ED", "#EB5757", "#9B51E0", "#219653", "#F2994A", "#2D9CDB", "#BB6BD9"];

const THEMES = {
  dia: {
    bg: "#F6F5FC", bgSoft: "#EEF0FB", surface: "#FFFFFF", surfaceAlt: "#F1F2FA",
    text: "#191C34", textMuted: "#666C8C", border: "#E3E5F3",
    primary: "#5B5FEF", primarySoft: "#E7E7FD", primaryText: "#FFFFFF",
    accent: "#FF6B57", accentSoft: "#FFE6E1", shadow: "0 8px 24px -12px rgba(35,38,90,0.18)",
    headerGrad: "linear-gradient(135deg, #EDEBFF 0%, #F9EFFB 60%, #FFF3EA 100%)",
  },
  noche: {
    bg: "#0E1020", bgSoft: "#151833", surface: "#1B1E3A", surfaceAlt: "#232748",
    text: "#EFEFFC", textMuted: "#9B9FC4", border: "#2C3060",
    primary: "#8285FF", primarySoft: "#2A2C63", primaryText: "#0E1020",
    accent: "#FF8A73", accentSoft: "#3A2740", shadow: "0 8px 24px -10px rgba(0,0,0,0.5)",
    headerGrad: "linear-gradient(135deg, #1B1E3A 0%, #221B3A 60%, #2A1F33 100%)",
  },
};

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');`;

/* ============================================================
   ZONA HORARIA: PANAMÁ (UTC-5), fija para todo el app
============================================================ */
const APP_TIMEZONE = "America/Panama";

function panamaNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIMEZONE,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type)?.value;
  const y = parseInt(get("year"), 10);
  const mo = parseInt(get("month"), 10) - 1;
  const d = parseInt(get("day"), 10);
  let h = parseInt(get("hour"), 10);
  if (h === 24) h = 0;
  const mi = parseInt(get("minute"), 10);
  const s = parseInt(get("second"), 10);
  return new Date(y, mo, d, h, mi, s);
}
function fmtDateTimePanama(isoString, lang) {
  try {
    return new Date(isoString).toLocaleString(lang === "es" ? "es-PA" : "en-US", { timeZone: APP_TIMEZONE });
  } catch (e) {
    return isoString;
  }
}

/* ============================================================
   UTILIDADES DE FECHA / TIEMPO
============================================================ */
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

function dayKeyFromDate(d) {
  const jsDay = d.getDay();
  return DAY_KEYS[(jsDay + 6) % 7];
}
function toISO(d) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}
function parseISO(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function todayISO() {
  const d = panamaNow();
  d.setHours(0, 0, 0, 0);
  return toISO(d);
}
function timeToMin(t) {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function minToTime(m) {
  m = ((Math.round(m) % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60), mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}
function fmtHours(mins) {
  const h = Math.floor(mins / 60), m = Math.round(mins % 60);
  if (h <= 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}
function fmtDateNumeric(iso, lang) {
  const d = parseISO(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  if (lang === "es") {
    return `${day}/${month}/${d.getFullYear()}`;
  }
  return `${month}/${day}/${String(d.getFullYear()).slice(-2)}`;
}
function fmtDate(iso, lang) {
  const d = parseISO(iso);
  const dk = dayKeyFromDate(d);
  return `${DAY_SHORT[lang][dk]} ${fmtDateNumeric(iso, lang)}`;
}
function mergeIntervals(list) {
  const s = [...list].filter(([a, b]) => b > a).sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const [a, b] of s) {
    if (out.length && a <= out[out.length - 1][1]) {
      out[out.length - 1][1] = Math.max(out[out.length - 1][1], b);
    } else out.push([a, b]);
  }
  return out;
}
function freeFromOccupied(occ) {
  const merged = mergeIntervals(occ);
  const free = [];
  let cursor = 0;
  for (const [s, e] of merged) {
    if (s > cursor) free.push([cursor, s]);
    cursor = Math.max(cursor, e);
  }
  if (cursor < 1440) free.push([cursor, 1440]);
  return free;
}

/* ============================================================
   MODELO DE DATOS POR DEFECTO
============================================================ */
function emptySleep() {
  return Object.fromEntries(DAY_KEYS.map((d) => [d, { sleep: null, wake: null }]));
}
function emptyPersonalMinutes() {
  return Object.fromEntries(DAY_KEYS.map((d) => [d, 0]));
}
function defaultData() {
  return {
    version: 2,
    user: null,
    onboarded: false,
    introDone: false,
    settings: { lang: "es", theme: "dia", notif: true },
    fixedBlocks: [],
    shabbat: { enabled: false, startDay: "fri", startTime: "18:00", endDay: "sat", endTime: "19:30" },
    sleep: emptySleep(),
    personalMinutes: emptyPersonalMinutes(),
    personalOverrides: {},
    sleepOverrides: {},
    events: {},
    exams: [],
    tasks: [],
    history: [],
    notifiedLog: {},
  };
}

/* ============================================================
   ESTIMACIÓN DE DURACIÓN Y PRIORIDAD
============================================================ */
const DURATION_TABLE = {
  tarea: { facil: 30, media: 45, dificil: 60 },
  proyecto: { facil: 60, media: 120, dificil: 180 },
  examen: { facil: 45, media: 90, dificil: 150 },
  estudio: { facil: 30, media: 60, dificil: 90 },
  presentacion: { facil: 45, media: 90, dificil: 150 },
  trabajo_escrito: { facil: 45, media: 90, dificil: 150 },
  lectura: { facil: 30, media: 45, dificil: 60 },
  investigacion: { facil: 60, media: 120, dificil: 180 },
  tiempo_personal: { facil: 30, media: 30, dificil: 30 },
  otro: { facil: 45, media: 60, dificil: 90 },
};
function estimateDuration(type, difficulty) {
  return (DURATION_TABLE[type] && DURATION_TABLE[type][difficulty]) || 60;
}
function autoPriority(task, todayIso) {
  if (task.dueDate < todayIso) return "alta";
  const days = Math.round((parseISO(task.dueDate) - parseISO(todayIso)) / 86400000);
  if (days <= 1) return "alta";
  if (days <= 3 && task.difficulty !== "facil") return "alta";
  if (days <= 5) return "media";
  return "baja";
}
function daysAvailable(dueDate, tISO) {
  const overdue = dueDate < tISO;
  const start = parseISO(tISO);
  const endLimit = overdue ? addDays(start, 2) : parseISO(dueDate);
  const end = endLimit < start ? start : endLimit;
  const out = [];
  let cur = new Date(start);
  while (cur <= end) { out.push(toISO(cur)); cur = addDays(cur, 1); }
  return out.length ? out : [tISO];
}

/* ============================================================
   MOTOR DE ORGANIZACIÓN AUTOMÁTICA
============================================================ */
function occupiedBaseForDate(data, dateISO) {
  const date = parseISO(dateISO);
  const dk = dayKeyFromDate(date);
  const prevDk = dayKeyFromDate(addDays(date, -1));
  const intervals = [];

  (data.fixedBlocks || []).forEach((b) => {
    if (b.days.includes(dk)) intervals.push([timeToMin(b.start), timeToMin(b.end)]);
  });

  const todaySleep = data.sleep[dk];
  if (todaySleep && todaySleep.sleep) intervals.push([timeToMin(todaySleep.sleep), 1440]);

  const prevSleep = data.sleep[prevDk];
  if (prevSleep && prevSleep.wake) {
    let wakeMin = timeToMin(prevSleep.wake);
    const ov = data.sleepOverrides[dateISO];
    if (ov) wakeMin = Math.max(0, wakeMin - ov.reduceMinutes);
    intervals.push([0, wakeMin]);
  }

  if (data.shabbat && data.shabbat.enabled) {
    if (dk === data.shabbat.startDay) intervals.push([timeToMin(data.shabbat.startTime), 1440]);
    if (dk === data.shabbat.endDay) intervals.push([0, timeToMin(data.shabbat.endTime)]);
  }

  (data.events[dateISO] || []).forEach((ev) => {
    intervals.push([timeToMin(ev.start), timeToMin(ev.end)]);
  });

  // TASKUP! nunca coloca nada en una hora que ya pasó. Se usa la hora real
  // del dispositivo (America/Panama) en el momento en que se calcula el
  // horario, no una hora fija — así que esto se recalcula cada vez.
  const now = panamaNow();
  if (dateISO === toISO(now)) {
    const nowMin = now.getHours() * 60 + now.getMinutes();
    intervals.push([0, nowMin]);
  }

  return mergeIntervals(intervals);
}

function personalPlacementForDate(data, dateISO, baseIntervals) {
  const dk = dayKeyFromDate(parseISO(dateISO));
  let minutes = data.personalMinutes[dk] || 0;
  const ov = data.personalOverrides[dateISO];
  if (ov) minutes = Math.max(0, minutes - ov.reduceMinutes);
  if (minutes <= 0) return [];
  const free = freeFromOccupied(baseIntervals).sort((a, b) => (b[1] - b[0]) - (a[1] - a[0]));
  const placed = [];
  let remaining = minutes;
  for (const [s, e] of free) {
    if (remaining <= 0) break;
    const avail = e - s;
    const chunk = Math.min(remaining, avail);
    if (chunk <= 0) continue;
    placed.push([s, s + chunk]);
    remaining -= chunk;
  }
  return placed;
}

function occupiedForDate(data, dateISO) {
  const base = occupiedBaseForDate(data, dateISO);
  const personal = personalPlacementForDate(data, dateISO, base);
  return mergeIntervals([...base, ...personal]);
}

function availablePersonalMinutesForDate(data, dateISO) {
  const dk = dayKeyFromDate(parseISO(dateISO));
  let minutes = data.personalMinutes[dk] || 0;
  const ov = data.personalOverrides[dateISO];
  if (ov) minutes = Math.max(0, minutes - ov.reduceMinutes);
  return Math.max(0, minutes);
}

function tasksForDate(data, dateISO) {
  const out = [];
  (data.tasks || []).forEach((t) => {
    if (t.completed) return;
    (t.sessions || []).forEach((s) => { if (s.date === dateISO) out.push({ task: t, session: s }); });
  });
  return out;
}

/* Reparte `total` minutos entre días según su capacidad real disponible ese día
   (capacities[i]), sin forzar más tiempo del que un día realmente tiene libre.
   Los días sin espacio simplemente no reciben nada; el resto se reparte parejo
   entre los días que sí tienen espacio, en varias pasadas hasta agotar el total
   o la capacidad conjunta. Lo que no cabe en ningún día se retorna en `remaining`. */
function waterFillDistribute(total, capacities) {
  const n = capacities.length;
  const alloc = new Array(n).fill(0);
  let remaining = Math.max(0, Math.round(total));
  if (remaining <= 0 || n === 0) return { alloc, remaining };
  let active = capacities.map((c, i) => i).filter((i) => capacities[i] >= 10);
  let guard = 0;
  while (remaining > 0 && active.length > 0 && guard < 200) {
    guard++;
    const per = Math.max(1, Math.floor(remaining / active.length));
    let progressed = false;
    const nextActive = [];
    for (const i of active) {
      if (remaining <= 0) { continue; }
      const room = capacities[i] - alloc[i];
      if (room <= 0) continue;
      const give = Math.min(per, room, remaining);
      if (give > 0) {
        alloc[i] += give;
        remaining -= give;
        progressed = true;
      }
      if (capacities[i] - alloc[i] > 0) nextActive.push(i);
    }
    active = nextActive;
    if (!progressed) break;
  }
  return { alloc, remaining: Math.max(0, remaining) };
}

function sessionIsPast(session, nowISO, nowMin) {
  if (session.date < nowISO) return true;
  if (session.date === nowISO && timeToMin(session.end) <= nowMin) return true;
  return false;
}

function scheduleAll(dataIn) {
  const data = dataIn;
  const now = panamaNow();
  const nowISO = toISO(now);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const tISO = toISO(today);
  const taskOcc = {};
  const addOcc = (dateISO, s, e) => {
    if (!taskOcc[dateISO]) taskOcc[dateISO] = [];
    taskOcc[dateISO].push([s, e]);
  };

  // Cualquier sesión (fijada o no) cuya hora ya pasó se descarta antes de
  // reprogramar: TASKUP! nunca deja ni recalcula sesiones en el pasado, y ese
  // tiempo vuelve a estar disponible para reubicarse en un momento futuro real.
  const tasks = data.tasks.map((t) => ({
    ...t,
    sessions: (t.sessions || []).map((s) => ({ ...s })).filter((s) => !s.pinned || !sessionIsPast(s, nowISO, nowMin)),
  }));

  tasks.forEach((t) => {
    if (t.completed) return;
    (t.sessions || []).forEach((s) => {
      if (s.pinned) addOcc(s.date, timeToMin(s.start), timeToMin(s.end));
    });
  });

  tasks.forEach((t) => {
    if (t.completed || t.delivered) return;
    if (t.priorityAuto) t.priority = autoPriority(t, tISO);
    else if (t.dueDate < tISO) t.priority = "alta";
  });

  const priorityRank = { alta: 0, media: 1, baja: 2 };
  const activeIdx = tasks
    .map((t, i) => i)
    .filter((i) => !tasks[i].completed && !tasks[i].delivered);

  activeIdx.sort((a, b) => {
    const ta = tasks[a], tb = tasks[b];
    const aOverdue = ta.dueDate < tISO ? 0 : 1;
    const bOverdue = tb.dueDate < tISO ? 0 : 1;
    if (aOverdue !== bOverdue) return aOverdue - bOverdue;
    const ap = ta.dueDate < tISO ? "alta" : ta.priority;
    const bp = tb.dueDate < tISO ? "alta" : tb.priority;
    if (priorityRank[ap] !== priorityRank[bp]) return priorityRank[ap] - priorityRank[bp];
    return ta.dueDate.localeCompare(tb.dueDate);
  });

  activeIdx.forEach((i) => {
    const t = tasks[i];
    const overdue = t.dueDate < tISO;

    const availDates = daysAvailable(t.dueDate, tISO);
    const nDays = Math.max(1, Math.min(t.spreadDays || availDates.length, availDates.length));
    const targetDates = availDates.slice(0, nDays);

    const remainingDuration = Math.max(0, Math.round(t.durationMin * (1 - (t.progress || 0) / 100)));

    const pinnedSessions = (t.sessions || []).filter((s) => s.pinned);
    const pinnedByDate = {};
    pinnedSessions.forEach((s) => { pinnedByDate[s.date] = (pinnedByDate[s.date] || 0) + (timeToMin(s.end) - timeToMin(s.start)); });
    const pinnedTotal = pinnedSessions.reduce((sum, s) => sum + (timeToMin(s.end) - timeToMin(s.start)), 0);

    const sessions = [...pinnedSessions];
    let totalUnscheduled = 0;

    function placeOnDay(dISO, minutesWanted) {
      let remaining = minutesWanted;
      if (remaining <= 0) return 0;
      const fixedOcc = occupiedForDate(data, dISO);
      const free = freeFromOccupied([...fixedOcc, ...(taskOcc[dISO] || [])])
        .filter(([s, e]) => e - s >= 10)
        .sort((a, b) => a[0] - b[0]);
      for (const [s, e] of free) {
        if (remaining <= 0) break;
        const chunk = Math.min(remaining, e - s);
        const sess = { id: uid(), date: dISO, day: dayKeyFromDate(parseISO(dISO)), start: minToTime(s), end: minToTime(s + chunk), pinned: false };
        sessions.push(sess);
        addOcc(dISO, s, s + chunk);
        remaining -= chunk;
      }
      return remaining; // lo que no cupo ese día
    }

    if (t.spreadMode === "manual" && Array.isArray(t.spreadManualMinutes) && t.spreadManualMinutes.length === nDays) {
      // Modo manual: el usuario eligió cuánto tiempo dedicar cada día. Si un día
      // elegido no tiene espacio suficiente, lo que sobra pasa al siguiente día
      // que el usuario también eligió — nunca se fuerza ni se recorta sueño/personal.
      let carry = 0;
      targetDates.forEach((dISO, idx) => {
        const pinnedToday = pinnedByDate[dISO] || 0;
        const wanted = Math.max(0, (t.spreadManualMinutes[idx] || 0) - pinnedToday) + carry;
        carry = placeOnDay(dISO, wanted);
      });
      totalUnscheduled = carry;
    } else {
      // Modo automático: primero medimos cuánta capacidad real (en bloques de
      // al menos 10 min) tiene cada día disponible antes de la entrega, y luego
      // repartimos el trabajo restante entre esos días según esa capacidad real
      // — nunca más de lo que un día puede dar. Los días sin espacio quedan en 0
      // y el resto se reparte parejo entre los demás, evitando tanto hacerlo todo
      // de inmediato como dejarlo todo para el último día.
      const capacities = targetDates.map((dISO) => {
        const fixedOcc = occupiedForDate(data, dISO);
        const free = freeFromOccupied([...fixedOcc, ...(taskOcc[dISO] || [])]).filter(([s, e]) => e - s >= 10);
        return free.reduce((sum, [s, e]) => sum + (e - s), 0);
      });
      const toSchedule = Math.max(0, remainingDuration - pinnedTotal);
      const { alloc, remaining } = waterFillDistribute(toSchedule, capacities);
      targetDates.forEach((dISO, idx) => { placeOnDay(dISO, alloc[idx]); });
      totalUnscheduled = remaining;
    }

    t.sessions = sessions.sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
    t.unscheduled = totalUnscheduled;
    t.needsSuggestion = totalUnscheduled > 0;

    if (totalUnscheduled > 0) {
      let personalAvail = 0;
      targetDates.forEach((dISO) => { personalAvail += availablePersonalMinutesForDate(data, dISO); });
      t.suggestionKind = personalAvail >= totalUnscheduled ? "personal" : "sleep";
    } else {
      t.suggestionKind = null;
    }
  });

  return tasks;
}

/* ============================================================
   HISTORIAL: utilidades
============================================================ */
function pruneHistory(history) {
  const cutoff = addDays(panamaNow(), -180).getTime();
  return (history || []).filter((h) => new Date(h.date).getTime() >= cutoff);
}
function pushHistory(data, entry) {
  const h = { id: uid(), date: new Date().toISOString(), ...entry };
  return pruneHistory([h, ...(data.history || [])]);
}
function scheduleSnapshot(d) {
  return {
    fixedBlocks: d.fixedBlocks, sleep: d.sleep, personalMinutes: d.personalMinutes,
    events: d.events, exams: d.exams, shabbat: d.shabbat,
  };
}

/* ============================================================
   CONTEXTO GLOBAL
============================================================ */
const AppCtx = createContext(null);
function useApp() { return useContext(AppCtx); }

function useTx(lang) {
  return useCallback((es, en) => (lang === "en" ? en : es), [lang]);
}

/* ============================================================
   ALMACENAMIENTO PERSISTENTE (localStorage, solo en este navegador)
============================================================ */
const STORAGE_KEY = "taskup_state_v2";

async function loadState() {
  try {
    const crudo = localStorage.getItem(STORAGE_KEY);
    if (crudo) return JSON.parse(crudo);
  } catch (e) { console.error("No se pudo leer lo guardado", e); }
  return null;
}
async function saveState(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) { console.error("No se pudo guardar", e); }
}

/* ============================================================
   LLAMADAS A LA IA (pasan por el servidor del HUB, que guarda la llave)
============================================================ */
async function pedirIA(ruta, cuerpo) {
  const res = await fetch(ruta, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cuerpo) });
  const datos = await res.json().catch(() => null);
  if (!res.ok) throw new Error(datos?.error || "error");
  return datos;
}

/* ============================================================
   PRIMITIVOS DE UI
============================================================ */
function IconBtn({ onClick, children, title, style }) {
  const { th } = useApp();
  return (
    <button
      onClick={onClick}
      title={title}
      style={{ background: th.surfaceAlt, color: th.text, border: `1px solid ${th.border}`, ...style }}
      className="w-9 h-9 rounded-xl flex items-center justify-center hover:opacity-80 transition"
    >
      {children}
    </button>
  );
}

function Btn({ onClick, children, variant = "primary", style, disabled, type = "button", className = "" }) {
  const { th } = useApp();
  const base = "px-4 py-2.5 rounded-2xl font-semibold text-sm transition active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2";
  const variants = {
    primary: { background: th.primary, color: th.primaryText },
    soft: { background: th.primarySoft, color: th.primary },
    ghost: { background: "transparent", color: th.textMuted, border: `1px solid ${th.border}` },
    danger: { background: "#FDECEC", color: "#C53030" },
    surface: { background: th.surface, color: th.text, border: `1px solid ${th.border}` },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={base + " " + className} style={{ ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

function Pill({ children, color, bg }) {
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1"
      style={{ color: color || "#fff", background: bg || color, backgroundColor: bg }}
    >
      {children}
    </span>
  );
}

function PriorityPill({ p, lang }) {
  const bgMap = { alta: "#FDECEC", media: "#FEF3E2", baja: "#E8F8EE" };
  const colMap = { alta: "#C53030", media: "#B7791F", baja: "#276749" };
  return <Pill bg={bgMap[p]} color={colMap[p]}>{PRI_LABEL[lang][p]}</Pill>;
}

function Card({ children, style, className = "" }) {
  const { th } = useApp();
  return (
    <div className={"rounded-3xl p-5 " + className} style={{ background: th.surface, border: `1px solid ${th.border}`, boxShadow: th.shadow, ...style }}>
      {children}
    </div>
  );
}

function EmptyState({ icon: Icon, text }) {
  const { th } = useApp();
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 rounded-3xl" style={{ background: th.surfaceAlt, border: `1px dashed ${th.border}` }}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: th.primarySoft, color: th.primary }}>
        <Icon size={26} />
      </div>
      <p style={{ color: th.textMuted }} className="text-sm max-w-xs">{text}</p>
    </div>
  );
}

function Field({ label, children }) {
  const { th } = useApp();
  return (
    <label className="block mb-4">
      <span className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: th.textMuted }}>{label}</span>
      {children}
    </label>
  );
}

function inputStyle(th) {
  return {
    background: th.surfaceAlt, color: th.text, border: `1px solid ${th.border}`,
  };
}

function TextInput(props) {
  const { th } = useApp();
  return <input {...props} style={{ ...inputStyle(th), ...(props.style || {}) }} className={"w-full px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 " + (props.className || "")} />;
}
function TextArea(props) {
  const { th } = useApp();
  return <textarea {...props} style={{ ...inputStyle(th), ...(props.style || {}) }} className={"w-full px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 " + (props.className || "")} />;
}
function Select(props) {
  const { th } = useApp();
  return <select {...props} style={{ ...inputStyle(th), ...(props.style || {}) }} className={"w-full px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 " + (props.className || "")} />;
}

function ChipToggle({ active, onClick, children, activeColor }) {
  const { th } = useApp();
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3.5 py-2 rounded-xl text-sm font-semibold transition border"
      style={active
        ? { background: (activeColor || th.primary), color: "#fff", borderColor: activeColor || th.primary }
        : { background: th.surfaceAlt, color: th.textMuted, borderColor: th.border }}
    >
      {children}
    </button>
  );
}

function Modal({ onClose, children, wide }) {
  const { th } = useApp();
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: "rgba(10,11,26,0.55)" }} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose && onClose(); }}>
      <div
        className={"w-full sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-y-auto " + (wide ? "sm:max-w-2xl" : "sm:max-w-md")}
        style={{ background: th.surface, maxHeight: "92vh", boxShadow: th.shadow }}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, onClose, icon: Icon }) {
  const { th } = useApp();
  return (
    <div className="flex items-center justify-between px-6 py-5 sticky top-0 z-10" style={{ background: th.surface, borderBottom: `1px solid ${th.border}` }}>
      <div className="flex items-center gap-2.5">
        {Icon && <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: th.primarySoft, color: th.primary }}><Icon size={17} /></div>}
        <h2 className="font-bold text-lg" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h2>
      </div>
      <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70" style={{ background: th.surfaceAlt, color: th.textMuted }}>
        <X size={16} />
      </button>
    </div>
  );
}

function ConfirmModal({ title, message, confirmLabel, cancelLabel, onConfirm, onCancel, danger }) {
  const { th } = useApp();
  return (
    <Modal onClose={onCancel}>
      <div className="p-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: danger ? "#FDECEC" : th.primarySoft, color: danger ? "#C53030" : th.primary }}>
          <AlertTriangle size={22} />
        </div>
        <h3 className="font-bold text-lg mb-2" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h3>
        <p className="text-sm mb-6" style={{ color: th.textMuted }}>{message}</p>
        <div className="flex gap-3">
          <Btn variant="ghost" onClick={onCancel} className="flex-1">{cancelLabel}</Btn>
          <Btn variant={danger ? "danger" : "primary"} onClick={onConfirm} className="flex-1">{confirmLabel}</Btn>
        </div>
      </div>
    </Modal>
  );
}

/* ============================================================
   ONBOARDING — todos los datos iniciales juntos, luego intro
============================================================ */
function Onboarding() {
  const { setData, th, lang, tx } = useApp();
  const [step, setStep] = useState(0);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [rol, setRol] = useState("");
  const [rolOtro, setRolOtro] = useState("");
  const [genero, setGenero] = useState("");
  const [nacimiento, setNacimiento] = useState("");
  const [err, setErr] = useState("");

  const steps = ["datos", "intro1", "intro2"];
  const key = steps[step];

  function next() {
    setErr("");
    if (key === "datos") {
      if (!nombre.trim()) return setErr(tx("Escribe tu nombre.", "Enter your first name."));
      if (!apellido.trim()) return setErr(tx("Escribe tu apellido.", "Enter your last name."));
      if (!rol || (rol === "otro" && !rolOtro.trim())) return setErr(tx("Selecciona qué eres.", "Select what you are."));
      if (!genero) return setErr(tx("Selecciona una opción de género.", "Select a gender option."));
      if (!nacimiento) return setErr(tx("Selecciona tu fecha de nacimiento.", "Select your date of birth."));
    }
    if (step === steps.length - 1) {
      setData((d) => ({
        ...d,
        user: { nombre: nombre.trim(), apellido: apellido.trim(), rol, rolOtro: rol === "otro" ? rolOtro.trim() : "", genero, nacimiento },
        onboarded: true,
        introDone: true,
      }));
      return;
    }
    setStep((s) => s + 1);
  }
  function back() {
    setErr("");
    if (step > 0) setStep((s) => s - 1);
  }

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{ background: th.headerGrad }}>
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: th.primary }}>
            <Sparkles size={20} color="#fff" />
          </div>
          <span className="font-extrabold text-2xl" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>TASKUP!</span>
        </div>

        <div className="h-1.5 rounded-full mb-8 overflow-hidden" style={{ background: th.surfaceAlt }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: th.primary }} />
        </div>

        <Card>
          {key === "datos" && (
            <>
              <h2 className="font-bold text-xl mb-1" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>{tx("Cuéntanos sobre ti", "Tell us about yourself")}</h2>
              <p className="text-sm mb-5" style={{ color: th.textMuted }}>{tx("Completa tus datos para comenzar.", "Fill in your info to get started.")}</p>
              <Field label={tx("Nombre", "First name")}>
                <TextInput autoFocus value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder={tx("Nombre", "First name")} />
              </Field>
              <Field label={tx("Apellido", "Last name")}>
                <TextInput value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder={tx("Apellido", "Last name")} />
              </Field>
              <Field label={tx("Fecha de nacimiento", "Date of birth")}>
                <TextInput type="date" value={nacimiento} onChange={(e) => setNacimiento(e.target.value)} />
              </Field>
              <Field label={tx("¿Qué eres?", "What are you?")}>
                <div className="grid grid-cols-2 gap-2.5 mb-2">
                  {ROLE_KEYS.map((r) => {
                    const Icon = ROLE_ICON[r];
                    return (
                      <button key={r} onClick={() => setRol(r)} className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border transition"
                        style={rol === r ? { background: th.primarySoft, borderColor: th.primary, color: th.primary } : { background: th.surfaceAlt, borderColor: th.border, color: th.textMuted }}>
                        <Icon size={18} />
                        <span className="text-xs font-semibold">{ROLE_LABEL[lang][r]}</span>
                      </button>
                    );
                  })}
                </div>
                {rol === "otro" && (
                  <TextInput className="mt-1" placeholder={tx("¿Qué eres?", "What are you?")} value={rolOtro} onChange={(e) => setRolOtro(e.target.value)} />
                )}
              </Field>
              <Field label={tx("Género", "Gender")}>
                <div className="grid grid-cols-2 gap-2.5">
                  {["mujer", "hombre"].map((g) => (
                    <button key={g} onClick={() => setGenero(g)} className="py-3 rounded-2xl border font-semibold text-sm transition"
                      style={genero === g ? { background: th.primarySoft, borderColor: th.primary, color: th.primary } : { background: th.surfaceAlt, borderColor: th.border, color: th.textMuted }}>
                      {g === "mujer" ? tx("Mujer", "Woman") : tx("Hombre", "Man")}
                    </button>
                  ))}
                </div>
              </Field>
            </>
          )}
          {key === "intro1" && (
            <>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: th.primarySoft, color: th.primary }}><Sparkles size={22} /></div>
              <h2 className="font-bold text-xl mb-3" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>{tx("¿Qué es TASKUP?", "What is TASKUP?")}</h2>
              <p className="text-sm leading-relaxed" style={{ color: th.textMuted }}>
                {tx(
                  "TASKUP! es tu asistente de organización del tiempo: analiza tu horario, tus responsabilidades y tus trabajos pendientes. En vez de solo hacer una lista, decide cuándo es el mejor momento para hacer cada cosa. Tú siempre tienes el control final de tu horario.",
                  "TASKUP! is your time-organization assistant: it analyzes your schedule, your responsibilities, and your pending work. Instead of just making a list, it decides the best moment to do each thing. You always keep final control of your schedule."
                )}
              </p>
            </>
          )}
          {key === "intro2" && (
            <>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: th.primarySoft, color: th.primary }}><ClipboardList size={22} /></div>
              <h2 className="font-bold text-xl mb-3" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>{tx("¿Cómo se usa?", "How does it work?")}</h2>
              <p className="text-sm leading-relaxed" style={{ color: th.textMuted }}>
                {tx(
                  "Agrega tu horario, tus actividades, tus horas de sueño y tu tiempo personal. Luego agrega tus trabajos con su fecha de entrega. TASKUP! usa toda esa información para organizar automáticamente cuándo hacer cada trabajo, respetando siempre tu descanso y tu tiempo personal.",
                  "Add your schedule, activities, sleep hours and personal time. Then add your assignments with their due dates. TASKUP! uses all of that information to automatically organize when to do each task, always respecting your rest and personal time."
                )}
              </p>
            </>
          )}

          {err && <p className="text-xs font-semibold mt-3" style={{ color: "#C53030" }}>{err}</p>}

          <div className="flex gap-3 mt-6">
            {step > 0 && <Btn variant="ghost" onClick={back}>{tx("Atrás", "Back")}</Btn>}
            <Btn onClick={next} className="flex-1">
              {step === steps.length - 1 ? tx("Ir a Inicio", "Go to Home") : tx("Continuar", "Continue")}
              <ArrowRight size={16} />
            </Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ============================================================
   NAVEGACIÓN
============================================================ */
const NAV_ITEMS = [
  { key: "inicio", icon: Home, es: "Inicio", en: "Home" },
  { key: "horarios", icon: CalendarDays, es: "Horarios", en: "Schedule" },
  { key: "agregar", icon: PlusCircle, es: "Agregar trabajo", en: "Add work" },
  { key: "hechos", icon: CheckCircle2, es: "Trabajos hechos", en: "Done" },
  { key: "progreso", icon: TrendingUp, es: "Progreso", en: "Progress" },
  { key: "historial", icon: HistoryIcon, es: "Historial", en: "History" },
  { key: "config", icon: SettingsIcon, es: "Configuración", en: "Settings" },
  { key: "nosotros", icon: Info, es: "Sobre nosotros", en: "About us" },
];

function NavList({ view, onNavigate }) {
  const { th, lang } = useApp();
  return (
    <div className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = view === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition text-left"
            style={active ? { background: th.primary, color: th.primaryText } : { color: th.textMuted }}
          >
            <Icon size={18} />
            {lang === "es" ? item.es : item.en}
          </button>
        );
      })}
    </div>
  );
}

function UserBadge({ user, lang, th }) {
  const roleText = user?.rol === "otro" ? (user?.rolOtro || "") : (ROLE_LABEL[lang][user?.rol] || "");
  return (
    <div className="min-w-0">
      <p className="text-sm font-bold truncate" style={{ color: th.text }}>{[user?.nombre, user?.apellido].filter(Boolean).join(" ") || "—"}</p>
      <p className="text-[11px] truncate" style={{ color: th.textMuted }}>{roleText}</p>
    </div>
  );
}

function Sidebar({ view, setView, user }) {
  const { th, lang } = useApp();
  return (
    <div className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 px-4 py-6" style={{ background: th.surface, borderRight: `1px solid ${th.border}` }}>
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: th.primary }}>
          <Sparkles size={18} color="#fff" />
        </div>
        <span className="font-extrabold text-xl" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>TASKUP!</span>
      </div>
      <NavList view={view} onNavigate={setView} />
      <div className="mt-auto pt-6 flex items-center gap-2.5 px-2">
        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0" style={{ background: th.primarySoft, color: th.primary }}>
          {user?.nombre?.[0]?.toUpperCase() || "?"}
        </div>
        <UserBadge user={user} lang={lang} th={th} />
      </div>
    </div>
  );
}

function MobileTopBar({ setDrawerOpen, title }) {
  const { th } = useApp();
  return (
    <div className="md:hidden flex items-center justify-between px-4 py-4 sticky top-0 z-30" style={{ background: th.surface, borderBottom: `1px solid ${th.border}` }}>
      <button onClick={() => setDrawerOpen(true)} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: th.surfaceAlt, color: th.text }}>
        <Menu size={18} />
      </button>
      <span className="font-bold text-base" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>{title}</span>
      <div className="w-9 h-9" />
    </div>
  );
}

function MobileDrawer({ open, onClose, view, setView, user }) {
  const { th, lang } = useApp();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex" style={{ background: "rgba(10,11,26,0.55)" }} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-72 h-full px-4 py-6 flex flex-col" style={{ background: th.surface }}>
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: th.primary }}><Sparkles size={18} color="#fff" /></div>
            <span className="font-extrabold text-xl" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>TASKUP!</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: th.surfaceAlt, color: th.textMuted }}><X size={16} /></button>
        </div>
        <NavList view={view} onNavigate={(k) => { setView(k); onClose(); }} />
        <div className="mt-auto pt-6 flex items-center gap-2.5 px-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0" style={{ background: th.primarySoft, color: th.primary }}>
            {user?.nombre?.[0]?.toUpperCase() || "?"}
          </div>
          <UserBadge user={user} lang={lang} th={th} />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TARJETA DE TRABAJO (usada en Inicio)
============================================================ */
function TaskCard({ task, onComplete, onDelete, onDeliver, onResolveSuggestion, onEdit, onProgress, onStudy }) {
  const { th, lang, tx } = useApp();
  const tISO = todayISO();
  const overdue = task.dueDate < tISO && !task.completed;
  const sessions = task.sessions || [];
  const isStudyType = task.type === "examen" || task.type === "estudio";
  const progress = task.progress || 0;

  return (
    <Card className="relative" style={{ padding: 14 }}>
      <div className="absolute left-0 top-3 bottom-3 w-1 rounded-full" style={{ background: task.completed ? "#27AE60" : th.primary }} />
      <div className="pl-3 flex items-start gap-2.5">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-sm truncate" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>{task.name}</h3>
          <p className="text-[11px]" style={{ color: th.textMuted }}>{task.subject || TYPE_LABEL[lang][task.type]}</p>

          <div className="flex flex-wrap items-center gap-2 text-[11px] mt-1" style={{ color: th.textMuted }}>
            <span className="flex items-center gap-1"><CalendarDays size={11} /> {fmtDate(task.dueDate, lang)}</span>
            {overdue && <Pill bg="#FDECEC" color="#C53030">{tx("Atrasado", "Overdue")}</Pill>}
            {task.delivered && <Pill bg="#E8F8EE" color="#276749">{tx("Entregado", "Delivered")}</Pill>}
            {progress > 0 && !task.completed && <Pill bg={th.primarySoft} color={th.primary}>{progress}%</Pill>}
          </div>

          {sessions.length > 0 && !task.completed && (
            <div className="rounded-xl px-2.5 py-1.5 mt-1.5" style={{ background: th.surfaceAlt }}>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                {sessions.slice(0, 3).map((s) => (
                  <span key={s.id} className="text-[10px] flex items-center gap-1" style={{ color: th.text }}>
                    <CircleDot size={9} style={{ color: s.pinned ? th.accent : th.primary }} />
                    {fmtDate(s.date, lang)} {s.start}–{s.end}
                  </span>
                ))}
                {sessions.length > 3 && <span className="text-[10px]" style={{ color: th.textMuted }}>+{sessions.length - 3}</span>}
              </div>
            </div>
          )}

          {task.needsSuggestion && !task.delivered && !task.completed && (
            <div className="rounded-xl px-2.5 py-1.5 mt-1.5" style={{ background: "#FEF3E2" }}>
              <p className="text-[11px] font-semibold mb-1" style={{ color: "#8A5A15" }}>
                {tx(`Faltan ${fmtHours(task.unscheduled)}.`, `${fmtHours(task.unscheduled)} short.`)}
              </p>
              <div className="flex flex-wrap gap-1.5">
                <Btn variant="surface" style={{ padding: "4px 8px", fontSize: 11 }} onClick={() => onResolveSuggestion(task, "personal")}>{tx("Usar tiempo personal", "Use personal time")}</Btn>
                <Btn variant="surface" style={{ padding: "4px 8px", fontSize: 11 }} onClick={() => onResolveSuggestion(task, "sleep")}>{tx("Reducir sueño", "Reduce sleep")}</Btn>
                {task.dueDate <= tISO && (
                  <Btn variant="surface" style={{ padding: "4px 8px", fontSize: 11 }} onClick={() => onDeliver(task.id)}>{tx("Marcar entregada", "Mark delivered")}</Btn>
                )}
              </div>
            </div>
          )}

          {!task.completed && (
            <>
              <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                <span className="text-[10px] mr-1" style={{ color: th.textMuted }}>{tx("Progreso", "Progress")}:</span>
                {[25, 50, 75, 100].map((p) => (
                  <button key={p} onClick={() => onProgress(task, p)} className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                    style={progress === p ? { background: th.primary, color: "#fff" } : { background: th.surfaceAlt, color: th.textMuted }}>{p}%</button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                <Btn variant="ghost" style={{ padding: "4px 8px", fontSize: 11 }} onClick={() => onEdit(task)}><PencilLine size={11} />{tx("Editar", "Edit")}</Btn>
                <Btn variant="ghost" style={{ padding: "4px 8px", fontSize: 11, color: "#C53030" }} onClick={() => onDelete(task)}><Trash2 size={11} />{tx("Eliminar", "Delete")}</Btn>
                {isStudyType && (
                  <Btn variant="soft" style={{ padding: "4px 8px", fontSize: 11 }} onClick={() => onStudy(task)}><BookOpen size={11} />{tx("Ayúdame a estudiar", "Help me study")}</Btn>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col items-center gap-0.5 shrink-0">
          <button onClick={() => onComplete(task.id)} disabled={task.completed} className="w-7 h-7 rounded-full flex items-center justify-center border-2 transition hover:opacity-80"
            style={task.completed ? { background: "#27AE60", borderColor: "#27AE60", color: "#fff" } : { borderColor: "#27AE60", color: "#27AE60" }} title={tx("Marcar como completado", "Mark as completed")}>
            <Check size={13} />
          </button>
          {task.completed && <span className="text-[9px] font-bold" style={{ color: "#27AE60" }}>{tx("¡Hecho!", "Done!")}</span>}
        </div>
      </div>
    </Card>
  );
}

/* ============================================================
   INICIO
============================================================ */
function HomeView({ setEditingTask, requestDelete }) {
  const { data, setData, th, lang, tx, reschedule } = useApp();
  const tISO = todayISO();
  const pending = (data.tasks || []).filter((t) => !t.completed && !t.delivered).sort((a, b) => {
    const rank = { alta: 0, media: 1, baja: 2 };
    if (rank[a.priority] !== rank[b.priority]) return rank[a.priority] - rank[b.priority];
    return a.dueDate.localeCompare(b.dueDate);
  });
  const deliveredPending = (data.tasks || []).filter((t) => t.delivered && !t.completed);

  const oneWeekAgo = addDays(panamaNow(), -7).getTime();
  const completedRecent = (data.tasks || []).filter((t) => t.completed && t.completedAt && new Date(t.completedAt).getTime() >= oneWeekAgo)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

  const birthday = (() => {
    if (!data.user?.nacimiento) return false;
    const b = parseISO(data.user.nacimiento);
    const now = panamaNow();
    return b.getMonth() === now.getMonth() && b.getDate() === now.getDate();
  })();

  const reminders = useMemo(() => {
    if (!data.settings.notif) return [];
    const out = [];
    (data.tasks || []).forEach((t) => {
      if (t.completed || t.delivered) return;
      const days = Math.round((parseISO(t.dueDate) - parseISO(tISO)) / 86400000);
      if (days === 0) out.push({ id: "t-" + t.id, text: tx(`"${t.name}" se entrega hoy.`, `"${t.name}" is due today.`) });
      else if (days === 1) out.push({ id: "t-" + t.id, text: tx(`"${t.name}" se entrega mañana.`, `"${t.name}" is due tomorrow.`) });
      else if (days === 2) out.push({ id: "t-" + t.id, text: tx(`"${t.name}" se entrega en 2 días.`, `"${t.name}" is due in 2 days.`) });
    });
    (data.exams || []).forEach((ex) => {
      const days = Math.round((parseISO(ex.date) - parseISO(tISO)) / 86400000);
      if (days === 0) out.push({ id: "e-" + ex.id, text: tx(`Examen "${ex.title}" es hoy.`, `Exam "${ex.title}" is today.`) });
      else if (days === 1) out.push({ id: "e-" + ex.id, text: tx(`Examen "${ex.title}" es mañana.`, `Exam "${ex.title}" is tomorrow.`) });
    });
    return out;
  }, [data.tasks, data.exams, data.settings.notif, lang, tISO]);

  function completeTask(id) {
    setData((d) => {
      const tasks = d.tasks.map((t) => t.id === id ? { ...t, completed: true, completedAt: new Date().toISOString(), delivered: false } : t);
      const nd = { ...d, tasks, history: pushHistory(d, { type: "completed", entityType: "task", title: d.tasks.find(x => x.id === id)?.name, snapshot: null }) };
      return { ...nd, tasks: reschedule(nd) };
    });
  }
  function deliverTask(id) {
    setData((d) => {
      const tasks = d.tasks.map((t) => t.id === id ? { ...t, delivered: true } : t);
      const nd = { ...d, tasks };
      return { ...nd, tasks: reschedule(nd) };
    });
  }
  function resolveSuggestion(task, kind) {
    setData((d) => {
      let nd = { ...d };
      const tISO2 = todayISO();
      const availDates = daysAvailable(task.dueDate, tISO2);
      const nDays = Math.max(1, Math.min(task.spreadDays || availDates.length, availDates.length));
      const targetDates = availDates.slice(0, nDays);
      let remaining = task.unscheduled;
      if (kind === "personal") {
        const overrides = { ...nd.personalOverrides };
        for (const dISO of targetDates) {
          if (remaining <= 0) break;
          const avail = availablePersonalMinutesForDate(nd, dISO);
          const take = Math.min(avail, remaining);
          if (take > 0) {
            overrides[dISO] = { reduceMinutes: (overrides[dISO]?.reduceMinutes || 0) + take };
            remaining -= take;
          }
        }
        nd.personalOverrides = overrides;
      } else {
        const overrides = { ...nd.sleepOverrides };
        for (const dISO of targetDates) {
          if (remaining <= 0) break;
          const take = Math.min(60, remaining);
          overrides[dISO] = { reduceMinutes: (overrides[dISO]?.reduceMinutes || 0) + take };
          remaining -= take;
        }
        nd.sleepOverrides = overrides;
      }
      return { ...nd, tasks: reschedule(nd) };
    });
  }
  function undoComplete(id) {
    setData((d) => {
      const tasks = d.tasks.map((t) => t.id === id ? { ...t, completed: false, completedAt: null } : t);
      const nd = { ...d, tasks };
      return { ...nd, tasks: reschedule(nd) };
    });
  }
  function updateProgress(task, p) {
    setData((d) => {
      const tasks = d.tasks.map((t) => t.id === task.id ? { ...t, progress: p, sessions: (t.sessions || []).filter((s) => s.pinned) } : t);
      const nd = { ...d, tasks };
      return { ...nd, tasks: reschedule(nd) };
    });
  }
  const [studyTask, setStudyTask] = useState(null);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-28">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-1" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>
        {birthday ? `🎉 ${tx("FELIZ CUMPLEAÑOS", "HAPPY BIRTHDAY")} 🎉` : `${tx("Hola", "Hi")}, ${data.user?.nombre} 👋`}
      </h1>
      <p className="text-sm mb-6" style={{ color: th.textMuted }}>
        {birthday ? tx("Que tengas un día increíble.", "Have an amazing day.") : tx("Esto es lo que tienes pendiente.", "Here's what you have pending.")}
      </p>

      {reminders.length > 0 && (
        <div className="rounded-2xl p-4 mb-6 flex flex-col gap-1.5" style={{ background: th.primarySoft }}>
          <p className="text-xs font-bold flex items-center gap-1.5 mb-1" style={{ color: th.primary }}><Bell size={13} /> {tx("Recordatorios", "Reminders")}</p>
          {reminders.map((r) => <p key={r.id} className="text-xs" style={{ color: th.text }}>{r.text}</p>)}
        </div>
      )}

      {deliveredPending.length > 0 && (
        <div className="rounded-2xl p-4 mb-6" style={{ background: th.surfaceAlt, border: `1px solid ${th.border}` }}>
          <p className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: th.textMuted }}>{tx("Entregados, sin marcar completado", "Delivered, not marked complete")}</p>
          <div className="flex flex-col gap-2">
            {deliveredPending.map((t) => (
              <div key={t.id} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: th.text }}>{t.name}</span>
                <Btn variant="soft" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => completeTask(t.id)}>{tx("Marcar completado", "Mark complete")}</Btn>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-xl md:text-2xl font-extrabold mb-4" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>{tx("Pendientes", "Pending")}</h2>

      {pending.length === 0 ? (
        <EmptyState icon={PartyPopper} text={tx("No tienes trabajos pendientes.", "You have no pending work.")} />
      ) : (
        <div className="flex flex-col gap-4">
          {pending.map((t) => (
            <TaskCard key={t.id} task={t} onComplete={completeTask} onDelete={requestDelete} onDeliver={deliverTask} onResolveSuggestion={resolveSuggestion} onEdit={setEditingTask} onProgress={updateProgress} onStudy={setStudyTask} />
          ))}
        </div>
      )}

      {studyTask && <StudyHelperModal task={studyTask} onClose={() => setStudyTask(null)} />}

      <div className="mt-10">
        <h2 className="text-sm font-extrabold tracking-wide mb-4" style={{ color: th.textMuted }}>{tx("COMPLETADOS ESTA ÚLTIMA SEMANA", "COMPLETED THIS LAST WEEK")}</h2>
        {completedRecent.length === 0 ? (
          <p className="text-xs" style={{ color: th.textMuted }}>{tx("Todavía no has completado nada esta semana.", "You haven't completed anything this week yet.")}</p>
        ) : (
          <div className="flex flex-col gap-3">
            {completedRecent.map((t) => (
              <Card key={t.id} style={{ opacity: 0.85 }}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#27AE60", color: "#fff" }}><Check size={14} /></div>
                    <div className="min-w-0">
                      <p className="font-bold truncate text-sm" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>{t.name}</p>
                      <p className="text-xs truncate" style={{ color: th.textMuted }}>{t.subject || TYPE_LABEL[lang][t.type]}</p>
                    </div>
                  </div>
                  <Btn variant="ghost" style={{ padding: "6px 10px", fontSize: 12 }} onClick={() => undoComplete(t.id)}><Undo2 size={13} />{tx("Deshacer", "Undo")}</Btn>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   AGREGAR / EDITAR TRABAJO
============================================================ */
function AddTaskModal({ onClose, editingTask }) {
  const { data, setData, th, lang, tx, reschedule } = useApp();
  const isEdit = !!editingTask;
  const [name, setName] = useState(editingTask?.name || "");
  const [subject, setSubject] = useState(editingTask?.subject || "");
  const [type, setType] = useState(editingTask?.type || "tarea");
  const [difficulty, setDifficulty] = useState(editingTask?.difficulty || "media");
  const [priorityMode, setPriorityMode] = useState(editingTask ? (editingTask.priorityAuto ? "auto" : "manual") : "auto");
  const [priority, setPriority] = useState(editingTask?.priority || "media");
  const [dueDate, setDueDate] = useState(editingTask?.dueDate || "");
  const [durMode, setDurMode] = useState(editingTask?.durationMode || "auto");
  const initH = editingTask?.durationMode === "manual" ? Math.floor((editingTask?.durationMin || 0) / 60) : "";
  const initM = editingTask?.durationMode === "manual" ? (editingTask?.durationMin || 0) % 60 : "";
  const [customH, setCustomH] = useState(initH);
  const [customM, setCustomM] = useState(initM);
  const [err, setErr] = useState("");

  const tISO = todayISO();
  const maxDays = useMemo(() => (dueDate ? daysAvailable(dueDate, tISO).length : 1), [dueDate, tISO]);

  const [spreadMode, setSpreadMode] = useState(editingTask?.spreadMode || "auto");
  const [spreadDays, setSpreadDays] = useState(editingTask?.spreadDays || 1);
  const [spreadManualMinutes, setSpreadManualMinutes] = useState(editingTask?.spreadManualMinutes || []);

  useEffect(() => {
    setSpreadDays((sd) => {
      if (!dueDate) return 1;
      if (!sd || sd > maxDays) return maxDays;
      return sd;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxDays, dueDate]);

  useEffect(() => {
    setSpreadManualMinutes((arr) => {
      const next = [...arr];
      while (next.length < spreadDays) next.push(30);
      return next.slice(0, spreadDays);
    });
  }, [spreadDays]);

  const spreadDateList = useMemo(() => {
    if (!dueDate) return [];
    return daysAvailable(dueDate, tISO).slice(0, spreadDays);
  }, [dueDate, tISO, spreadDays]);

  function submit() {
    if (!name.trim()) return setErr(tx("Ponle un nombre al trabajo.", "Give the work a name."));
    if (!dueDate) return setErr(tx("Selecciona una fecha de entrega.", "Select a due date."));

    let durationMin;
    let finalSpreadManual = null;

    if (spreadMode === "manual") {
      const manualArr = spreadDateList.map((_, idx) => parseInt(spreadManualMinutes[idx], 10) || 0);
      const sum = manualArr.reduce((a, b) => a + b, 0);
      if (sum <= 0) return setErr(tx("Escribe cuánto tiempo trabajar cada día.", "Enter how long to work each day."));
      durationMin = sum;
      finalSpreadManual = manualArr;
    } else {
      if (durMode === "auto" || durMode === "unsure") durationMin = estimateDuration(type, difficulty);
      else {
        const h = parseInt(customH, 10) || 0;
        const m = parseInt(customM, 10) || 0;
        const v = h * 60 + m;
        if (!v || v <= 0) return setErr(tx("Escribe una duración válida (horas y/o minutos).", "Enter a valid duration (hours and/or minutes)."));
        durationMin = v;
      }
    }

    const base = {
      name: name.trim(), subject: subject.trim(), type, difficulty,
      dueDate, durationMin, durationMode: durMode,
      spreadDays: spreadDateList.length || 1, spreadMode,
      spreadManualMinutes: finalSpreadManual,
    };
    const priorityAuto = priorityMode === "auto";
    const finalPriority = priorityAuto ? autoPriority({ ...base }, tISO) : priority;

    setData((d) => {
      let tasks;
      if (isEdit) {
        tasks = d.tasks.map((t) => t.id === editingTask.id ? { ...t, ...base, priority: finalPriority, priorityAuto, sessions: (t.sessions || []).filter(s => s.pinned) } : t);
      } else {
        const newTask = { id: uid(), ...base, priority: finalPriority, priorityAuto, sessions: [], completed: false, completedAt: null, delivered: false, unscheduled: 0, needsSuggestion: false, progress: 0, createdAt: new Date().toISOString() };
        tasks = [...d.tasks, newTask];
      }
      const nd = { ...d, tasks };
      return { ...nd, tasks: reschedule(nd) };
    });
    onClose();
  }

  return (
    <Modal onClose={onClose} wide>
      <ModalHeader title={isEdit ? tx("Editar trabajo", "Edit work") : tx("Agregar trabajo", "Add work")} onClose={onClose} icon={ClipboardList} />
      <div className="p-6">
        <Field label={tx("Nombre del trabajo", "Work name")}>
          <TextInput autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder={tx("Ej. Proyecto de Ciencias", "E.g. Science project")} />
        </Field>
        <Field label={tx("Materia", "Subject")}>
          <TextInput value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={tx("Ej. Ciencias", "E.g. Science")} />
        </Field>
        <Field label={tx("Tipo de trabajo", "Type of work")}>
          <div className="flex flex-wrap gap-2">
            {TYPE_KEYS.map((k) => <ChipToggle key={k} active={type === k} onClick={() => setType(k)}>{TYPE_LABEL[lang][k]}</ChipToggle>)}
          </div>
        </Field>

        <Field label={tx("Dificultad", "Difficulty")}>
          <div className="flex gap-2">
            {DIFF_KEYS.map((k) => <ChipToggle key={k} active={difficulty === k} onClick={() => setDifficulty(k)}>{DIFF_LABEL[lang][k]}</ChipToggle>)}
          </div>
        </Field>

        <Field label={tx("Prioridad", "Priority")}>
          <div className="flex flex-wrap gap-2 mb-2">
            <ChipToggle active={priorityMode === "auto"} onClick={() => setPriorityMode("auto")} activeColor={th.primary}>
              <Wand2 size={13} className="inline mr-1" />{tx("Automática (TASKUP! decide)", "Automatic (TASKUP! decides)")}
            </ChipToggle>
          </div>
          <div className="flex gap-2">
            {PRI_KEYS.map((k) => (
              <ChipToggle key={k} active={priorityMode === "manual" && priority === k} activeColor={COLORS[k]}
                onClick={() => { setPriorityMode("manual"); setPriority(k); }}>
                {PRI_LABEL[lang][k]}
              </ChipToggle>
            ))}
          </div>
        </Field>

        <div className="mt-8 pt-6" style={{ borderTop: `1px solid ${th.border}` }}>
          <Field label={tx("Fecha de entrega", "Due date")}>
            <TextInput type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </Field>
        </div>

        <Field label={tx("¿En cuántos días quieres hacer este trabajo?", "How many days do you want to work on this?")}>
          {!dueDate ? (
            <p className="text-xs" style={{ color: th.textMuted }}>{tx("Selecciona primero la fecha de entrega.", "Select the due date first.")}</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-3">
                {Array.from({ length: maxDays }, (_, i) => i + 1).map((n) => (
                  <ChipToggle key={n} active={spreadDays === n} onClick={() => setSpreadDays(n)}>{n} {n === 1 ? tx("día", "day") : tx("días", "days")}</ChipToggle>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <ChipToggle active={spreadMode === "auto"} onClick={() => setSpreadMode("auto")}><Wand2 size={13} className="inline mr-1" />{tx("TASKUP! calcula el tiempo por día", "TASKUP! calculates time per day")}</ChipToggle>
                <ChipToggle active={spreadMode === "manual"} onClick={() => setSpreadMode("manual")}>{tx("Yo elijo el tiempo por día", "I choose the time per day")}</ChipToggle>
              </div>
              {spreadMode === "manual" ? (
                <div className="flex flex-col gap-2">
                  {spreadDateList.map((dISO, idx) => (
                    <div key={dISO} className="flex items-center gap-2">
                      <span className="text-xs w-28 shrink-0" style={{ color: th.textMuted }}>{fmtDate(dISO, lang)}</span>
                      <TextInput type="number" min="0" step="5" style={{ width: 100 }} value={spreadManualMinutes[idx] ?? ""} onChange={(e) => {
                        const v = [...spreadManualMinutes]; v[idx] = e.target.value; setSpreadManualMinutes(v);
                      }} />
                      <span className="text-xs" style={{ color: th.textMuted }}>{tx("min", "min")}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs" style={{ color: th.textMuted }}>
                  {tx(`TASKUP! repartirá el trabajo entre ${spreadDays} día(s), lo más parejo posible, evitando dejarlo todo para el último día.`, `TASKUP! will split the work across ${spreadDays} day(s), as evenly as possible, avoiding leaving it all for the last day.`)}
                </p>
              )}
            </>
          )}
        </Field>

        {spreadMode !== "manual" && (
          <Field label={tx("Duración estimada (por día se calculará según lo elegido arriba)", "Estimated duration (split per day above)")}>
            <div className="flex flex-wrap gap-2 mb-2">
              <ChipToggle active={durMode === "auto"} onClick={() => setDurMode("auto")}><Wand2 size={13} className="inline mr-1" />{tx("TASKUP! la calcula", "TASKUP! calculates it")}</ChipToggle>
              <ChipToggle active={durMode === "unsure"} onClick={() => setDurMode("unsure")}>{tx("No estoy seguro/a", "Not sure")}</ChipToggle>
              <ChipToggle active={durMode === "manual"} onClick={() => setDurMode("manual")}>{tx("Personalizado", "Custom")}</ChipToggle>
            </div>
            {durMode === "manual" && (
              <div className="flex items-center gap-2">
                <div style={{ width: 90 }}>
                  <TextInput type="number" min="0" step="1" value={customH} onChange={(e) => setCustomH(e.target.value)} placeholder={tx("Horas", "Hours")} />
                </div>
                <span className="text-xs" style={{ color: th.textMuted }}>{tx("h", "h")}</span>
                <div style={{ width: 90 }}>
                  <TextInput type="number" min="0" max="59" step="5" value={customM} onChange={(e) => setCustomM(e.target.value)} placeholder={tx("Min", "Min")} />
                </div>
                <span className="text-xs" style={{ color: th.textMuted }}>{tx("min", "min")}</span>
              </div>
            )}
            {durMode !== "manual" && (
              <p className="text-xs" style={{ color: th.textMuted }}>
                {durMode === "unsure"
                  ? tx(`TASKUP! calculará el tiempo por ti. Estimado inicial: ${fmtHours(estimateDuration(type, difficulty))}.`, `TASKUP! will calculate the time for you. Initial estimate: ${fmtHours(estimateDuration(type, difficulty))}.`)
                  : tx(`Estimado: ${fmtHours(estimateDuration(type, difficulty))}. Podrás ajustarlo luego si hace falta.`, `Estimate: ${fmtHours(estimateDuration(type, difficulty))}. You can adjust it later if needed.`)}
              </p>
            )}
          </Field>
        )}

        {err && <p className="text-xs font-semibold mb-3" style={{ color: "#C53030" }}>{err}</p>}

        <div className="flex gap-3 mt-2">
          <Btn variant="ghost" onClick={onClose} className="flex-1">{tx("Cancelar", "Cancel")}</Btn>
          <Btn onClick={submit} className="flex-1">{isEdit ? tx("Guardar cambios", "Save changes") : tx("Agregar y organizar", "Add and organize")}</Btn>
        </div>
      </div>
    </Modal>
  );
}

/* ============================================================
   HORARIOS: bloque semanal / diario
============================================================ */
function weekDatesFrom(anchor) {
  const monday = addDays(anchor, -((anchor.getDay() + 6) % 7));
  return DAY_KEYS.map((_, i) => addDays(monday, i));
}

function DayColumnEvents({ dateISO, data, lang }) {
  const dk = dayKeyFromDate(parseISO(dateISO));
  const events = [];
  (data.fixedBlocks || []).forEach((b) => { if (b.days.includes(dk)) events.push({ start: b.start, end: b.end, title: b.title, color: COLORS[b.category] }); });
  const sl = data.sleep[dk];
  if (sl && sl.sleep) events.push({ start: sl.sleep, end: "23:59", title: lang === "es" ? "Sueño" : "Sleep", color: COLORS.sueno });
  const prevSl = data.sleep[dayKeyFromDate(addDays(parseISO(dateISO), -1))];
  if (prevSl && prevSl.wake) events.push({ start: "00:00", end: prevSl.wake, title: lang === "es" ? "Sueño" : "Sleep", color: COLORS.sueno });

  (data.events[dateISO] || []).forEach((ev) => events.push({ start: ev.start, end: ev.end, title: ev.title, color: ev.color }));

  if (data.shabbat.enabled) {
    if (dk === data.shabbat.startDay) events.push({ start: data.shabbat.startTime, end: "23:59", title: "Shabbat", color: COLORS.shabbat });
    if (dk === data.shabbat.endDay) events.push({ start: "00:00", end: data.shabbat.endTime, title: "Shabbat", color: COLORS.shabbat });
  }

  const baseOcc = occupiedBaseForDate(data, dateISO);
  const personalIntervals = personalPlacementForDate(data, dateISO, baseOcc);
  personalIntervals.forEach(([s, e]) => events.push({ start: minToTime(s), end: minToTime(e), title: lang === "es" ? "Tiempo personal" : "Personal time", color: COLORS.personal }));

  (data.tasks || []).forEach((t) => {
    if (t.completed) return;
    (t.sessions || []).forEach((s) => { if (s.date === dateISO) events.push({ start: s.start, end: s.end, title: t.name, color: COLORS[t.priority], sessionRef: { taskId: t.id, sessionId: s.id }, pinned: s.pinned }); });
  });
  return events.sort((a, b) => timeToMin(a.start) - timeToMin(b.start));
}

function CatchUpPlanModal({ onClose }) {
  const { data, th, lang, tx } = useApp();
  const tISO = todayISO();
  const overdueTasks = (data.tasks || []).filter((t) => !t.completed && !t.delivered && t.dueDate < tISO)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  return (
    <Modal onClose={onClose} wide>
      <ModalHeader title={tx("Estoy atrasada — plan para ponerte al día", "I'm behind — catch-up plan")} onClose={onClose} icon={AlertTriangle} />
      <div className="p-6">
        {overdueTasks.length === 0 ? (
          <EmptyState icon={CheckCircle2} text={tx("No tienes trabajos atrasados.", "You have no overdue work.")} />
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs" style={{ color: th.textMuted }}>{tx("Este plan usa tu horario real (clases, eventos, sueño y tiempo personal) sin inventar tiempo libre.", "This plan uses your real schedule (classes, events, sleep and personal time) without inventing free time.")}</p>
            {overdueTasks.map((t) => (
              <Card key={t.id} style={{ padding: 14 }}>
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-sm" style={{ color: th.text }}>{t.name}</p>
                  <PriorityPill p={t.priority} lang={lang} />
                </div>
                <p className="text-xs mb-2" style={{ color: th.textMuted }}>{tx("Entrega original", "Original due date")}: {fmtDate(t.dueDate, lang)}</p>
                {(t.sessions || []).length === 0 ? (
                  <p className="text-xs" style={{ color: "#C53030" }}>{tx("No hay tiempo libre suficiente en tu horario para esto todavía.", "There isn't enough free time in your schedule for this yet.")}</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {t.sessions.map((s) => (
                      <span key={s.id} className="text-xs" style={{ color: th.text }}>{fmtDate(s.date, lang)} · {s.start}–{s.end}</span>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

function TaskMiniModal({ task, session, onClose }) {
  const { th, lang, tx } = useApp();
  const [showCatchUp, setShowCatchUp] = useState(false);
  const tISO = todayISO();
  const overdue = task.dueDate < tISO && !task.completed;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: "rgba(10,11,26,0.55)" }} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full rounded-3xl overflow-hidden" style={{ maxWidth: 260, background: th.surface, boxShadow: th.shadow }}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <PriorityPill p={task.priority} lang={lang} />
            <button onClick={onClose}><X size={16} style={{ color: th.textMuted }} /></button>
          </div>
          <h3 className="font-bold text-base mb-1" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>{task.name}</h3>
          <p className="text-xs mb-3" style={{ color: th.textMuted }}>{task.subject || TYPE_LABEL[lang][task.type]}</p>
          <div className="flex flex-col gap-1.5 text-xs" style={{ color: th.text }}>
            <span className="flex items-center gap-1.5"><CalendarDays size={12} />{tx("Entrega", "Due")}: {fmtDate(task.dueDate, lang)}</span>
            {session && <span className="flex items-center gap-1.5"><Clock size={12} />{fmtDate(session.date, lang)} · {session.start}–{session.end}</span>}
            <span className="flex items-center gap-1.5"><ClipboardList size={12} />{tx("Duración total", "Total duration")}: {fmtHours(task.durationMin)}</span>
            {(task.progress || 0) > 0 && <span className="flex items-center gap-1.5"><TrendingUp size={12} />{tx("Progreso", "Progress")}: {task.progress}%</span>}
          </div>
          {overdue && (
            <Btn variant="soft" style={{ padding: "6px 10px", fontSize: 12, marginTop: 12, width: "100%" }} onClick={() => setShowCatchUp(true)}>
              <AlertTriangle size={13} />{tx("Estoy atrasada", "I'm behind")}
            </Btn>
          )}
        </div>
      </div>
      {showCatchUp && <CatchUpPlanModal onClose={() => setShowCatchUp(false)} />}
    </div>
  );
}

function EditWeekdayModal({ dayKey, onClose }) {
  const { data, setData, th, lang, tx, reschedule } = useApp();
  const [sleepT, setSleepT] = useState(data.sleep[dayKey].sleep || "");
  const [wakeT, setWakeT] = useState(data.sleep[dayKey].wake || "");
  const [personalMin, setPersonalMin] = useState(data.personalMinutes[dayKey] || 0);
  const dayBlocks = data.fixedBlocks.filter((b) => b.days.includes(dayKey));
  const [newTitle, setNewTitle] = useState("");
  const [newCat, setNewCat] = useState("clase");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");

  function saveSleep() {
    setData((d) => {
      const sleep = { ...d.sleep, [dayKey]: { sleep: sleepT || null, wake: wakeT || null } };
      const nd = { ...d, sleep };
      return { ...nd, tasks: reschedule(nd) };
    });
  }
  function savePersonal() {
    setData((d) => {
      const personalMinutes = { ...d.personalMinutes, [dayKey]: parseInt(personalMin, 10) || 0 };
      const nd = { ...d, personalMinutes };
      return { ...nd, tasks: reschedule(nd) };
    });
  }
  function addBlock() {
    if (!newTitle.trim() || !newStart || !newEnd || newStart >= newEnd) return;
    setData((d) => {
      const fixedBlocks = [...d.fixedBlocks, { id: uid(), title: newTitle.trim(), category: newCat, days: [dayKey], start: newStart, end: newEnd }];
      const nd = { ...d, fixedBlocks };
      return { ...nd, tasks: reschedule(nd) };
    });
    setNewTitle(""); setNewStart(""); setNewEnd("");
  }
  function updateBlock(id, patch) {
    setData((d) => {
      const fixedBlocks = d.fixedBlocks.map((b) => b.id === id ? { ...b, ...patch } : b);
      const nd = { ...d, fixedBlocks };
      return { ...nd, tasks: reschedule(nd) };
    });
  }
  function removeBlock(b) {
    setData((d) => {
      const nd = { ...d, fixedBlocks: d.fixedBlocks.filter((x) => x.id !== b.id), history: pushHistory(d, { type: "deleted", entityType: "block", title: b.title, snapshot: b }) };
      return { ...nd, tasks: reschedule(nd) };
    });
  }

  return (
    <Modal onClose={onClose} wide>
      <ModalHeader title={`${tx("Editar", "Edit")} · ${DAY_LABEL[lang][dayKey]}`} onClose={onClose} icon={PencilLine} />
      <div className="p-6 flex flex-col gap-6">
        <div>
          <h3 className="font-bold text-sm mb-2" style={{ color: th.text }}>{tx("Sueño", "Sleep")}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <TextInput type="time" value={sleepT} onChange={(e) => setSleepT(e.target.value)} style={{ width: 120 }} />
            <span className="text-xs" style={{ color: th.textMuted }}>{tx("a", "to")}</span>
            <TextInput type="time" value={wakeT} onChange={(e) => setWakeT(e.target.value)} style={{ width: 120 }} />
            <Btn variant="soft" style={{ padding: "6px 10px", fontSize: 12 }} onClick={saveSleep}>{tx("Guardar", "Save")}</Btn>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-sm mb-2" style={{ color: th.text }}>{tx("Tiempo personal (minutos)", "Personal time (minutes)")}</h3>
          <div className="flex items-center gap-2">
            <TextInput type="number" min="0" step="5" value={personalMin} onChange={(e) => setPersonalMin(e.target.value)} style={{ width: 120 }} />
            <Btn variant="soft" style={{ padding: "6px 10px", fontSize: 12 }} onClick={savePersonal}>{tx("Guardar", "Save")}</Btn>
          </div>
          <p className="text-xs mt-1" style={{ color: th.textMuted }}>{tx("TASKUP! decide automáticamente en qué momento del día colocarlo.", "TASKUP! automatically decides when in the day to place it.")}</p>
        </div>
        <div>
          <h3 className="font-bold text-sm mb-2" style={{ color: th.text }}>{tx("Bloques fijos de este día", "Fixed blocks for this day")}</h3>
          <div className="flex flex-col gap-2 mb-3">
            {dayBlocks.map((b) => (
              <div key={b.id} className="flex flex-wrap items-center gap-2 rounded-xl px-3 py-2" style={{ background: th.surfaceAlt }}>
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[b.category] }} />
                <TextInput value={b.title} onChange={(e) => updateBlock(b.id, { title: e.target.value })} style={{ width: 120 }} />
                <TextInput type="time" value={b.start} onChange={(e) => updateBlock(b.id, { start: e.target.value })} style={{ width: 100 }} />
                <TextInput type="time" value={b.end} onChange={(e) => updateBlock(b.id, { end: e.target.value })} style={{ width: 100 }} />
                <button onClick={() => removeBlock(b)}><Trash2 size={14} style={{ color: "#C53030" }} /></button>
              </div>
            ))}
            {dayBlocks.length === 0 && <p className="text-xs" style={{ color: th.textMuted }}>{tx("Sin bloques.", "No blocks.")}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <TextInput placeholder={tx("Nombre", "Name")} value={newTitle} onChange={(e) => setNewTitle(e.target.value)} style={{ width: 120 }} />
            <Select value={newCat} onChange={(e) => setNewCat(e.target.value)} style={{ width: 120 }}>
              {BLOCK_CAT_KEYS.map((c) => <option key={c} value={c}>{BLOCK_CAT_LABEL[lang][c]}</option>)}
            </Select>
            <TextInput type="time" value={newStart} onChange={(e) => setNewStart(e.target.value)} style={{ width: 100 }} />
            <TextInput type="time" value={newEnd} onChange={(e) => setNewEnd(e.target.value)} style={{ width: 100 }} />
            <Btn variant="soft" style={{ padding: "6px 10px", fontSize: 12 }} onClick={addBlock}><Plus size={13} />{tx("Agregar", "Add")}</Btn>
          </div>
        </div>
        <Btn onClick={onClose}>{tx("Listo", "Done")}</Btn>
      </div>
    </Modal>
  );
}

/* ============================================================
   ASISTENTE AI — chat + pregunta rápida, usando datos reales
============================================================ */
function buildContextSummary(data, lang) {
  const tISO = todayISO();
  const lines = [`${tx2(lang, "Hoy es", "Today is")} ${fmtDate(tISO, lang)} (${tISO}).`];
  const pending = (data.tasks || []).filter((t) => !t.completed && !t.delivered);
  if (pending.length === 0) lines.push(tx2(lang, "No hay trabajos pendientes.", "No pending work."));
  pending.forEach((t) => {
    const sess = (t.sessions || []).map((s) => `${s.date} ${s.start}-${s.end}`).join("; ") || tx2(lang, "sin sesiones asignadas", "no sessions assigned");
    lines.push(`Trabajo/Task "${t.name}" (${t.subject || t.type}), prioridad/priority ${t.priority}, progreso/progress ${t.progress || 0}%, entrega/due ${t.dueDate}, duración/duration total ${t.durationMin} min, sesiones/sessions: ${sess}.`);
  });
  (data.exams || []).forEach((ex) => lines.push(`Examen/Exam "${ex.title}": ${ex.date}.`));
  Object.entries(data.events || {}).forEach(([dISO, evs]) => evs.forEach((ev) => lines.push(`Evento/Event "${ev.title}" ${dISO} ${ev.start}-${ev.end}.`)));
  DAY_KEYS.forEach((dk) => {
    const s = data.sleep[dk];
    if (s.sleep || s.wake) lines.push(`Sueño/Sleep ${DAY_LABEL[lang][dk]}: ${s.sleep || "?"} - ${s.wake || "?"}.`);
    const pm = data.personalMinutes[dk] || 0;
    if (pm > 0) lines.push(`Tiempo personal/Personal time ${DAY_LABEL[lang][dk]}: ${pm} min.`);
  });
  (data.fixedBlocks || []).forEach((b) => lines.push(`Bloque/Block "${b.title}" (${b.category}) ${b.days.join(",")} ${b.start}-${b.end}.`));
  return lines.join("\n");
}
function tx2(lang, es, en) { return lang === "en" ? en : es; }

const QUICK_QUESTIONS_ES = ["¿Tengo tiempo para hacer esto hoy?", "¿Qué debería estudiar primero?", "¿Cuándo puedo hacer esta tarea?"];
const QUICK_QUESTIONS_EN = ["Do I have time to do this today?", "What should I study first?", "When can I do this task?"];

function AIAssistantModal({ onClose }) {
  const { data, th, lang, tx } = useApp();
  const [messages, setMessages] = useState([{ role: "assistant", content: tx("¡Hola! Soy el asistente de TASKUP!. Puedes preguntarme lo que quieras — sobre tu horario, tus tareas y exámenes, o cualquier otra cosa.", "Hi! I'm the TASKUP! assistant. Ask me anything — about your schedule, tasks and exams, or anything else.") }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }); }, [messages, loading]);

  async function send(text) {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    const newMsgs = [...messages, { role: "user", content: q }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    try {
      const context = buildContextSummary(data, lang);
      // El primer mensaje es el saludo de la app; la conversación que va a la IA empieza con el usuario.
      const apiMessages = newMsgs.slice(1).map((m) => ({ role: m.role, content: m.content }));
      const dataRes = await pedirIA("/daniela/api/asistente", { lang, contexto: context, mensajes: apiMessages });
      const text2 = dataRes.texto?.trim() || tx("No pude responder eso.", "I couldn't answer that.");
      setMessages((m) => [...m, { role: "assistant", content: text2 }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: tx("Hubo un problema al conectarme. Intenta de nuevo.", "There was a problem connecting. Please try again.") }]);
    }
    setLoading(false);
  }

  const quick = lang === "es" ? QUICK_QUESTIONS_ES : QUICK_QUESTIONS_EN;

  return (
    <Modal onClose={onClose} wide>
      <ModalHeader title={tx("Asistente TASKUP!", "TASKUP! Assistant")} onClose={onClose} icon={Sparkles} />
      <div className="flex flex-col" style={{ height: "70vh" }}>
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
          {messages.map((m, i) => (
            <div key={i} className={"max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm " + (m.role === "user" ? "self-end" : "self-start")}
              style={m.role === "user" ? { background: th.primary, color: th.primaryText } : { background: th.surfaceAlt, color: th.text }}>
              {m.content}
            </div>
          ))}
          {loading && <div className="self-start text-xs" style={{ color: th.textMuted }}>{tx("Pensando...", "Thinking...")}</div>}
        </div>
        <div className="px-6 pb-2 flex flex-wrap gap-1.5">
          {quick.map((q) => (
            <button key={q} onClick={() => send(q)} className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: th.primarySoft, color: th.primary }}>{q}</button>
          ))}
        </div>
        <div className="px-6 pb-6 pt-2 flex items-center gap-2" style={{ borderTop: `1px solid ${th.border}` }}>
          <TextInput value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder={tx("Escríbele a TASKUP!...", "Message TASKUP!...")} />
          <Btn onClick={() => send()} disabled={loading}><ArrowRight size={16} /></Btn>
        </div>
      </div>
    </Modal>
  );
}

function FloatingAI({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-xl active:scale-95 transition"
      style={{ background: "#5B5FEF", color: "#fff", boxShadow: "0 10px 24px -6px rgba(91,95,239,0.55)" }}
      title="Asistente AI"
    >
      <Sparkles size={24} />
    </button>
  );
}

/* ============================================================
   AYÚDAME A ESTUDIAR — flashcards + quiz generados por AI
============================================================ */
function StudyHelperModal({ task, onClose }) {
  const { th, lang, tx } = useApp();
  const [step, setStep] = useState("input");
  const [mode, setMode] = useState("texto");
  const [text, setText] = useState("");
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(null);

  function handleImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageData(reader.result);
    reader.readAsDataURL(file);
  }

  async function generate() {
    if (mode === "texto" && !text.trim()) return setErr(tx("Pega o escribe la información a estudiar.", "Paste or type the material to study."));
    if (mode === "imagen" && !imageData) return setErr(tx("Sube una imagen.", "Upload an image."));
    setErr(""); setLoading(true);
    try {
      const parsed = await pedirIA("/daniela/api/estudiar", {
        lang, tarea: task.name,
        texto: mode === "texto" ? text : undefined,
        imagen: mode === "imagen" ? imageData : undefined,
      });
      setFlashcards(parsed.flashcards || []);
      setQuiz(parsed.quiz || []);
      setCardIdx(0); setFlipped(false);
      setStep("flashcards");
    } catch (e) {
      setErr(tx("No se pudo generar el material. Intenta de nuevo.", "Couldn't generate the material. Please try again."));
    }
    setLoading(false);
  }

  function answerQuiz(idx) {
    if (answered !== null) return;
    setAnswered(idx);
    if (idx === quiz[quizIdx].correctIndex) setScore((s) => s + 1);
  }
  function nextQuiz() {
    setAnswered(null);
    if (quizIdx + 1 < quiz.length) setQuizIdx((i) => i + 1);
    else setStep("results");
  }

  return (
    <Modal onClose={onClose} wide>
      <ModalHeader title={tx("Ayúdame a estudiar", "Help me study")} onClose={onClose} icon={BookOpen} />
      <div className="p-6">
        {step === "input" && (
          <>
            <p className="text-sm mb-4" style={{ color: th.textMuted }}>{tx(`Material para "${task.name}"`, `Material for "${task.name}"`)}</p>
            <div className="flex gap-2 mb-4">
              <ChipToggle active={mode === "texto"} onClick={() => setMode("texto")}>{tx("Texto", "Text")}</ChipToggle>
              <ChipToggle active={mode === "imagen"} onClick={() => setMode("imagen")}>{tx("Imagen", "Image")}</ChipToggle>
            </div>
            {mode === "texto" ? (
              <TextArea rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder={tx("Pega tus apuntes o la información a estudiar...", "Paste your notes or the material to study...")} />
            ) : (
              <div>
                <input type="file" accept="image/*" onChange={handleImage} />
                {imageData && <img src={imageData} alt="preview" className="mt-3 rounded-xl max-h-48 object-contain" />}
              </div>
            )}
            {err && <p className="text-xs font-semibold mt-3" style={{ color: "#C53030" }}>{err}</p>}
            <div className="flex gap-3 mt-5">
              <Btn variant="ghost" onClick={onClose} className="flex-1">{tx("Cancelar", "Cancel")}</Btn>
              <Btn onClick={generate} disabled={loading} className="flex-1">{loading ? <Loader2 className="animate-spin" size={16} /> : <><Wand2 size={16} />{tx("Crear material", "Create material")}</>}</Btn>
            </div>
          </>
        )}

        {step === "flashcards" && flashcards.length > 0 && (
          <>
            <p className="text-xs mb-2" style={{ color: th.textMuted }}>{tx(`Flashcard ${cardIdx + 1} de ${flashcards.length}`, `Flashcard ${cardIdx + 1} of ${flashcards.length}`)}</p>
            <button onClick={() => setFlipped((f) => !f)} className="w-full rounded-2xl p-8 text-center mb-4" style={{ background: th.primarySoft, minHeight: 160 }}>
              <p className="text-base font-semibold" style={{ color: th.text }}>{flipped ? flashcards[cardIdx].back : flashcards[cardIdx].front}</p>
              <p className="text-xs mt-3" style={{ color: th.textMuted }}>{tx("(toca para voltear)", "(tap to flip)")}</p>
            </button>
            <div className="flex justify-between gap-2">
              <Btn variant="ghost" disabled={cardIdx === 0} onClick={() => { setCardIdx((i) => i - 1); setFlipped(false); }}><ChevronLeft size={15} /></Btn>
              {cardIdx + 1 < flashcards.length ? (
                <Btn onClick={() => { setCardIdx((i) => i + 1); setFlipped(false); }} className="flex-1">{tx("Siguiente", "Next")}<ChevronRight size={15} /></Btn>
              ) : (
                <Btn onClick={() => setStep("quiz")} className="flex-1">{tx("Ir al quiz", "Go to quiz")}<ArrowRight size={15} /></Btn>
              )}
            </div>
          </>
        )}

        {step === "quiz" && quiz.length > 0 && (
          <>
            <p className="text-xs mb-2" style={{ color: th.textMuted }}>{tx(`Pregunta ${quizIdx + 1} de ${quiz.length}`, `Question ${quizIdx + 1} of ${quiz.length}`)}</p>
            <p className="font-semibold text-sm mb-3" style={{ color: th.text }}>{quiz[quizIdx].question}</p>
            <div className="flex flex-col gap-2 mb-4">
              {quiz[quizIdx].options.map((opt, idx) => {
                const isCorrect = idx === quiz[quizIdx].correctIndex;
                const isPicked = answered === idx;
                let optStyle = { background: th.surfaceAlt, color: th.text };
                if (answered !== null && isCorrect) optStyle = { background: "#E8F8EE", color: "#276749" };
                else if (isPicked) optStyle = { background: "#FDECEC", color: "#C53030" };
                return (
                  <button key={idx} onClick={() => answerQuiz(idx)} className="text-left text-sm rounded-xl px-3.5 py-2.5" style={optStyle}>{opt}</button>
                );
              })}
            </div>
            <Btn onClick={nextQuiz} disabled={answered === null} className="w-full">{quizIdx + 1 < quiz.length ? tx("Siguiente", "Next") : tx("Ver resultados", "See results")}</Btn>
          </>
        )}

        {step === "results" && (
          <>
            <div className="text-center py-6">
              <p className="text-3xl font-extrabold mb-1" style={{ color: th.primary, fontFamily: "'Space Grotesk', sans-serif" }}>{score}/{quiz.length}</p>
              <p className="text-sm" style={{ color: th.textMuted }}>{tx("respuestas correctas", "correct answers")}</p>
            </div>
            <div className="flex gap-3">
              <Btn variant="ghost" onClick={() => { setStep("flashcards"); setCardIdx(0); setFlipped(false); setQuizIdx(0); setScore(0); setAnswered(null); }} className="flex-1">{tx("Volver a estudiar", "Study again")}</Btn>
              <Btn onClick={onClose} className="flex-1">{tx("Cerrar", "Close")}</Btn>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

function WeekGrid() {
  const { data, th, lang, tx, setData, reschedule } = useApp();
  const [anchor, setAnchor] = useState(panamaNow());
  const dates = weekDatesFrom(anchor);
  const [moving, setMoving] = useState(null);
  const [editDay, setEditDay] = useState(null);
  const [miniRef, setMiniRef] = useState(null);

  function onMoveSession(ref, dateISO, start, end) {
    setData((d) => {
      const tasks = d.tasks.map((t) => {
        if (t.id !== ref.taskId) return t;
        const sessions = t.sessions.map((s) => s.id === ref.sessionId ? { ...s, date: dateISO, day: dayKeyFromDate(parseISO(dateISO)), start, end, pinned: true } : s);
        return { ...t, sessions };
      });
      const nd = { ...d, tasks };
      return { ...nd, tasks: reschedule(nd) };
    });
  }

  const miniTask = miniRef ? data.tasks.find((t) => t.id === miniRef.taskId) : null;
  const miniSession = miniTask ? miniTask.sessions.find((s) => s.id === miniRef.sessionId) : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <IconBtn onClick={() => setAnchor((a) => addDays(a, -7))}><ChevronLeft size={16} /></IconBtn>
        <p className="text-sm font-semibold" style={{ color: th.text }}>
          {fmtDate(toISO(dates[0]), lang)} – {fmtDate(toISO(dates[6]), lang)}
        </p>
        <IconBtn onClick={() => setAnchor((a) => addDays(a, 7))}><ChevronRight size={16} /></IconBtn>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {dates.map((d) => {
          const dISO = toISO(d);
          const dk = dayKeyFromDate(d);
          const events = DayColumnEvents({ dateISO: dISO, data, lang });
          const isToday = dISO === todayISO();
          return (
            <div key={dISO} className="rounded-2xl p-3" style={{ background: th.surface, border: `1px solid ${isToday ? th.primary : th.border}` }}>
              <p className="text-xs font-bold mb-2" style={{ color: isToday ? th.primary : th.textMuted }}>{DAY_SHORT[lang][dk]} {d.getDate()}</p>
              {events.length === 0 && <p className="text-xs" style={{ color: th.textMuted }}>—</p>}
              <div className="flex flex-col gap-1.5">
                {events.map((e, idx) => (
                  <div key={idx} className="rounded-lg px-2 py-1.5 text-[11px] leading-tight relative group" style={{ background: e.color + "22", borderLeft: `3px solid ${e.color}` }}>
                    <p className="font-semibold truncate cursor-pointer" style={{ color: th.text }} onClick={() => e.sessionRef && setMiniRef(e.sessionRef)}>{e.title}</p>
                    <p style={{ color: th.textMuted }}>{e.start}–{e.end}</p>
                    {e.sessionRef && (
                      <button onClick={() => setMoving({ dISO, ...e })} className="absolute top-1 right-1 opacity-60 hover:opacity-100" title={tx("Mover", "Move")}>
                        <GripVertical size={11} style={{ color: th.textMuted }} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => setEditDay(dk)} className="text-xs font-semibold mt-2 flex items-center gap-1" style={{ color: th.primary }}>
                <PencilLine size={12} />{tx("Editar", "Edit")}
              </button>
            </div>
          );
        })}
      </div>

      {moving && (
        <MoveSessionModal
          info={moving}
          onClose={() => setMoving(null)}
          onSave={(newDate, newStart, newEnd) => { onMoveSession(moving.sessionRef, newDate, newStart, newEnd); setMoving(null); }}
        />
      )}
      {editDay && <EditWeekdayModal dayKey={editDay} onClose={() => setEditDay(null)} />}
      {miniTask && <TaskMiniModal task={miniTask} session={miniSession} onClose={() => setMiniRef(null)} />}
    </div>
  );
}

function DayDetailModal({ dateISO, onClose, onOpenTask }) {
  const { data, setData, th, lang, tx, reschedule } = useApp();
  const [evTitle, setEvTitle] = useState("");
  const [evStart, setEvStart] = useState("");
  const [evEnd, setEvEnd] = useState("");
  const [exTitle, setExTitle] = useState("");
  const [err, setErr] = useState("");

  const events = data.events[dateISO] || [];
  const exams = (data.exams || []).filter((e) => e.date === dateISO);
  const tasksToday = tasksForDate(data, dateISO);

  function addEvent() {
    if (!evTitle.trim()) return setErr(tx("Escribe un nombre para el evento.", "Enter a name for the event."));
    if (!evStart || !evEnd || evStart >= evEnd) return setErr(tx("Selecciona un horario válido.", "Select a valid time range."));
    setErr("");
    const color = EVENT_COLORS[events.length % EVENT_COLORS.length];
    setData((d) => {
      const history = pushHistory(d, { type: "schedule_changed", entityType: "schedule", title: tx(`Evento "${evTitle.trim()}"`, `Event "${evTitle.trim()}"`), snapshot: scheduleSnapshot(d) });
      const dayEvents = [...(d.events[dateISO] || []), { id: uid(), title: evTitle.trim(), start: evStart, end: evEnd, color }];
      const nd = { ...d, events: { ...d.events, [dateISO]: dayEvents }, history };
      return { ...nd, tasks: reschedule(nd) };
    });
    setEvTitle(""); setEvStart(""); setEvEnd("");
  }
  function removeEvent(id) {
    setData((d) => {
      const dayEvents = (d.events[dateISO] || []).filter((e) => e.id !== id);
      const nd = { ...d, events: { ...d.events, [dateISO]: dayEvents } };
      return { ...nd, tasks: reschedule(nd) };
    });
  }
  function addExam() {
    if (!exTitle.trim()) return setErr(tx("Escribe un nombre para el examen.", "Enter a name for the exam."));
    setErr("");
    setData((d) => ({ ...d, exams: [...(d.exams || []), { id: uid(), title: exTitle.trim(), date: dateISO }] }));
    setExTitle("");
  }
  function removeExam(id) {
    setData((d) => ({ ...d, exams: (d.exams || []).filter((e) => e.id !== id) }));
  }

  return (
    <Modal onClose={onClose} wide>
      <ModalHeader title={fmtDate(dateISO, lang)} onClose={onClose} icon={CalendarClock} />
      <div className="p-6 flex flex-col gap-6">
        <div>
          <h3 className="font-bold text-sm mb-2" style={{ color: th.text }}>{tx("Trabajos programados", "Scheduled work")}</h3>
          {tasksToday.length === 0 ? (
            <p className="text-xs" style={{ color: th.textMuted }}>{tx("No hay trabajos este día.", "No work scheduled this day.")}</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {tasksToday.map(({ task, session }) => (
                <button key={session.id} onClick={() => onOpenTask(task, session)} className="text-left text-sm rounded-xl px-3 py-2" style={{ background: th.surfaceAlt, color: th.text }}>
                  <span className="font-semibold">{task.name}</span> · {session.start}–{session.end}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-bold text-sm mb-2" style={{ color: th.text }}>{tx("Eventos de este día", "Events this day")}</h3>
          <div className="flex flex-col gap-1.5 mb-3">
            {events.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: e.color + "22" }}>
                <span className="text-sm flex items-center" style={{ color: th.text }}>
                  <span className="w-2 h-2 rounded-full inline-block mr-2" style={{ background: e.color }} />{e.title} · {e.start}–{e.end}
                </span>
                <button onClick={() => removeEvent(e.id)}><X size={14} style={{ color: th.textMuted }} /></button>
              </div>
            ))}
            {events.length === 0 && <p className="text-xs" style={{ color: th.textMuted }}>{tx("Sin eventos.", "No events.")}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <TextInput placeholder={tx("Nombre del evento", "Event name")} value={evTitle} onChange={(e) => setEvTitle(e.target.value)} style={{ width: 160 }} />
            <TextInput type="time" value={evStart} onChange={(e) => setEvStart(e.target.value)} style={{ width: 110 }} />
            <TextInput type="time" value={evEnd} onChange={(e) => setEvEnd(e.target.value)} style={{ width: 110 }} />
            <Btn variant="soft" style={{ padding: "8px 12px", fontSize: 12 }} onClick={addEvent}><Plus size={13} />{tx("Agregar", "Add")}</Btn>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-sm mb-2" style={{ color: th.text }}>{tx("Exámenes", "Exams")}</h3>
          <div className="flex flex-col gap-1.5 mb-3">
            {exams.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "#FDECEC" }}>
                <span className="text-sm" style={{ color: "#C53030" }}>{e.title}</span>
                <button onClick={() => removeExam(e.id)}><X size={14} style={{ color: "#C53030" }} /></button>
              </div>
            ))}
            {exams.length === 0 && <p className="text-xs" style={{ color: th.textMuted }}>{tx("Sin exámenes.", "No exams.")}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <TextInput placeholder={tx("Nombre del examen", "Exam name")} value={exTitle} onChange={(e) => setExTitle(e.target.value)} style={{ width: 200 }} />
            <Btn variant="soft" style={{ padding: "8px 12px", fontSize: 12 }} onClick={addExam}><Plus size={13} />{tx("Agregar", "Add")}</Btn>
          </div>
          <p className="text-xs mt-2" style={{ color: th.textMuted }}>{tx("TASKUP! te avisará un día antes del examen.", "TASKUP! will remind you one day before the exam.")}</p>
        </div>

        {err && <p className="text-xs font-semibold" style={{ color: "#C53030" }}>{err}</p>}
      </div>
    </Modal>
  );
}

function MonthGrid() {
  const { data, th, lang, tx } = useApp();
  const [anchor, setAnchor] = useState(panamaNow());
  const [dayModal, setDayModal] = useState(null);
  const [miniTask, setMiniTask] = useState(null);
  const year = anchor.getFullYear(), month = anchor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const tISO = todayISO();

  const monthNames = lang === "es"
    ? ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <IconBtn onClick={() => setAnchor((a) => { const n = new Date(a); n.setMonth(n.getMonth() - 1); return n; })}><ChevronLeft size={16} /></IconBtn>
        <p className="text-sm font-semibold" style={{ color: th.text }}>{monthNames[month]} {year}</p>
        <IconBtn onClick={() => setAnchor((a) => { const n = new Date(a); n.setMonth(n.getMonth() + 1); return n; })}><ChevronRight size={16} /></IconBtn>
      </div>
      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {DAY_KEYS.map((d) => <div key={d} className="text-center text-[11px] font-bold" style={{ color: th.textMuted }}>{DAY_SHORT[lang][d]}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const dISO = toISO(new Date(year, month, d));
          const isPast = dISO < tISO;
          const isToday = dISO === tISO;
          const tasksToday = tasksForDate(data, dISO);
          const examsToday = (data.exams || []).filter((e) => e.date === dISO);
          return (
            <button key={i} onClick={() => setDayModal(dISO)} className="text-left rounded-xl p-1.5 flex flex-col relative"
              style={{ minHeight: 66, background: isToday ? th.primarySoft : th.surface, border: `1px solid ${isToday ? th.primary : th.border}` }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold" style={{ color: isToday ? th.primary : th.text }}>{d}</span>
                {isPast && <Check size={11} style={{ color: "#27AE60" }} />}
              </div>
              <div className="flex flex-col gap-0.5 mt-1 overflow-hidden">
                {tasksToday.slice(0, 3).map(({ task, session }) => (
                  <span key={session.id} onClick={(e) => { e.stopPropagation(); setMiniTask({ task, session }); }} className="text-[9px] truncate rounded px-1 py-0.5"
                    style={{ background: COLORS[task.priority] + "22", color: th.text }}>{task.name}</span>
                ))}
                {examsToday.slice(0, 2).map((ex) => (
                  <span key={ex.id} className="text-[9px] truncate rounded px-1 py-0.5" style={{ background: "#FDECEC", color: "#C53030" }}>📕 {ex.title}</span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-xs mt-4" style={{ color: th.textMuted }}>{tx("Toca un día para agregar eventos o exámenes. Toca un trabajo para ver su información.", "Tap a day to add events or exams. Tap a task to see its info.")}</p>

      {dayModal && <DayDetailModal dateISO={dayModal} onClose={() => setDayModal(null)} onOpenTask={(task, session) => setMiniTask({ task, session })} />}
      {miniTask && <TaskMiniModal task={miniTask.task} session={miniTask.session} onClose={() => setMiniTask(null)} />}
    </div>
  );
}

function MoveSessionModal({ info, onClose, onSave }) {
  const { th, lang, tx } = useApp();
  const [date, setDate] = useState(info.dISO);
  const [start, setStart] = useState(info.start);
  const [end, setEnd] = useState(info.end);
  return (
    <Modal onClose={onClose}>
      <ModalHeader title={tx("Mover sesión", "Move session")} onClose={onClose} icon={GripVertical} />
      <div className="p-6">
        <p className="text-sm mb-4" style={{ color: th.textMuted }}>{info.title}</p>
        <Field label={tx("Fecha", "Date")}><TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label={tx("Inicio", "Start")}><TextInput type="time" value={start} onChange={(e) => setStart(e.target.value)} /></Field>
          <Field label={tx("Fin", "End")}><TextInput type="time" value={end} onChange={(e) => setEnd(e.target.value)} /></Field>
        </div>
        <div className="flex gap-3 mt-2">
          <Btn variant="ghost" onClick={onClose} className="flex-1">{tx("Cancelar", "Cancel")}</Btn>
          <Btn onClick={() => onSave(date, start, end)} className="flex-1">{tx("Guardar", "Save")}</Btn>
        </div>
      </div>
    </Modal>
  );
}

/* ============================================================
   AGREGAR HORARIO: MANUAL (bloques fijos recurrentes)
============================================================ */
function AddBlockForm({ onDone, focusDay, editBlockId, onEditHandled }) {
  const { data, setData, th, lang, tx, reschedule } = useApp();
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("clase");
  const [days, setDays] = useState(focusDay ? [focusDay] : []);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (editBlockId) {
      const b = data.fixedBlocks.find((x) => x.id === editBlockId);
      if (b) {
        setEditingId(b.id); setTitle(b.title); setCategory(b.category); setDays(b.days); setStart(b.start); setEnd(b.end);
      }
      onEditHandled && onEditHandled();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editBlockId]);

  function toggleDay(d) { setDays((ds) => ds.includes(d) ? ds.filter((x) => x !== d) : [...ds, d]); }

  function resetForm() {
    setEditingId(null); setTitle(""); setCategory("clase"); setDays([]); setStart(""); setEnd("");
  }

  function startEdit(b) {
    setEditingId(b.id); setTitle(b.title); setCategory(b.category); setDays(b.days); setStart(b.start); setEnd(b.end);
  }

  function save() {
    if (!title.trim()) return setErr(tx("Escribe un nombre.", "Enter a name."));
    if (days.length === 0) return setErr(tx("Selecciona al menos un día.", "Select at least one day."));
    if (!start || !end || start >= end) return setErr(tx("Selecciona un horario válido.", "Select a valid time range."));
    setErr("");
    setData((d) => {
      const history = pushHistory(d, { type: "schedule_changed", entityType: "schedule", title: tx(`Bloque "${title.trim()}"`, `Block "${title.trim()}"`), snapshot: scheduleSnapshot(d) });
      let fixedBlocks;
      if (editingId) {
        fixedBlocks = d.fixedBlocks.map((b) => b.id === editingId ? { ...b, title: title.trim(), category, days, start, end } : b);
      } else {
        fixedBlocks = [...d.fixedBlocks, { id: uid(), title: title.trim(), category, days, start, end }];
      }
      const nd = { ...d, fixedBlocks, history };
      return { ...nd, tasks: reschedule(nd) };
    });
    resetForm();
    onDone && onDone();
  }

  function removeBlock(b) {
    setData((d) => {
      const nd = { ...d, fixedBlocks: d.fixedBlocks.filter((x) => x.id !== b.id), history: pushHistory(d, { type: "deleted", entityType: "block", title: b.title, snapshot: b }) };
      return { ...nd, tasks: reschedule(nd) };
    });
    if (editingId === b.id) resetForm();
  }

  return (
    <Card>
      <h3 className="font-bold mb-4" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>
        {editingId ? tx("Editar bloque de horario", "Edit schedule block") : tx("Agregar manualmente", "Add manually")}
      </h3>
      <Field label={tx("Nombre", "Name")}>
        <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder={tx("Ej. Matemáticas", "E.g. Math")} />
      </Field>
      <Field label={tx("Categoría", "Category")}>
        <div className="flex gap-2">
          {BLOCK_CAT_KEYS.map((c) => <ChipToggle key={c} active={category === c} activeColor={COLORS[c]} onClick={() => setCategory(c)}>{BLOCK_CAT_LABEL[lang][c]}</ChipToggle>)}
        </div>
      </Field>
      <Field label={tx("Días", "Days")}>
        <div className="flex flex-wrap gap-2">
          {DAY_KEYS.map((d) => <ChipToggle key={d} active={days.includes(d)} onClick={() => toggleDay(d)}>{DAY_SHORT[lang][d]}</ChipToggle>)}
        </div>
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label={tx("Inicio", "Start")}><TextInput type="time" value={start} onChange={(e) => setStart(e.target.value)} /></Field>
        <Field label={tx("Fin", "End")}><TextInput type="time" value={end} onChange={(e) => setEnd(e.target.value)} /></Field>
      </div>
      {err && <p className="text-xs font-semibold mb-3" style={{ color: "#C53030" }}>{err}</p>}
      <div className="flex gap-2">
        <Btn onClick={save} className="flex-1">{editingId ? <><Check size={16} />{tx("Guardar cambios", "Save changes")}</> : <><Plus size={16} />{tx("Agregar al horario", "Add to schedule")}</>}</Btn>
        {editingId && <Btn variant="ghost" onClick={resetForm}>{tx("Cancelar", "Cancel")}</Btn>}
      </div>

      {data.fixedBlocks.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: th.textMuted }}>{tx("Ya agregado", "Already added")}</p>
          <div className="flex flex-col gap-2">
            {data.fixedBlocks.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: th.surfaceAlt }}>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[b.category] }} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: th.text }}>{b.title}</p>
                    <p className="text-xs truncate" style={{ color: th.textMuted }}>{b.days.map((d) => DAY_SHORT[lang][d]).join(", ")} · {b.start}–{b.end}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => startEdit(b)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ color: th.primary }} title={tx("Editar", "Edit")}>
                    <PencilLine size={14} />
                  </button>
                  <button onClick={() => removeBlock(b)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ color: "#C53030" }} title={tx("Eliminar", "Delete")}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

/* ============================================================
   SUEÑO Y TIEMPO PERSONAL
============================================================ */
function SleepPersonalConfig() {
  const { data, setData, th, lang, tx, reschedule } = useApp();
  const [draftSleep, setDraftSleep] = useState(data.sleep);
  const [draftPersonal, setDraftPersonal] = useState(data.personalMinutes);
  const [draftShabbat, setDraftShabbat] = useState(data.shabbat);
  const [saved, setSaved] = useState(false);

  function setSleep(day, field, val) {
    setDraftSleep((s) => ({ ...s, [day]: { ...s[day], [field]: val } }));
  }
  function setPersonalMinutes(day, val) {
    setDraftPersonal((p) => ({ ...p, [day]: parseInt(val, 10) || 0 }));
  }
  function setShabbatField(patch) {
    setDraftShabbat((s) => ({ ...s, ...patch }));
  }

  function guardarCambios() {
    setData((d) => {
      const history = pushHistory(d, { type: "schedule_changed", entityType: "schedule", title: tx("Sueño, tiempo personal y Shabbat", "Sleep, personal time and Shabbat"), snapshot: scheduleSnapshot(d) });
      const nd = { ...d, sleep: draftSleep, personalMinutes: draftPersonal, shabbat: draftShabbat, history };
      return { ...nd, tasks: reschedule(nd) };
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <h3 className="font-bold mb-1 flex items-center gap-2" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}><Moon size={17} style={{ color: COLORS.sueno }} />{tx("Sueño", "Sleep")}</h3>
        <p className="text-xs mb-4" style={{ color: th.textMuted }}>{tx("Este bloque queda protegido: TASKUP! nunca coloca trabajos aquí sin tu permiso.", "This block stays protected: TASKUP! never places work here without your permission.")}</p>
        <div className="flex flex-col gap-2">
          {DAY_KEYS.map((d) => (
            <div key={d} className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold w-20 shrink-0" style={{ color: th.text }}>{DAY_LABEL[lang][d]}</span>
              <TextInput type="time" value={draftSleep[d].sleep || ""} onChange={(e) => setSleep(d, "sleep", e.target.value)} style={{ width: 120 }} />
              <span className="text-xs" style={{ color: th.textMuted }}>{tx("a", "to")}</span>
              <TextInput type="time" value={draftSleep[d].wake || ""} onChange={(e) => setSleep(d, "wake", e.target.value)} style={{ width: 120 }} />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="font-bold mb-1 flex items-center gap-2" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}><SunMedium size={17} style={{ color: COLORS.personal }} />{tx("Tiempo personal", "Personal time")}</h3>
        <p className="text-xs mb-4" style={{ color: th.textMuted }}>{tx("Solo dile a TASKUP! cuántos minutos quieres por día. TASKUP! decide automáticamente en qué momento del día colocarlos.", "Just tell TASKUP! how many minutes you want per day. TASKUP! automatically decides when in the day to place them.")}</p>
        <div className="flex flex-col gap-2">
          {DAY_KEYS.map((d) => (
            <div key={d} className="flex items-center gap-3">
              <span className="text-sm font-semibold w-20 shrink-0" style={{ color: th.text }}>{DAY_LABEL[lang][d]}</span>
              <TextInput type="number" min="0" step="5" value={draftPersonal[d] || 0} onChange={(e) => setPersonalMinutes(d, e.target.value)} style={{ width: 100 }} />
              <span className="text-xs" style={{ color: th.textMuted }}>{tx("minutos", "minutes")}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="font-bold mb-1" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>Shabbat</h3>
        <p className="text-xs mb-4" style={{ color: th.textMuted }}>{tx("TASKUP! nunca coloca trabajos durante este bloque.", "TASKUP! never places work during this block.")}</p>
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => setShabbatField({ enabled: !draftShabbat.enabled })}
            className="px-4 py-2 rounded-xl text-sm font-semibold" style={draftShabbat.enabled ? { background: COLORS.shabbat, color: "#fff" } : { background: th.surfaceAlt, color: th.textMuted }}>
            {draftShabbat.enabled ? tx("Activado", "Enabled") : tx("Desactivado", "Disabled")}
          </button>
        </div>
        {draftShabbat.enabled && (
          <div className="grid grid-cols-2 gap-4">
            <Field label={tx("Desde", "From")}>
              <div className="flex gap-2">
                <Select value={draftShabbat.startDay} onChange={(e) => setShabbatField({ startDay: e.target.value })}>
                  {DAY_KEYS.map((d) => <option key={d} value={d}>{DAY_LABEL[lang][d]}</option>)}
                </Select>
                <TextInput type="time" value={draftShabbat.startTime} onChange={(e) => setShabbatField({ startTime: e.target.value })} />
              </div>
            </Field>
            <Field label={tx("Hasta", "Until")}>
              <div className="flex gap-2">
                <Select value={draftShabbat.endDay} onChange={(e) => setShabbatField({ endDay: e.target.value })}>
                  {DAY_KEYS.map((d) => <option key={d} value={d}>{DAY_LABEL[lang][d]}</option>)}
                </Select>
                <TextInput type="time" value={draftShabbat.endTime} onChange={(e) => setShabbatField({ endTime: e.target.value })} />
              </div>
            </Field>
          </div>
        )}
      </Card>

      <Btn onClick={guardarCambios} style={{ alignSelf: "flex-start" }}>
        {saved ? <><Check size={16} />{tx("Guardado", "Saved")}</> : tx("Guardar cambios", "Save changes")}
      </Btn>
    </div>
  );
}

/* ============================================================
   VISTA HORARIOS (contenedor con pestañas)
============================================================ */
function HorariosView() {
  const { data, th, lang, tx } = useApp();
  const hasAnySchedule = data.fixedBlocks.length > 0 || Object.values(data.sleep).some((s) => s.sleep) || Object.values(data.personalMinutes).some((m) => m > 0);
  const [tab, setTab] = useState(hasAnySchedule ? "calendario" : "agregar");
  const [calMode, setCalMode] = useState("semana");

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-28">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>{tx("Horarios", "Schedule")}</h1>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <ChipToggle active={tab === "calendario"} onClick={() => setTab("calendario")}>{tx("Todo tu calendario", "Your full calendar")}</ChipToggle>
        <ChipToggle active={tab === "agregar"} onClick={() => setTab("agregar")}>{tx("Agregar horario", "Add schedule")}</ChipToggle>
        <ChipToggle active={tab === "sueno"} onClick={() => setTab("sueno")}>{tx("Sueño y tiempo personal", "Sleep & personal time")}</ChipToggle>
      </div>

      {tab === "calendario" && (
        hasAnySchedule || data.tasks.length > 0 ? (
          <div>
            <div className="flex gap-2 mb-5">
              <ChipToggle active={calMode === "semana"} onClick={() => setCalMode("semana")}><CalendarDays size={13} className="inline mr-1" />{tx("Semanal", "Weekly")}</ChipToggle>
              <ChipToggle active={calMode === "mes"} onClick={() => setCalMode("mes")}><CalendarRange size={13} className="inline mr-1" />{tx("Mensual", "Monthly")}</ChipToggle>
            </div>
            {calMode === "semana" ? <WeekGrid /> : <MonthGrid />}
          </div>
        ) : (
          <EmptyState icon={CalendarDays} text={tx("Tu calendario aparecerá aquí cuando agregues tu horario y actividades.", "Your calendar will appear here once you add your schedule and activities.")} />
        )
      )}

      {tab === "agregar" && (
        <div>
          <AddBlockForm />
        </div>
      )}

      {tab === "sueno" && <SleepPersonalConfig />}
    </div>
  );
}

/* ============================================================
   TRABAJOS HECHOS
============================================================ */
function TrabajosHechosView() {
  const { data, setData, th, lang, tx, reschedule } = useApp();
  const cutoff = addDays(panamaNow(), -7).getTime();
  const done = (data.tasks || []).filter((t) => t.completed && new Date(t.completedAt).getTime() >= cutoff)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

  function undo(id) {
    setData((d) => {
      const tasks = d.tasks.map((t) => t.id === id ? { ...t, completed: false, completedAt: null } : t);
      const nd = { ...d, tasks };
      return { ...nd, tasks: reschedule(nd) };
    });
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-28">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>{tx("Trabajos hechos", "Done")}</h1>
      {done.length === 0 ? (
        <EmptyState icon={CheckCircle2} text={tx("Todavía no has completado ningún trabajo.", "You haven't completed any work yet.")} />
      ) : (
        <div className="flex flex-col gap-3">
          {done.map((t) => (
            <Card key={t.id}>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold truncate" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: th.textMuted }}>{t.subject ? `${t.subject} · ` : ""}{TYPE_LABEL[lang][t.type]} · {fmtHours(t.durationMin)}</p>
                  <p className="text-xs mt-0.5" style={{ color: th.textMuted }}>{tx("Completado", "Completed")}: {fmtDateTimePanama(t.completedAt, lang)}</p>
                </div>
                <Btn variant="ghost" style={{ padding: "6px 10px", fontSize: 12 }} onClick={() => undo(t.id)}><Undo2 size={13} />{tx("Deshacer", "Undo")}</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   PROGRESO
============================================================ */
function ProgresoView() {
  const { data, th, lang, tx } = useApp();
  const tasks = data.tasks || [];
  const completed = tasks.filter((t) => t.completed);
  const pending = tasks.filter((t) => !t.completed && !t.delivered);
  const overdue = pending.filter((t) => t.dueDate < todayISO());
  const total = tasks.length;
  const pct = total ? Math.round((completed.length / total) * 100) : 0;

  const weekStart = addDays(panamaNow(), -((panamaNow().getDay() + 6) % 7));
  weekStart.setHours(0, 0, 0, 0);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekData = weekDays.map((d) => {
    const iso = toISO(d);
    const doneThatDay = completed.filter((t) => t.completedAt && toISO(new Date(t.completedAt)) === iso).length;
    return { day: dayKeyFromDate(d), count: doneThatDay };
  });
  const maxCount = Math.max(1, ...weekData.map((w) => w.count));

  if (total === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-28">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-6" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>{tx("Progreso", "Progress")}</h1>
        <EmptyState icon={TrendingUp} text={tx("No mostramos estadísticas falsas: agrega trabajos para ver tu progreso real aquí.", "We don't show fake statistics: add work to see your real progress here.")} />
      </div>
    );
  }

  const stats = [
    { label: tx("Completados", "Completed"), value: completed.length, color: "#27AE60" },
    { label: tx("% completado", "% completed"), value: `${pct}%`, color: th.primary },
    { label: tx("Atrasados", "Overdue"), value: overdue.length, color: "#EB5757" },
    { label: tx("Pendientes", "Pending"), value: pending.length, color: "#F2994A" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-28">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>{tx("Progreso", "Progress")}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {stats.map((s, i) => (
          <Card key={i} style={{ padding: 16 }}>
            <p className="text-2xl font-extrabold" style={{ color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
            <p className="text-xs mt-1" style={{ color: th.textMuted }}>{s.label}</p>
          </Card>
        ))}
      </div>
      <Card>
        <h3 className="font-bold mb-4" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>{tx("Progreso semanal", "Weekly progress")}</h3>
        <div className="flex items-end gap-3 h-32">
          {weekData.map((w, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full rounded-t-lg" style={{ height: `${(w.count / maxCount) * 100}%`, minHeight: 4, background: th.primary }} />
              <span className="text-[10px] font-semibold" style={{ color: th.textMuted }}>{DAY_SHORT[lang][w.day]}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ============================================================
   HISTORIAL — dividido en categorías, con opción de restaurar
============================================================ */
function HistorialView() {
  const { data, setData, th, lang, tx, reschedule } = useApp();
  // Hora de referencia fija mientras la pantalla está abierta, para agrupar el historial.
  const [ahora] = useState(() => Date.now());
  const items = pruneHistory(data.history);
  const typeLabel = { created: tx("Creado", "Created"), modified: tx("Modificado", "Modified"), deleted: tx("Eliminado", "Deleted"), completed: tx("Completado", "Completed"), recovered: tx("Recuperado", "Recovered"), schedule_changed: tx("Horario actualizado", "Schedule updated") };
  const entityLabel = { task: tx("Trabajo", "Task"), block: tx("Horario", "Schedule"), schedule: tx("Horario", "Schedule") };

  function deshacerHorario(item) {
    setData((d) => {
      const nd = { ...d, ...item.snapshot };
      return { ...nd, tasks: reschedule(nd) };
    });
  }

  function bucketFor(dateStr) {
    const diffDays = (ahora - new Date(dateStr).getTime()) / 86400000;
    if (diffDays <= 7) return "week";
    if (diffDays <= 30) return "month";
    return "older";
  }

  const groups = { week: [], month: [], older: [] };
  items.forEach((h) => groups[bucketFor(h.date)].push(h));

  const sections = [
    { key: "week", label: tx("Esta última semana", "This last week") },
    { key: "month", label: tx("30 días", "30 days") },
    { key: "older", label: tx("Más de 1 mes", "More than 1 month") },
  ];

  function recuperar(item) {
    setData((d) => {
      if (item.entityType === "block") {
        const fixedBlocks = [...d.fixedBlocks, { ...item.snapshot, id: uid() }];
        const nd = { ...d, fixedBlocks, history: pushHistory(d, { type: "recovered", entityType: "block", title: item.snapshot.title, snapshot: null }) };
        return { ...nd, tasks: reschedule(nd) };
      }
      const tasks = [...d.tasks, { ...item.snapshot, completed: false, delivered: false, sessions: [] }];
      const nd = { ...d, tasks, history: pushHistory(d, { type: "recovered", entityType: "task", title: item.snapshot.name, snapshot: null }) };
      return { ...nd, tasks: reschedule(nd) };
    });
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-28">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>{tx("Historial", "History")}</h1>
      {items.length === 0 ? (
        <EmptyState icon={HistoryIcon} text={tx("No tienes elementos en el historial.", "You have no items in your history.")} />
      ) : (
        <div className="flex flex-col gap-8">
          {sections.map((sec) => groups[sec.key].length > 0 && (
            <div key={sec.key}>
              <h2 className="text-sm font-extrabold tracking-wide mb-3" style={{ color: th.textMuted }}>{sec.label.toUpperCase()}</h2>
              <div className="flex flex-col gap-2.5">
                {groups[sec.key].map((h) => (
                  <Card key={h.id} style={{ padding: 16 }}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold" style={{ color: th.text }}>
                          <span style={{ color: th.primary }}>{typeLabel[h.type] || h.type}</span> · {entityLabel[h.entityType] || ""} · {h.title}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: th.textMuted }}>{fmtDateTimePanama(h.date, lang)}</p>
                      </div>
                      {h.type === "deleted" && h.snapshot && (
                        <Btn variant="soft" style={{ padding: "6px 10px", fontSize: 12 }} onClick={() => recuperar(h)}><RotateCcw size={13} />{tx("Recuperar", "Recover")}</Btn>
                      )}
                      {h.type === "schedule_changed" && h.snapshot && (
                        <Btn variant="soft" style={{ padding: "6px 10px", fontSize: 12 }} onClick={() => deshacerHorario(h)}><Undo2 size={13} />{tx("Deshacer", "Undo")}</Btn>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   CONFIGURACIÓN
============================================================ */
function ConfiguracionView() {
  const { data, setData, th, lang, tx } = useApp();
  const u = data.user || {};
  const [nombre, setNombre] = useState(u.nombre || "");
  const [apellido, setApellido] = useState(u.apellido || "");
  const [rol, setRol] = useState(u.rol || "");
  const [rolOtro, setRolOtro] = useState(u.rolOtro || "");
  const [genero, setGenero] = useState(u.genero || "");
  const [nacimiento, setNacimiento] = useState(u.nacimiento || "");
  const [saved, setSaved] = useState(false);
  const [permState, setPermState] = useState(typeof Notification !== "undefined" ? Notification.permission : "unsupported");

  function saveProfile() {
    setData((d) => ({ ...d, user: { ...d.user, nombre: nombre.trim(), apellido: apellido.trim(), rol, rolOtro: rol === "otro" ? rolOtro.trim() : "", genero, nacimiento } }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function requestPerm() {
    if (typeof Notification === "undefined") return;
    Notification.requestPermission().then((p) => setPermState(p));
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-28">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>{tx("Configuración", "Settings")}</h1>

      <Card className="mb-5">
        <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}><User size={17} />{tx("Perfil", "Profile")}</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label={tx("Nombre", "First name")}><TextInput value={nombre} onChange={(e) => setNombre(e.target.value)} /></Field>
          <Field label="Apellido"><TextInput value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder={tx("Tu apellido", "Your last name")} /></Field>
        </div>
        <Field label={tx("Fecha de nacimiento", "Date of birth")}>
          <TextInput type="date" value={nacimiento} onChange={(e) => setNacimiento(e.target.value)} />
        </Field>
        <Field label={tx("¿Qué eres?", "What are you?")}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ROLE_KEYS.map((r) => (
              <ChipToggle key={r} active={rol === r} onClick={() => setRol(r)}>{ROLE_LABEL[lang][r]}</ChipToggle>
            ))}
          </div>
          {rol === "otro" && <TextInput className="mt-2" value={rolOtro} onChange={(e) => setRolOtro(e.target.value)} placeholder={tx("¿Qué eres?", "What are you?")} />}
        </Field>
        <Field label={tx("Género", "Gender")}>
          <div className="flex gap-2">
            <ChipToggle active={genero === "mujer"} onClick={() => setGenero("mujer")}>{tx("Mujer", "Woman")}</ChipToggle>
            <ChipToggle active={genero === "hombre"} onClick={() => setGenero("hombre")}>{tx("Hombre", "Man")}</ChipToggle>
          </div>
        </Field>
        <Btn onClick={saveProfile}>{saved ? <><Check size={15} />{tx("Guardado", "Saved")}</> : tx("Guardar perfil", "Save profile")}</Btn>
      </Card>

      <Card className="mb-5">
        <h3 className="font-bold mb-4" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>{tx("Idioma", "Language")}</h3>
        <div className="flex gap-2">
          <ChipToggle active={data.settings.lang === "es"} onClick={() => setData((d) => ({ ...d, settings: { ...d.settings, lang: "es" } }))}>Español</ChipToggle>
          <ChipToggle active={data.settings.lang === "en"} onClick={() => setData((d) => ({ ...d, settings: { ...d.settings, lang: "en" } }))}>English</ChipToggle>
        </div>
      </Card>

      <Card className="mb-5">
        <h3 className="font-bold mb-4" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>Display</h3>
        <div className="flex gap-2">
          <ChipToggle active={data.settings.theme === "dia"} onClick={() => setData((d) => ({ ...d, settings: { ...d.settings, theme: "dia" } }))}><SunMedium size={13} className="inline mr-1" />{tx("Día", "Day")}</ChipToggle>
          <ChipToggle active={data.settings.theme === "noche"} onClick={() => setData((d) => ({ ...d, settings: { ...d.settings, theme: "noche" } }))}><Moon size={13} className="inline mr-1" />{tx("Noche", "Night")}</ChipToggle>
        </div>
      </Card>

      <Card>
        <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>{data.settings.notif ? <Bell size={17} /> : <BellOff size={17} />}{tx("Notificaciones", "Notifications")}</h3>
        <p className="text-xs mb-4" style={{ color: th.textMuted }}>{tx("Avisos 2 días antes, 1 día antes y el mismo día de cada entrega o examen.", "Reminders 2 days before, 1 day before, and the same day of each due date or exam.")}</p>
        <button onClick={() => setData((d) => ({ ...d, settings: { ...d.settings, notif: !d.settings.notif } }))}
          className="px-4 py-2 rounded-xl text-sm font-semibold" style={data.settings.notif ? { background: "#27AE60", color: "#fff" } : { background: th.surfaceAlt, color: th.textMuted }}>
          {data.settings.notif ? tx("Activadas", "Enabled") : tx("Desactivadas", "Disabled")}
        </button>

        <div className="mt-5 pt-5" style={{ borderTop: `1px solid ${th.border}` }}>
          <p className="text-xs mb-2 font-semibold" style={{ color: th.textMuted }}>{tx("Notificaciones del navegador (opcional)", "Browser notifications (optional)")}</p>
          <p className="text-xs mb-3" style={{ color: th.textMuted }}>{tx("Además de los avisos dentro de la app, puedes activar notificaciones reales del navegador.", "In addition to the in-app reminders, you can enable real browser notifications.")}</p>
          <Btn variant="soft" onClick={requestPerm} disabled={permState === "granted" || permState === "unsupported"}>
            {permState === "granted" ? tx("Permiso concedido", "Permission granted") : permState === "denied" ? tx("Permiso bloqueado por el navegador", "Permission blocked by browser") : permState === "unsupported" ? tx("No disponible en este navegador", "Not available in this browser") : tx("Activar notificaciones del navegador", "Enable browser notifications")}
          </Btn>
        </div>
      </Card>
    </div>
  );
}

/* ============================================================
   SOBRE NOSOTROS
============================================================ */
function SobreNosotrosView() {
  const { th, tx } = useApp();
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-28">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6" style={{ color: th.text, fontFamily: "'Space Grotesk', sans-serif" }}>{tx("Sobre nosotros", "About us")}</h1>
      <Card>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: th.primarySoft, color: th.primary }}><Sparkles size={22} /></div>
        <p className="text-sm leading-relaxed mb-4" style={{ color: th.text }}>
          {tx(
            "TASKUP! fue creado por Daniela Schneir. Como muchas otras personas, ha tenido dificultades para manejar bien su tiempo entre tareas, exámenes, proyectos y todo lo demás.",
            "TASKUP! was created by Daniela Schneir. Like many other people, she has struggled to manage her time well between homework, exams, projects, and everything else."
          )}
        </p>
        <p className="text-sm leading-relaxed mb-4" style={{ color: th.text }}>
          {tx(
            "Pensó mucho en cuánto le había bajado el promedio por no organizarse a tiempo, y en cuánto podría subir si su horario estuviera realmente bien organizado. De esa idea nació TASKUP!.",
            "She thought a lot about how much her grades had dropped from not organizing herself in time, and how much they could improve if her schedule were actually well organized. That idea is where TASKUP! came from."
          )}
        </p>
        <p className="text-sm leading-relaxed mb-4" style={{ color: th.text }}>
          {tx(
            "TASKUP! no es una simple lista de tareas: analiza tu horario, tus responsabilidades y tus trabajos pendientes para decidir cuándo es el mejor momento para hacer cada cosa, sin tomar decisiones importantes por ti.",
            "TASKUP! is not a simple to-do list: it analyzes your schedule, your responsibilities, and your pending work to decide the best moment to do each thing, without making important decisions for you."
          )}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: th.text }}>
          {tx("Esta app fue construida con la ayuda de Claude, el modelo de inteligencia artificial de Anthropic.", "This app was built with the help of Claude, Anthropic's AI model.")}
        </p>
      </Card>
    </div>
  );
}

/* ============================================================
   APP PRINCIPAL
============================================================ */
const VIEW_TITLES = {
  inicio: { es: "Inicio", en: "Home" },
  horarios: { es: "Horarios", en: "Schedule" },
  hechos: { es: "Trabajos hechos", en: "Done" },
  progreso: { es: "Progreso", en: "Progress" },
  historial: { es: "Historial", en: "History" },
  config: { es: "Configuración", en: "Settings" },
  nosotros: { es: "Sobre nosotros", en: "About us" },
};

export default function App() {
  const [data, setDataRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("inicio");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showAI, setShowAI] = useState(false);
  const saveTimer = useRef(null);
  const firstLoad = useRef(true);

  useEffect(() => {
    (async () => {
      const loaded = await loadState();
      setDataRaw(loaded || defaultData());
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (loading || !data) return;
    if (firstLoad.current) { firstLoad.current = false; return; }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => { saveState(data); }, 350);
    return () => clearTimeout(saveTimer.current);
  }, [data, loading]);

  const setData = useCallback((updater) => {
    setDataRaw((prev) => (typeof updater === "function" ? updater(prev) : updater));
  }, []);

  const reschedule = useCallback((d) => scheduleAll(d), []);

  const lang = data?.settings?.lang || "es";
  const themeKey = data?.settings?.theme || "dia";
  const th = THEMES[themeKey];
  const tx = useTx(lang);

  const ctxValue = useMemo(() => ({ data, setData, th, lang, tx, reschedule }), [data, setData, th, lang, tx, reschedule]);

  // Notificaciones reales del navegador (si el permiso fue concedido)
  useEffect(() => {
    if (!data || loading) return;
    if (!data.settings.notif) return;
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    const tISOToday = todayISO();
    const log = data.notifiedLog || {};
    const newLog = { ...log };
    let changed = false;
    (data.tasks || []).forEach((t) => {
      if (t.completed || t.delivered) return;
      const days = Math.round((parseISO(t.dueDate) - parseISO(tISOToday)) / 86400000);
      if (days >= 0 && days <= 2) {
        const key = `task-${t.id}-${tISOToday}`;
        if (!newLog[key]) {
          try {
            new Notification("TASKUP!", { body: lang === "es"
              ? `"${t.name}" ${days === 0 ? "se entrega hoy" : days === 1 ? "se entrega mañana" : "se entrega en 2 días"}.`
              : `"${t.name}" ${days === 0 ? "is due today" : days === 1 ? "is due tomorrow" : "is due in 2 days"}.` });
          } catch (e) {}
          newLog[key] = true; changed = true;
        }
      }
    });
    (data.exams || []).forEach((ex) => {
      const days = Math.round((parseISO(ex.date) - parseISO(tISOToday)) / 86400000);
      if (days === 1) {
        const key = `exam-${ex.id}-${tISOToday}`;
        if (!newLog[key]) {
          try {
            new Notification("TASKUP!", { body: lang === "es" ? `Examen "${ex.title}" es mañana.` : `Exam "${ex.title}" is tomorrow.` });
          } catch (e) {}
          newLog[key] = true; changed = true;
        }
      }
    });
    if (changed) setData((d) => ({ ...d, notifiedLog: newLog }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data && data.tasks, data && data.exams, data && data.settings?.notif]);

  function requestDelete(task) { setDeleteTarget(task); }
  function confirmDelete() {
    setData((d) => {
      const nd = {
        ...d,
        tasks: d.tasks.filter((t) => t.id !== deleteTarget.id),
        history: pushHistory(d, { type: "deleted", entityType: "task", title: deleteTarget.name, snapshot: deleteTarget }),
      };
      return { ...nd, tasks: reschedule(nd) };
    });
    setDeleteTarget(null);
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: THEMES.dia.bg }}>
        <style>{`${FONT_IMPORT}`}</style>
        <Loader2 className="animate-spin" size={28} style={{ color: THEMES.dia.primary }} />
      </div>
    );
  }

  return (
    <AppCtx.Provider value={ctxValue}>
      <div style={{ background: th.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: th.text }}>
        <style>{`
          ${FONT_IMPORT}
          * { box-sizing: border-box; }
          input:focus, textarea:focus, select:focus { box-shadow: 0 0 0 3px ${th.primarySoft}; border-color: ${th.primary}; }
          ::-webkit-scrollbar { width: 8px; height: 8px; }
          ::-webkit-scrollbar-thumb { background: ${th.border}; border-radius: 8px; }
          ::selection { background: ${th.primarySoft}; }
        `}</style>

        {!data.onboarded ? (
          <Onboarding />
        ) : (
          <div className="flex">
            <Sidebar view={view} setView={(v) => { if (v === "agregar") setShowAddTask(true); else setView(v); }} user={data.user} />
            <div className="flex-1 min-w-0">
              <MobileTopBar setDrawerOpen={setDrawerOpen} title={lang === "es" ? (VIEW_TITLES[view]?.es || "TASKUP!") : (VIEW_TITLES[view]?.en || "TASKUP!")} />
              <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} view={view} user={data.user}
                setView={(v) => { if (v === "agregar") setShowAddTask(true); else setView(v); }} />

              {view === "inicio" && <HomeView setEditingTask={setEditingTask} requestDelete={requestDelete} />}
              {view === "horarios" && <HorariosView />}
              {view === "hechos" && <TrabajosHechosView />}
              {view === "progreso" && <ProgresoView />}
              {view === "historial" && <HistorialView />}
              {view === "config" && <ConfiguracionView />}
              {view === "nosotros" && <SobreNosotrosView />}

              <FloatingAI onClick={() => setShowAI(true)} />
            </div>
          </div>
        )}

        {(showAddTask || editingTask) && (
          <AddTaskModal editingTask={editingTask} onClose={() => { setShowAddTask(false); setEditingTask(null); }} />
        )}

        {showAI && <AIAssistantModal onClose={() => setShowAI(false)} />}

        {deleteTarget && (
          <ConfirmModal
            title={tx("¿Seguro que quieres eliminar esto?", "Are you sure you want to delete this?")}
            message={deleteTarget.name}
            confirmLabel={tx("Eliminar", "Delete")}
            cancelLabel={tx("Cancelar", "Cancel")}
            danger
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </div>
    </AppCtx.Provider>
  );
}
