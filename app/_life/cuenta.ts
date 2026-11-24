"use client";

// Cuenta de IAE LIFE: quién entró, guardado solo en este navegador.
// Se entra con la cuenta Google del colegio (@iae.edu). El correo dice si es estudiante o profesor:
//   estudiante → nombre.apellido.2030@iae.edu (el año es la promoción)
//   profesor   → nombre.apellido@iae.edu, solo si está en la lista autorizada (profesores.ts)
import { useSyncExternalStore } from "react";
import { PROFESORES_AUTORIZADOS } from "./profesores";

export const DOMINIO = "iae.edu";
const CLAVE = "iae-life:cuenta";
const EVENTO = "iae-life:cuenta";

export type Rol = "estudiante" | "profesor";

export type Cuenta = {
  nombre: string;
  correo: string;
  rol: Rol;
  promocion: number | null;
  prueba?: boolean; // true si se entró con el usuario de prueba
  correoPadres?: string;
  color?: string;
  idioma?: Idioma; // idioma de las apps; si no se eligió, español
  // Ajustes de IAE LIFE que usan todas las apps (así TASKUP! y las demás no los vuelven a pedir).
  genero?: "mujer" | "hombre";
  nacimiento?: string; // AAAA-MM-DD
  tema?: "dia" | "noche";
  notif?: boolean;
};

export type Idioma = "es" | "en";

// Lee el correo del colegio y dice el rol y la promoción.
// Devuelve null si no es @iae.edu o si no tiene año y no está en la lista de profesores.
export function leerCorreo(correo: string): { rol: Rol; promocion: number | null } | null {
  const limpio = correo.trim().toLowerCase();
  const [usuario, dominio] = limpio.split("@");
  if (!usuario || dominio !== DOMINIO) return null;
  const anio = usuario.match(/\.(\d{4})$/);
  if (anio) return { rol: "estudiante", promocion: Number(anio[1]) };
  if (PROFESORES_AUTORIZADOS.includes(limpio)) return { rol: "profesor", promocion: null };
  return null;
}

// Los azules de antes del avatar pasan a los del IAE (24-nov).
const COLORES_VIEJOS: Record<string, string> = { "#3478a8": "#004d9c", "#255a80": "#0082ec" };

function cumpleValido(v: unknown): string | undefined {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return undefined;
  const mes = Number(v.slice(5, 7));
  const dia = Number(v.slice(8, 10));
  const f = new Date(2000, mes - 1, dia);
  return f.getMonth() === mes - 1 && f.getDate() === dia ? `2000-${v.slice(5)}` : undefined;
}

// Solo se aceptan valores conocidos para los ajustes (lo guardado puede venir de otra versión).
function ajustesValidos(x: Partial<Cuenta>): Pick<Cuenta, "genero" | "nacimiento" | "tema" | "notif"> {
  return {
    genero: x.genero === "mujer" || x.genero === "hombre" ? x.genero : undefined,
    // Solo día y mes: el año se cambia siempre a 2000 para no guardar la edad. Fechas imposibles = sin fecha.
    nacimiento: cumpleValido(x.nacimiento),
    tema: x.tema === "dia" || x.tema === "noche" ? x.tema : undefined,
    notif: typeof x.notif === "boolean" ? x.notif : undefined,
  };
}

function leer(texto: string | null): Cuenta | null {
  if (!texto) return null;
  try {
    const c = JSON.parse(texto) as Cuenta;
    if (!c || typeof c.correo !== "string") return null;
    // El rol y la promoción siempre se recalculan del correo y de la lista, no se confía en lo guardado.
    const info = leerCorreo(c.correo);
    if (!info) return null;
    const guardado = typeof c.color === "string" ? c.color : undefined;
    const color = guardado && Object.hasOwn(COLORES_VIEJOS, guardado) ? COLORES_VIEJOS[guardado] : guardado;
    const idioma = c.idioma === "en" || c.idioma === "es" ? c.idioma : undefined;
    return { ...c, ...info, color, idioma, ...ajustesValidos(c) };
  } catch {
    return null;
  }
}

// Si el navegador no deja guardar (modo privado), la cuenta vive en memoria mientras la página esté abierta.
let enMemoria: string | null = null;
let usarMemoria = false;

// Guardamos el texto para que useSyncExternalStore reciba siempre el mismo objeto si nada cambió.
let cacheTexto: string | null = null;
let cacheCuenta: Cuenta | null = null;

function obtener(): Cuenta | null {
  let texto: string | null = enMemoria;
  if (!usarMemoria) {
    try {
      texto = localStorage.getItem(CLAVE);
    } catch {
      usarMemoria = true;
    }
  }
  if (texto !== cacheTexto) {
    cacheTexto = texto;
    cacheCuenta = leer(texto);
    migrarCumple(texto, cacheCuenta);
  }
  return cacheCuenta;
}

function suscribir(aviso: () => void) {
  const alCambiar = (e: Event) => {
    if (e instanceof StorageEvent && e.key !== null && e.key !== CLAVE) return;
    aviso();
  };
  window.addEventListener("storage", alCambiar);
  window.addEventListener(EVENTO, alCambiar);
  return () => {
    window.removeEventListener("storage", alCambiar);
    window.removeEventListener(EVENTO, alCambiar);
  };
}

// Si lo guardado tenía el año real o una fecha imposible, se reescribe limpio (una sola vez).
function migrarCumple(texto: string | null, cuenta: Cuenta | null) {
  if (!texto || !cuenta || usarMemoria) return;
  try {
    const crudo = JSON.parse(texto) as Partial<Cuenta>;
    if (crudo.nacimiento === cuenta.nacimiento) return;
    const limpio = JSON.stringify({ ...crudo, nacimiento: cuenta.nacimiento });
    localStorage.setItem(CLAVE, limpio);
    cacheTexto = limpio;
    const clave = clavePrefs(cuenta.correo);
    const prefs = JSON.parse(localStorage.getItem(clave) ?? "null") as Partial<Cuenta> | null;
    if (prefs && typeof prefs === "object") {
      localStorage.setItem(clave, JSON.stringify({ ...prefs, nacimiento: cuenta.nacimiento }));
    }
  } catch {
    // si no se puede escribir, se queda como estaba
  }
}

// Devuelve true si quedó guardado en el navegador; false si solo quedó en memoria (se pierde al cerrar).
// El color y el correo de los padres se guardan aparte por cuenta, para que no se pierdan al salir.
const clavePrefs = (correo: string) => `iae-life:prefs:${correo}`;
type Prefs = Pick<Cuenta, "correoPadres" | "color" | "idioma" | "genero" | "nacimiento" | "tema" | "notif">;

function conPrefs(cuenta: Cuenta): Cuenta {
  // Al entrar (sin color elegido aún), se recupera lo que esa cuenta había guardado.
  if (cuenta.color !== undefined) {
    try {
      const prefs: Prefs = {
        correoPadres: cuenta.correoPadres,
        color: cuenta.color,
        idioma: cuenta.idioma,
        genero: cuenta.genero,
        nacimiento: cuenta.nacimiento,
        tema: cuenta.tema,
        notif: cuenta.notif,
      };
      localStorage.setItem(clavePrefs(cuenta.correo), JSON.stringify(prefs));
    } catch {
      // sin espacio o modo privado: se queda solo en la cuenta
    }
    return cuenta;
  }
  try {
    const prefs = JSON.parse(localStorage.getItem(clavePrefs(cuenta.correo)) ?? "null") as Prefs | null;
    if (prefs && typeof prefs === "object") {
      return {
        ...cuenta,
        color: typeof prefs.color === "string" ? prefs.color : undefined,
        correoPadres: typeof prefs.correoPadres === "string" ? prefs.correoPadres : undefined,
        idioma: prefs.idioma === "en" || prefs.idioma === "es" ? prefs.idioma : undefined,
        ...ajustesValidos(prefs),
      };
    }
  } catch {
    // nada guardado
  }
  return cuenta;
}

export function guardarCuenta(cuenta: Cuenta | null): boolean {
  if (cuenta) cuenta = conPrefs(cuenta);
  const texto = cuenta ? JSON.stringify(cuenta) : null;
  enMemoria = texto;
  let guardado = false;
  if (!usarMemoria) {
    try {
      if (texto) localStorage.setItem(CLAVE, texto);
      else localStorage.removeItem(CLAVE);
      guardado = true;
    } catch {
      usarMemoria = true;
    }
  }
  window.dispatchEvent(new Event(EVENTO));
  return guardado;
}

// Al salir se borran también los ajustes de esa cuenta en este navegador (por si es una compu compartida).
export function salir() {
  const actual = obtener();
  if (actual) {
    try {
      localStorage.removeItem(clavePrefs(actual.correo));
    } catch {
      // modo privado: no había nada guardado
    }
  }
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
    const base64 = parte
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(parte.length / 4) * 4, "=");
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const datos = JSON.parse(new TextDecoder().decode(bytes)) as {
      email?: string;
      email_verified?: boolean;
      hd?: string;
      name?: string;
    };
    if (!datos.email || datos.email_verified === false || datos.hd !== DOMINIO) return null;
    const info = leerCorreo(datos.email);
    if (!info) return null;
    return {
      nombre: datos.name?.trim() || datos.email.split("@")[0],
      correo: datos.email.toLowerCase(),
      ...info,
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
