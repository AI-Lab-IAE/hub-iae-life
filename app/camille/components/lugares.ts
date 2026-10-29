import type { NombreIcono } from "./Icono";

// Ícono y colores de cada tipo de lugar: "color" para chips e íconos, "pin" y "punta" para el mapa.
export const tiposLugar: Record<string, { icono: NombreIcono; color: string; pin: string; punta: string; plural: string }> = {
  Salón: {
    icono: "libro",
    color: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    pin: "bg-sky-600",
    punta: "border-t-sky-600",
    plural: "Salones",
  },
  Oficina: {
    icono: "maletin",
    color: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
    pin: "bg-violet-600",
    punta: "border-t-violet-600",
    plural: "Oficinas",
  },
  Servicio: {
    icono: "campana",
    color: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
    pin: "bg-rose-600",
    punta: "border-t-rose-600",
    plural: "Servicios",
  },
  Acceso: {
    icono: "puerta",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    pin: "bg-amber-600",
    punta: "border-t-amber-600",
    plural: "Accesos",
  },
  Exterior: {
    icono: "arbol",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    pin: "bg-emerald-600",
    punta: "border-t-emerald-600",
    plural: "Exteriores",
  },
};
