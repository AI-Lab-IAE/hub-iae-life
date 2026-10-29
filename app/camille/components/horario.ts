import { bloquesSecundaria, semanaSecundaria } from "../datos";

// Bloques de un día de secundaria (0 = lunes ... 4 = viernes): numera las clases
// (Clase número 1, 2, 3...) y quita las que no hay ese día. El viernes no hay almuerzo.
export function filasDelDia(indice: number) {
  const dia = semanaSecundaria[indice];
  const esViernes = dia.dia === "Viernes";
  let numero = 0;
  return bloquesSecundaria
    .map((b) => (b.tipo === "clase" ? { ...b, clase: ++numero } : { ...b, clase: undefined }))
    .filter((b) => b.clase === undefined || b.clase <= dia.clases)
    .filter((b) => !(esViernes && b.nombre === "Almuerzo"));
}

// "13:25" → minutos desde la medianoche (805).
export function aMinutos(hora: string) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}
