export async function llamarAPI<T>(ruta: string, cuerpo: unknown, signal?: AbortSignal): Promise<T> {
  let respuesta: Response;
  try {
    respuesta = await fetch(ruta, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new Error("No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.");
  }

  const texto = await respuesta.text();
  let datos: unknown = null;
  try {
    datos = texto ? JSON.parse(texto) : null;
  } catch {
    console.error(`[api] respuesta no JSON de ${ruta} (${respuesta.status}):`, texto.slice(0, 200));
  }

  if (!respuesta.ok) {
    const mensaje = (datos as { error?: string } | null)?.error;
    if (mensaje) throw new Error(mensaje);
    if (respuesta.status === 413) throw new Error("Los archivos pesan demasiado. Sube menos fotos o un PDF más corto.");
    if (respuesta.status === 504) throw new Error("La IA tardó demasiado. Prueba con menos material a la vez.");
    throw new Error(`El servidor respondió con un error (${respuesta.status}). Inténtalo de nuevo.`);
  }
  if (datos === null) throw new Error("El servidor devolvió una respuesta vacía. Inténtalo de nuevo.");
  return datos as T;
}
