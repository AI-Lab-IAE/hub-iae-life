export default function Page() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
      <h1 className="text-3xl font-bold">EstudIA</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Encuentra lo que no sabes antes del examen.
      </p>
      <p className="mt-6 text-zinc-600 dark:text-zinc-400">
        Sube tus apuntes y la IA arma un quiz por tema. Con tus respuestas, EstudIA te muestra
        un mapa de lo que ya dominas, lo frágil, lo que falta aprender y tus{" "}
        <strong>puntos ciegos</strong>: los temas donde respondiste seguro pero estabas mal.
      </p>
      <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-500">
        El diagnóstico todavía se arma en la versión aparte de EstudIA — se está moviendo aquí
        adentro para el MVP del 13 de noviembre.
      </p>
    </main>
  );
}
