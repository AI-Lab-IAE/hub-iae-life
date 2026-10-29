export type ArchivoListo = {
  nombre: string;
  tipo: "image/jpeg" | "image/png" | "image/webp" | "application/pdf";
  datos: string;
  vista?: string;
  bytes: number;
};

const LADO_MAXIMO = 1568;
const DIMENSION_MINIMA = 250;
const PDF_MAXIMO = 3 * 1024 * 1024;
// Los archivos viajan en base64 (+33%) y Vercel rechaza pedidos de más de 4.5 MB (decimales):
// 3 MiB en base64 son ~4.19 MB, y quedan ~300 KB para el texto pegado y el resto del JSON.
export const TOTAL_MAXIMO = 3 * 1024 * 1024;

function aBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binario = "";
  const paso = 0x8000;
  for (let i = 0; i < bytes.length; i += paso) {
    binario += String.fromCharCode(...bytes.subarray(i, i + paso));
  }
  return btoa(binario);
}

async function reducirImagen(archivo: File): Promise<ArchivoListo> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(archivo);
  } catch {
    throw new Error(
      `No pude abrir "${archivo.name}". Si es una foto HEIC del iPhone, compártela como JPG o haz una captura de pantalla.`,
    );
  }
  if (Math.min(bitmap.width, bitmap.height) < DIMENSION_MINIMA) {
    const { width, height } = bitmap;
    bitmap.close();
    throw new Error(
      `"${archivo.name}" es muy pequeña (${width}×${height}px) para leerse bien. Sube la foto original, sin recortarla ni reducirla, o tómala de nuevo más de cerca.`,
    );
  }
  const escala = Math.min(1, LADO_MAXIMO / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Tu navegador no pudo procesar la imagen.");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const url = canvas.toDataURL("image/jpeg", 0.82);
  const datos = url.slice(url.indexOf(",") + 1);
  return {
    nombre: archivo.name,
    tipo: "image/jpeg",
    datos,
    vista: url,
    bytes: Math.round((datos.length * 3) / 4),
  };
}

export async function prepararArchivo(archivo: File): Promise<ArchivoListo> {
  if (archivo.type === "application/pdf" || archivo.name.toLowerCase().endsWith(".pdf")) {
    if (archivo.size > PDF_MAXIMO) {
      throw new Error(`"${archivo.name}" pesa más de 3 MB. Sube solo las páginas del tema del examen.`);
    }
    return {
      nombre: archivo.name,
      tipo: "application/pdf",
      datos: aBase64(await archivo.arrayBuffer()),
      bytes: archivo.size,
    };
  }
  if (archivo.type.startsWith("image/") || /\.(heic|heif)$/i.test(archivo.name)) {
    return reducirImagen(archivo);
  }
  throw new Error(`"${archivo.name}" no es una foto ni un PDF.`);
}

export function formatoPeso(bytes: number): string {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
