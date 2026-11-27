"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FlaskConical, LogIn, ShieldCheck } from "lucide-react";
import { CUENTA_PRUEBA, DOMINIO, cuentaDesdeTokenGoogle, guardarCuenta, useCuenta } from "../_life/cuenta";
import { Marca } from "../_life/Marca";

type Google = {
  accounts: {
    id: {
      initialize: (opciones: {
        client_id: string;
        callback: (r: { credential: string }) => void;
        hd?: string;
        ux_mode?: "popup" | "redirect";
      }) => void;
      renderButton: (el: HTMLElement, opciones: Record<string, string | number>) => void;
    };
  };
};

const SCRIPT = "https://accounts.google.com/gsi/client";

export default function Entrar({ clienteGoogle }: { clienteGoogle: string }) {
  const router = useRouter();
  const cuenta = useCuenta();
  const boton = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const enPantalla = useRef(true);
  const cuentaActual = useRef(cuenta);

  useEffect(() => {
    cuentaActual.current = cuenta;
  }, [cuenta]);

  useEffect(() => {
    enPantalla.current = true;
    return () => {
      enPantalla.current = false;
    };
  }, []);

  // Si ya entraste, vuelves a donde estabas (?volver=/ruta, solo rutas de IAE LIFE)
  // o a tu perfil (la primera vez, directo a completar tus ajustes).
  useEffect(() => {
    if (!cuenta) return;
    const volver = new URLSearchParams(window.location.search).get("volver");
    let destino: string | null = null;
    if (volver?.startsWith("/")) {
      try {
        // El navegador normaliza la ruta; solo se acepta si sigue siendo de IAE LIFE.
        const url = new URL(volver, window.location.origin);
        if (url.origin === window.location.origin && !url.pathname.startsWith("//")) destino = url.pathname + url.search + url.hash;
      } catch {
        destino = null;
      }
    }
    if (destino && cuenta.genero && cuenta.nacimiento) router.replace(destino);
    else router.replace(cuenta.genero && cuenta.nacimiento ? "/perfil" : "/perfil#ajustes");
  }, [cuenta, router]);

  // Botón oficial de Google (solo si el coordinador configuró el Client ID).
  useEffect(() => {
    if (!clienteGoogle || cuenta) return;
    let cancelado = false;

    const pintar = () => {
      const google = (window as unknown as { google?: Google }).google;
      if (cancelado || !google || !boton.current) return;
      google.accounts.id.initialize({
        client_id: clienteGoogle,
        hd: DOMINIO,
        ux_mode: "popup",
        callback: ({ credential }) => {
          // Si ya te fuiste de esta página, o ya entraste de otra forma, no se cambia la cuenta.
          if (!enPantalla.current || cuentaActual.current) return;
          const nueva = cuentaDesdeTokenGoogle(credential);
          if (!nueva) {
            setError(
              `Solo se puede entrar con la cuenta del colegio (@${DOMINIO}). Si eres profesor y no puedes entrar, pide que te agreguen a la lista.`,
            );
            return;
          }
          guardarCuenta(nueva);
        },
      });
      google.accounts.id.renderButton(boton.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "signin_with",
        locale: "es",
        width: 240,
      });
    };

    if ((window as unknown as { google?: Google }).google) {
      pintar();
      return () => {
        cancelado = true;
      };
    }

    // Si un intento anterior falló, se quita la etiqueta vieja para poder reintentar.
    let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT}"]`);
    if (script?.dataset.fallo) {
      script.remove();
      script = null;
    }
    if (!script) {
      const nuevo = document.createElement("script");
      nuevo.src = SCRIPT;
      nuevo.async = true;
      // Esta marca queda aunque se cierre la página, para reintentar la próxima vez.
      nuevo.addEventListener("error", () => (nuevo.dataset.fallo = "1"), { once: true });
      document.head.appendChild(nuevo);
      script = nuevo;
    }
    const s = script;
    const alFallar = () => {
      if (!cancelado) setError("No se pudo cargar Google. Revisa tu conexión y vuelve a intentar.");
    };
    s.addEventListener("load", pintar);
    s.addEventListener("error", alFallar);

    return () => {
      cancelado = true;
      s.removeEventListener("load", pintar);
      s.removeEventListener("error", alFallar);
    };
  }, [clienteGoogle, cuenta]);

  return (
    <main className="flex flex-1 items-center justify-center bg-azul-50/60 px-4 py-16">
      <div className="life-entrar w-full max-w-sm rounded-3xl border border-azul-100 bg-white p-8 text-center shadow-xl shadow-azul-900/5">
        <div className="flex justify-center">
          <Marca />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-azul-950">Entra a IAE LIFE</h1>
        <p className="mt-2 text-sm leading-relaxed text-azul-900/60">
          Usa tu cuenta del colegio. Tu nombre, correo y promoción salen solos.
        </p>

        <div className="mt-8 flex min-h-11 flex-col items-center gap-3">
          {clienteGoogle ? (
            <div ref={boton} />
          ) : (
            <p className="rounded-2xl bg-azul-50 px-4 py-3 text-sm text-azul-800">
              <LogIn className="mr-1 inline size-4 align-[-3px]" aria-hidden />
              Entrar con Google se activa cuando el coordinador lo configure.
            </p>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-8 border-t border-azul-100 pt-6">
          <button
            type="button"
            onClick={() => guardarCuenta(CUENTA_PRUEBA)}
            className="inline-flex items-center gap-2 rounded-full border border-azul-200 px-5 py-2.5 text-sm font-semibold text-azul-800 transition-colors hover:bg-azul-50"
          >
            <FlaskConical className="size-4" aria-hidden />
            Probar con un usuario de ejemplo
          </button>
          <p className="mt-3 text-xs text-azul-900/50">
            {CUENTA_PRUEBA.nombre}, promoción {CUENTA_PRUEBA.promocion}. Es inventado.
          </p>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-azul-900/50">
          <ShieldCheck className="size-3.5" aria-hidden />
          Lo que guardas se queda solo en este navegador.
        </p>
        <Link href="/" className="mt-4 inline-block text-sm font-semibold text-azul-700 hover:text-azul-900">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
