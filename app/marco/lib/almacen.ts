import type { Sesion } from "./mapa";

const CLAVE = "estudia:sesiones:v1";

export function leerSesiones(): Sesion[] {
  try {
    const crudo = localStorage.getItem(CLAVE);
    return crudo ? (JSON.parse(crudo) as Sesion[]) : [];
  } catch (error) {
    console.error("[almacen] no pude leer las sesiones guardadas:", error);
    return [];
  }
}

export function guardarSesion(sesion: Sesion) {
  try {
    const otras = leerSesiones().filter((s) => s.id !== sesion.id);
    localStorage.setItem(CLAVE, JSON.stringify([sesion, ...otras].slice(0, 20)));
  } catch (error) {
    console.error("[almacen] no pude guardar la sesión:", error);
  }
}

export function borrarSesion(id: string) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(leerSesiones().filter((s) => s.id !== id)));
  } catch (error) {
    console.error("[almacen] no pude borrar la sesión:", error);
  }
}

export function borrarTodo() {
  try {
    localStorage.removeItem(CLAVE);
  } catch (error) {
    console.error("[almacen] no pude borrar los datos:", error);
  }
}
