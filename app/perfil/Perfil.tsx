"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CalendarDays, GraduationCap, LogIn, LogOut, Mail, Save, UserRound } from "lucide-react";
import { guardarCuenta, iniciales, salir, useCuenta, type Cuenta, type Idioma } from "../_life/cuenta";

const COLORES = ["#004d9c", "#0082ec", "#0e7490", "#047857", "#b45309", "#be123c", "#7c3aed"];

export default function Perfil() {
  const cuenta = useCuenta();

  if (cuenta === undefined) {
    return <main className="flex-1 bg-azul-50/60" aria-busy />;
  }

  if (!cuenta) {
    return (
      <main className="flex flex-1 items-center justify-center bg-azul-50/60 px-4 py-16">
        <div className="w-full max-w-sm rounded-3xl border border-azul-100 bg-white p-8 text-center">
          <UserRound className="mx-auto size-10 text-azul-300" aria-hidden />
          <h1 className="mt-4 text-xl font-bold text-azul-950">Todavía no has entrado</h1>
          <p className="mt-2 text-sm text-azul-900/60">Entra con tu cuenta del colegio para ver tu perfil.</p>
          <Link
            href="/entrar"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-azul-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-azul-900"
          >
            <LogIn className="size-4" aria-hidden /> Entrar
          </Link>
        </div>
      </main>
    );
  }

  return <PerfilDe cuenta={cuenta} key={cuenta.correo} />;
}

function PerfilDe({ cuenta }: { cuenta: Cuenta }) {
  const [correoPadres, setCorreoPadres] = useState(cuenta.correoPadres ?? "");
  const [color, setColor] = useState(cuenta.color ?? COLORES[0]);
  const [idioma, setIdioma] = useState<Idioma>(cuenta.idioma ?? "es");
  const [genero, setGenero] = useState(cuenta.genero ?? "");
  const [nacimiento, setNacimiento] = useState(cuenta.nacimiento ?? "");
  const [tema, setTema] = useState<"dia" | "noche">(cuenta.tema ?? "dia");
  const [notif, setNotif] = useState(cuenta.notif ?? true);
  const faltanDatos = !cuenta.genero || !cuenta.nacimiento;
  const [guardado, setGuardado] = useState<"" | "si" | "memoria">("");

  const correoPadresValido = correoPadres.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoPadres.trim());

  const guardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correoPadresValido) return;
    const ok = guardarCuenta({
      ...cuenta,
      correoPadres: correoPadres.trim() || undefined,
      color,
      idioma,
      genero: genero === "mujer" || genero === "hombre" ? genero : undefined,
      nacimiento: nacimiento || undefined,
      tema,
      notif,
    });
    setGuardado(ok ? "si" : "memoria");
  };

  return (
    <main className="flex-1 bg-azul-50/60">
      <div className="h-36 bg-linear-to-br from-azul-900 via-azul-800 to-azul-700" aria-hidden />
      <div className="mx-auto -mt-24 max-w-lg px-4 pb-10">
        <section className="life-entrar overflow-hidden rounded-3xl border border-azul-100 bg-white text-center shadow-xl shadow-azul-900/10">
          <div className="h-20" style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }} aria-hidden />
          <div className="px-6 pb-6">
            <span
              className="mx-auto -mt-10 grid size-20 place-items-center rounded-full text-2xl font-bold text-white ring-4 ring-white"
              style={{ backgroundColor: color }}
              aria-hidden
            >
              {iniciales(cuenta.nombre)}
            </span>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-azul-950">{cuenta.nombre}</h1>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-azul-900/60">
              <Mail className="size-4" aria-hidden /> {cuenta.correo}
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-azul-50 px-4 py-1.5 text-sm font-semibold text-azul-800">
              <GraduationCap className="size-4" aria-hidden />
              {cuenta.rol === "estudiante" ? `Estudiante · Promoción ${cuenta.promocion}` : "Profesor"}
            </p>
            {cuenta.prueba && (
              <p className="mt-3 text-xs text-azul-900/50">Usuario de ejemplo: los datos son inventados.</p>
            )}
          </div>
        </section>

        {cuenta.rol === "estudiante" && (
          <Link
            href="/horario"
            className="group mt-6 flex items-center justify-between rounded-3xl border border-azul-100 bg-white p-5 font-semibold text-azul-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-azul-900/10"
          >
            <span className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-azul-100 text-azul-800">
                <CalendarDays className="size-5" aria-hidden />
              </span>
              <span>
                Mi horario
                <span className="block text-xs font-normal text-azul-900/55">Tu clase de ahora y la semana</span>
              </span>
            </span>
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        )}

        <form
          id="ajustes"
          onSubmit={guardar}
          className="mt-6 scroll-mt-20 rounded-3xl border border-azul-100 bg-white p-6 shadow-sm"
        >
          <h2 className="font-bold text-azul-950">Ajustes de IAE LIFE</h2>
          <p className="mt-1 text-sm text-azul-900/65">Las apps de IAE LIFE los usan para no volver a pedírtelos (por ahora TASKUP!; el tema y el idioma irán llegando a las demás).</p>
          {faltanDatos && (
            <p className="mt-3 rounded-2xl bg-oro/15 px-4 py-3 text-sm font-medium text-azul-950">
              Bienvenido/a 👋 Completa tus datos para empezar.
            </p>
          )}

          <fieldset className="mt-5">
            <legend className="text-sm font-medium text-azul-900">Género</legend>
            <div className="mt-2 inline-flex rounded-full bg-azul-50 p-1">
              {(
                [
                  ["mujer", "Mujer"],
                  ["hombre", "Hombre"],
                ] as const
              ).map(([valor, texto]) => (
                <button
                  key={valor}
                  type="button"
                  onClick={() => {
                    setGenero(valor);
                    setGuardado("");
                  }}
                  aria-pressed={genero === valor}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    genero === valor ? "bg-azul-800 text-white" : "text-azul-900"
                  }`}
                >
                  {texto}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="mt-5 block text-sm font-medium text-azul-900">
            Fecha de nacimiento
            <input
              type="date"
              value={nacimiento}
              onChange={(e) => {
                setNacimiento(e.target.value);
                setGuardado("");
              }}
              className="mt-1 block w-full rounded-xl border border-azul-100 px-3 py-2 text-azul-950"
            />
          </label>

          <fieldset className="mt-5">
            <legend className="text-sm font-medium text-azul-900">Tema</legend>
            <div className="mt-2 inline-flex rounded-full bg-azul-50 p-1">
              {(
                [
                  ["dia", "Día"],
                  ["noche", "Noche"],
                ] as const
              ).map(([valor, texto]) => (
                <button
                  key={valor}
                  type="button"
                  onClick={() => {
                    setTema(valor);
                    setGuardado("");
                  }}
                  aria-pressed={tema === valor}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    tema === valor ? "bg-azul-800 text-white" : "text-azul-900"
                  }`}
                >
                  {texto}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="mt-5 flex items-center justify-between gap-3 text-sm font-medium text-azul-900">
            Recordatorios de tareas y exámenes
            <input
              type="checkbox"
              checked={notif}
              onChange={(e) => {
                setNotif(e.target.checked);
                setGuardado("");
              }}
              className="size-5 accent-azul-800"
            />
          </label>

          {cuenta.rol === "estudiante" && (
            <label className="mt-4 block text-sm font-medium text-azul-900">
              Correo de tus padres
              <input
                type="email"
                value={correoPadres}
                onChange={(e) => {
                  setCorreoPadres(e.target.value);
                  setGuardado("");
                }}
                placeholder="papa.ejemplo@correo.com"
                aria-invalid={!correoPadresValido}
                className="mt-1.5 block w-full rounded-xl border border-azul-200 px-3 py-2.5 text-base text-azul-950 outline-none focus:border-azul-500 focus:ring-2 focus:ring-azul-200"
              />
              <span className="mt-1 block text-xs text-azul-900/50">
                Más adelante, AusencIA lo usará para mandarles copia cuando avises una ausencia. Se queda solo en este
                navegador.
              </span>
              {!correoPadresValido && (
                <span className="mt-1 block text-xs text-red-600">Ese correo no se ve bien.</span>
              )}
            </label>
          )}

          <fieldset className="mt-5">
            <legend className="text-sm font-medium text-azul-900">Idioma de las apps</legend>
            <div className="mt-2 inline-flex rounded-full bg-azul-50 p-1">
              {(
                [
                  ["es", "Español"],
                  ["en", "English"],
                ] as const
              ).map(([valor, texto]) => (
                <button
                  key={valor}
                  type="button"
                  onClick={() => {
                    setIdioma(valor);
                    setGuardado("");
                  }}
                  aria-pressed={idioma === valor}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    idioma === valor ? "bg-azul-800 text-white" : "text-azul-900"
                  }`}
                >
                  {texto}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-5">
            <legend className="text-sm font-medium text-azul-900">Color</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {COLORES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setColor(c);
                    setGuardado("");
                  }}
                  aria-label={`Color ${c}`}
                  aria-pressed={color === c}
                  className={`size-9 rounded-full transition-transform ${color === c ? "scale-110 ring-2 ring-azul-950 ring-offset-2" : ""}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={!correoPadresValido}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-azul-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-azul-900 disabled:opacity-50"
          >
            <Save className="size-4" aria-hidden /> Guardar
          </button>
          {guardado && (
            <span role="status" className={`ml-3 text-sm ${guardado === "si" ? "text-emerald-700" : "text-amber-700"}`}>
              {guardado === "si" ? "Guardado" : "Este navegador no deja guardar: se pierde al cerrar."}
            </span>
          )}
        </form>

        <button
          type="button"
          onClick={salir}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-azul-700 hover:text-azul-900"
        >
          <LogOut className="size-4" aria-hidden /> Salir
        </button>
      </div>
    </main>
  );
}
