"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, MailCheck, PartyPopper, Users } from "lucide-react";
import { useCuenta, type Cuenta } from "../../_life/cuenta";
import FormularioAusencia from "./FormularioAusencia";
import TarjetaCorreo from "./TarjetaCorreo";
import Historial from "./Historial";
import { MOTIVOS, correoValido, fechaEnPalabras, generarCorreos, materiasDe, reescribir, regenerar } from "../lib/correos";
import { agregarAlHistorial } from "../lib/historial";
import type { Ausencia, Correo } from "../lib/tipos";

type Paso = "formulario" | "correos" | "listo";

const PASOS: { id: Paso; texto: string }[] = [
  { id: "formulario", texto: "Ausencia" },
  { id: "correos", texto: "Correos" },
  { id: "listo", texto: "Listo" },
];

function Pasos({ actual }: { actual: Paso }) {
  const i = PASOS.findIndex((p) => p.id === actual);
  return (
    <ol className="flex items-center gap-2 text-xs font-semibold" aria-label="Pasos">
      {PASOS.map((p, j) => (
        <li key={p.id} className="flex flex-1 items-center gap-2">
          <span
            className={`grid size-6 shrink-0 place-items-center rounded-full ${
              j < i ? "bg-oro text-azul-950" : j === i ? "bg-white text-azul-800" : "bg-white/20 text-white"
            }`}
            aria-current={j === i ? "step" : undefined}
          >
            {j < i ? <Check className="size-3.5" aria-hidden /> : j + 1}
          </span>
          <span className={j === i ? "text-white" : "text-azul-100/70"}>{p.texto}</span>
          {j < PASOS.length - 1 && <span className="h-px flex-1 bg-white/25" aria-hidden />}
        </li>
      ))}
    </ol>
  );
}

// Si cambia la cuenta (por ejemplo, alguien sale y entra otro en otra pestaña), todo el borrador
// se descarta: el flujo se vuelve a montar desde cero con la nueva cuenta.
export default function AvisIA() {
  const cuenta = useCuenta();
  if (cuenta === undefined) return <div className="h-96" aria-busy />;
  return <Flujo key={cuenta?.correo ?? "sin-cuenta"} cuenta={cuenta} />;
}

// Une el formulario, los correos y la confirmación.
function Flujo({ cuenta }: { cuenta: Cuenta | null }) {
  const correoCuenta = cuenta?.correo ?? null;
  const cc = correoValido(cuenta?.correoPadres) ? cuenta.correoPadres.trim() : "";

  const [paso, setPaso] = useState<Paso>("formulario");
  const [ausencia, setAusencia] = useState<Ausencia | null>(null);
  const [correos, setCorreos] = useState<Correo[]>([]);
  const [abiertos, setAbiertos] = useState<string[]>([]);
  // null = sin cuenta (no se guarda); true/false = si el historial quedó guardado.
  const [guardado, setGuardado] = useState<boolean | null>(null);
  const arriba = useRef<HTMLDivElement>(null);

  // Al cambiar de paso, vuelve arriba para que se vea el inicio.
  useEffect(() => {
    arriba.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [paso]);

  function generar(a: Ausencia) {
    setAusencia(a);
    setCorreos(generarCorreos(a));
    setAbiertos([]);
    setPaso("correos");
  }

  function cambiar(id: string, f: (c: Correo) => Correo) {
    setCorreos((lista) => lista.map((c) => (c.id === id ? f(c) : c)));
  }

  function terminar() {
    if (ausencia && correoCuenta) {
      const motivo = MOTIVOS.find((m) => m.id === ausencia.motivo)?.etiqueta ?? "Sin motivo";
      // Solo lo mínimo: ni el texto de los correos ni lo escrito a mano.
      const ok = agregarAlHistorial(correoCuenta, {
        id: `${Date.now()}`,
        fecha: ausencia.fecha,
        motivo,
        profesores: correos.map((c) => ({ profesor: c.profesor.nombre, materias: materiasDe(c.clases) })),
        total: correos.length,
        creado: Date.now(),
      });
      setGuardado(ok);
    } else {
      setGuardado(null);
    }
    setPaso("listo");
  }

  function otra() {
    setAusencia(null);
    setCorreos([]);
    setPaso("formulario");
  }

  return (
    <div ref={arriba} className="scroll-mt-24">
      <Pasos actual={paso} />

      <div className="mt-6 space-y-4">
        {paso === "formulario" && (
          <>
            <FormularioAusencia key={ausencia?.fecha ?? "nueva"} inicial={ausencia} onEnviar={generar} />
            {correoCuenta && <Historial correo={correoCuenta} />}
          </>
        )}

        {paso === "correos" && ausencia && (
          <>
            <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-azul-900/5">
              <button
                type="button"
                onClick={() => setPaso("formulario")}
                className="-ml-2 flex min-h-10 items-center gap-1.5 rounded-xl px-2 text-sm font-semibold text-azul-700 hover:bg-azul-50"
              >
                <ArrowLeft className="size-4" aria-hidden />
                Cambiar la ausencia
              </button>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-azul-950">
                {correos.length === 1 ? "1 correo listo" : `${correos.length} correos listos`}
              </h2>
              <p className="mt-1 text-sm text-azul-900/70">
                Para el <span className="font-semibold text-azul-900">{fechaEnPalabras(ausencia.fecha)}</span>. Uno por
                profesor: revísalo, ábrelo en Gmail y envíalo tú. AvisIA no envía nada solo.
              </p>

              <div
                className={`mt-4 flex items-start gap-3 rounded-2xl px-4 py-3 text-sm ${
                  cc ? "bg-lime-50 text-lime-900" : "bg-azul-50 text-azul-900"
                }`}
              >
                <Users className="mt-0.5 size-4 shrink-0" aria-hidden />
                {cc ? (
                  <p>
                    Tus padres van en copia (CC): <span className="break-all font-semibold">{cc}</span>
                  </p>
                ) : cuenta ? (
                  <p>
                    ¿Quieres que tus padres reciban copia?{" "}
                    <Link href="/perfil" className="font-semibold text-azul-700 underline underline-offset-2">
                      Agrega su correo en tu perfil
                    </Link>
                    .
                  </p>
                ) : (
                  <p>
                    <Link href="/entrar" className="font-semibold text-azul-700 underline underline-offset-2">
                      Entra con tu cuenta
                    </Link>{" "}
                    y agrega el correo de tus padres en tu perfil para mandarles copia.
                  </p>
                )}
              </div>
            </section>

            {correos.map((c) => (
              <TarjetaCorreo
                key={c.id}
                correo={c}
                cc={cc}
                abierto={abiertos.includes(c.id)}
                onTono={(tono) => cambiar(c.id, (x) => reescribir(x, ausencia, { tono }))}
                onLargo={(largo) => cambiar(c.id, (x) => reescribir(x, ausencia, { largo }))}
                onRegenerar={() => cambiar(c.id, (x) => regenerar(x, ausencia))}
                onEditar={(campo, valor) => cambiar(c.id, (x) => ({ ...x, [campo]: valor }))}
                onAbierto={() => setAbiertos((a) => (a.includes(c.id) ? a : [...a, c.id]))}
              />
            ))}

            <div className="rounded-3xl bg-azul-950 p-5 text-white">
              <p className="text-sm text-azul-100">
                Abriste {abiertos.length} de {correos.length}.{" "}
                {abiertos.length < correos.length ? "Cuando los envíes todos, márcalo aquí." : "¡Ya están todos!"}
              </p>
              <div className="mt-2 flex gap-1.5" aria-hidden>
                {correos.map((c) => (
                  <span
                    key={c.id}
                    className={`h-1.5 flex-1 rounded-full ${abiertos.includes(c.id) ? "bg-oro" : "bg-white/20"}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={terminar}
                className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-oro px-4 font-bold text-azul-950 transition hover:brightness-105"
              >
                <MailCheck className="size-5" aria-hidden />
                Ya los envié
              </button>
            </div>
          </>
        )}

        {paso === "listo" && ausencia && (
          <section className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-azul-900/5">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-oro/20 text-azul-800">
              <PartyPopper className="size-8" aria-hidden />
            </span>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-azul-950">¡Listo!</h2>
            <p className="mt-1 text-sm text-azul-900/70">
              {correos.length === 1 ? "Avisaste a 1 profesor" : `Avisaste a ${correos.length} profesores`} por tu
              ausencia del {fechaEnPalabras(ausencia.fecha)}.
            </p>
            <ul className="mx-auto mt-5 max-w-xs space-y-2 text-left">
              {correos.map((c) => (
                <li key={c.id} className="flex items-center gap-2 text-sm text-azul-950">
                  <Check className="size-4 shrink-0 text-lime-600" aria-hidden />
                  <span className="truncate">
                    {c.profesor.nombre} · <span className="text-azul-900/60">{materiasDe(c.clases)}</span>
                  </span>
                </li>
              ))}
            </ul>
            {guardado === true && (
              <p className="mt-5 text-xs text-azul-900/50">Quedó en tu historial, solo en este navegador.</p>
            )}
            {guardado === false && (
              <p className="mt-5 text-xs text-amber-700">No se pudo guardar en el historial de este navegador.</p>
            )}
            <button
              type="button"
              onClick={otra}
              className="mt-6 min-h-12 w-full rounded-2xl bg-azul-800 px-4 font-bold text-white hover:bg-azul-900"
            >
              Avisar otra ausencia
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
