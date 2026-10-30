"use client";

import { useEffect, useState } from "react";
import { loadHistory, loadSchedule, loadStudent, saveHistory, saveSchedule, saveStudent } from "../lib/almacen";
import type { HistoryEntry, Page, Report, SentEmail, TeacherGroup } from "../lib/tipos";
import ClasesAfectadas from "./ClasesAfectadas";
import Confirmacion from "./Confirmacion";
import CorreosGenerados from "./CorreosGenerados";
import Historial from "./Historial";
import Horario from "./Horario";
import Inicio from "./Inicio";
import { MobileNav, Sidebar } from "./Navegacion";
import Perfil from "./Perfil";
import ReportarAusencia from "./ReportarAusencia";

/* ---------- App principal ---------- */
// Solo corre en el navegador (ver AvisIACliente.tsx), así que puede leer localStorage al empezar.

type FlowStep = "form" | "classes" | "emails" | "confirm";

export default function AvisIA() {
  const [page, setPage] = useState<Page>("inicio");
  const [flowStep, setFlowStep] = useState<FlowStep>("form");
  const [report, setReport] = useState<Report | null>(null);
  const [affectedClasses, setAffectedClasses] = useState<TeacherGroup[]>([]);
  const [sentEmails, setSentEmails] = useState<SentEmail[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const [schedule, setSchedule] = useState(loadSchedule);
  const [student, setStudent] = useState(loadStudent);

  useEffect(() => saveHistory(history), [history]);
  useEffect(() => saveSchedule(schedule), [schedule]);
  useEffect(() => saveStudent(student), [student]);

  // Al cambiar de pantalla, vuelve arriba.
  function goTo(p: Page) {
    if (p === "reportar") {
      setFlowStep("form");
      setReport(null);
    }
    setPage(p);
    window.scrollTo({ top: 0 });
  }

  function handleContinueForm(rep: Report) {
    setReport(rep);
    setFlowStep("classes");
    window.scrollTo({ top: 0 });
  }

  function handleGenerate(classes: TeacherGroup[]) {
    setAffectedClasses(classes);
    setFlowStep("emails");
    window.scrollTo({ top: 0 });
  }

  function handleSent(sent: SentEmail[]) {
    if (!report) return;
    setSentEmails(sent);
    const entry: HistoryEntry = {
      id: "h" + Date.now(),
      dateLabel: report.dateLabel,
      timeLabel: report.timeLabel,
      reasonLabel: report.reasonLabel,
      teachers: sent,
    };
    setHistory((prev) => [entry, ...prev]);
    setFlowStep("confirm");
    window.scrollTo({ top: 0 });
  }

  function handleDone() {
    setFlowStep("form");
    setReport(null);
    goTo("inicio");
  }

  let content;
  if (page === "inicio") {
    content = <Inicio setPage={goTo} history={history} schedule={schedule} student={student} />;
  } else if (page === "reportar") {
    if (flowStep === "classes" && report) {
      content = <ClasesAfectadas report={report} schedule={schedule} onBack={() => setFlowStep("form")} onGenerate={handleGenerate} />;
    } else if (flowStep === "emails" && report) {
      content = (
        <CorreosGenerados report={report} classes={affectedClasses} student={student} onBack={() => setFlowStep("classes")} onSent={handleSent} />
      );
    } else if (flowStep === "confirm") {
      content = <Confirmacion sentEmails={sentEmails} onDone={handleDone} />;
    } else {
      content = <ReportarAusencia onContinue={handleContinueForm} />;
    }
  } else if (page === "historial") {
    content = <Historial history={history} />;
  } else if (page === "horario") {
    content = <Horario schedule={schedule} setSchedule={setSchedule} />;
  } else {
    content = <Perfil schedule={schedule} student={student} setStudent={setStudent} />;
  }

  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={goTo} />
      <div className="main">
        <div className="bg-blob" style={{ width: 340, height: 340, top: -120, right: -100, background: "#3B82C4" }}></div>
        <div className="bg-blob" style={{ width: 260, height: 260, bottom: 60, left: -110, background: "#E8795A", opacity: 0.18 }}></div>
        <div className="bg-blob" style={{ width: 200, height: 200, top: 340, right: -60, background: "#8B6FC9", opacity: 0.16 }}></div>
        {content}
      </div>
      <MobileNav page={page} setPage={goTo} />
    </div>
  );
}
