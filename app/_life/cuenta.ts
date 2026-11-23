"use client";

// Cuenta de IAE LIFE: quién entró, guardado solo en este navegador.
// Se entra con la cuenta Google del colegio (@iae.edu). El correo dice si es estudiante o profesor:
//   estudiante → nombre.apellido.2030@iae.edu (el año es la promoción)
//   profesor   → nombre.apellido@iae.edu
import { useSyncExternalStore } from "react";

export const DOMINIO = "iae.edu";
const CLAVE = "iae-life:cuenta";
const EVENTO = "iae-life:cuenta";

export type Rol = "estudiante" | "profesor";

export type Cuenta = {
  nombre: string;
  correo: string;
  rol: Rol;
  promocion: number | null;
  foto?: string;
  prueba?: boolean; // true si se entró con el usuario de prueba
  correoPadres?: string;
  color?: string;
};

// Lee el correo del colegio y dice el rol y la promoción. Devuelve null si no es @iae.edu.
export function leerCorreo(correo: string): { rol: Rol; promocion: number | null } | null {
  const limpio = correo.trim().toLowerCase();
  const [usuario, dominio] = limpio.split("@");
  if (!usuario || dominio !== DOMINIO) return null;
  const anio = usuario.match(/\.(\d{4})$/);
  if (anio) return { rol: "estudiante", promocion: Number(anio[1]) };
  return { rol: "profesor", promocion: null };
}

function leer(): Cuenta | null {
  try {
    const texto = localStorage.getItem(CLAVE);
    if (!texto) return null;
    const c = JSON.parse(texto) as Cuenta;
    return c && typeof c.correo === "string" && leerCorreo(c.correo) ? c : null;
  } catch {
    return null;
  }
}

// Guardamos el texto para que useSyncExternalStore reciba siempre el mismo objeto si nada cambió.
let cacheTexto: string | null = null;
let cacheCuenta: Cuenta | null = null;

function obtener(): Cuenta | null {
  let texto: string | null = null;
  try {
    texto = localStorage.getItem(CLAVE);
  } catch {
    texto = null;
  }
  if (texto !== cacheTexto) {
    cacheTexto = texto;
    cacheCuenta = leer();
  }
  return cacheCuenta;
}

function suscribir(aviso: () => void) {
  const alCambiar = (e: Event) => {
    if (e instanceof StorageEvent && e.key !== CLAVE) return;
    aviso();
  };
  window.addEventListener("storage", alCambiar);
  window.addEventListener(EVENTO, alCambiar);
  return () => {
    window.removeEventListener("storage", alCambiar);
    window.removeEventListener(EVENTO, alCambiar);
  };
}

export function guardarCuenta(cuenta: Cuenta | null) {
  try {
    if (cuenta) localStorage.setItem(CLAVE, JSON.stringify(cuenta));
    else localStorage.removeItem(CLAVE);
  } catch {
    // Si el navegador no deja guardar (modo privado), la cuenta solo dura mientras la página esté abierta.
  }
  window.dispatchEvent(new Event(EVENTO));
}

export function salir() {
  guardarCuenta(null);
}

// undefined = todavía no se sabe (en el servidor o antes de cargar); null = nadie entró.
export function useCuenta(): Cuenta | null | undefined {
  return useSyncExternalStore(suscribir, obtener, () => undefined);
}

// Usuario inventado para probar sin cuenta Google.
export const CUENTA_PRUEBA: Cuenta = {
  nombre: "Sofía Prueba",
  correo: "sofia.prueba.2030@iae.edu",
  rol: "estudiante",
  promocion: 2030,
  prueba: true,
};

// El token de Google (JWT) trae el nombre y el correo en la parte del medio.
// Ojo: aquí no se verifica la firma, porque IAE LIFE todavía no tiene servidor ni datos que proteger.
// Cuando haya base de datos, el token se verifica en el servidor (ver DESPUES.md).
export function cuentaDesdeTokenGoogle(token: string): Cuenta | null {
  try {
    const parte = token.split(".")[1];
    const base64 = parte.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(parte.length / 4) * 4, "=");
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const datos = JSON.parse(new TextDecoder().decode(bytes)) as {
      email?: string;
      email_verified?: boolean;
      hd?: string;
      name?: string;
      picture?: string;
    };
    if (!datos.email || datos.email_verified === false || datos.hd !== DOMINIO) return null;
    const info = leerCorreo(datos.email);
    if (!info) return null;
    return {
      nombre: datos.name?.trim() || datos.email.split("@")[0],
      correo: datos.email.toLowerCase(),
      ...info,
      foto: datos.picture,
    };
  } catch {
    return null;
  }
}

export function iniciales(nombre: string) {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}
