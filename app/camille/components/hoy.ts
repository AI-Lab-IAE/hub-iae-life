import { useSyncExternalStore } from "react";
import { horarioSecundaria } from "../datos";

const sinCambios = () => () => {};

// Fecha de hoy en este dispositivo, como "2026-11-10". En el servidor es null,
// así la página no muestra una fecha distinta a la del celular.
function fechaLocal() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

export function useHoy() {
  return useSyncExternalStore(sinCambios, fechaLocal, () => null);
}

// Revisa la hora cada 30 segundos.
function cadaMedioMinuto(aviso: () => void) {
  const id = setInterval(aviso, 30_000);
  return () => clearInterval(id);
}

function minutosAhora() {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

// Minutos desde la medianoche en este dispositivo (null en el servidor).
export function useAhora() {
  return useSyncExternalStore(cadaMedioMinuto, minutosAhora, () => null);
}

// Días que faltan desde hoy hasta una fecha (negativo si ya pasó).
export function diasHasta(hoy: string, fecha: string) {
  const dia = 24 * 60 * 60 * 1000;
  return Math.round((Date.parse(`${fecha}T12:00:00`) - Date.parse(`${hoy}T12:00:00`)) / dia);
}

export function textoFaltan(dias: number) {
  if (dias === 0) return "Hoy";
  if (dias === 1) return "Mañana";
  if (dias < 0) return "Ya pasó";
  return `En ${dias} días`;
}

// Hora de salida de secundaria hoy; null el sábado y el domingo.
export function salidaDeHoy(hoy: string) {
  const diaSemana = new Date(`${hoy}T12:00:00`).getDay();
  if (diaSemana === 0 || diaSemana === 6) return null;
  return diaSemana === 5 ? horarioSecundaria.salidaViernes : horarioSecundaria.salida;
}

// Qué pasa hoy en secundaria: fin de semana o la hora de salida.
export function resumenDelDia(hoy: string) {
  const nombre = new Date(`${hoy}T12:00:00`).toLocaleDateString("es-PA", { weekday: "long" });
  const salida = salidaDeHoy(hoy);
  if (!salida) return { nombre, texto: "No hay clases. ¡Buen fin de semana!" };
  // Espacios que no se cortan, para que "3:30 p. m." no se parta en dos líneas.
  const junto = (hora: string) => hora.replaceAll(" ", " ");
  return { nombre, texto: `Entrada ${junto(horarioSecundaria.entrada)} · Salida ${junto(salida)}` };
}
