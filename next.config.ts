import type { NextConfig } from "next";

// IAE LIFE es una sola app: cada función tiene su ruta (/estudiar, /tareas…).
// Mientras se hace la unión real, cada ruta muestra la carpeta del estudiante sin cambiar la dirección.
const RUTAS: Record<string, string> = {
  estudiar: "marco",
  tareas: "daniela",
  avisos: "abraham",
  ausencia: "jonathan",
  colegio: "camille",
};

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  async rewrites() {
    return Object.entries(RUTAS).flatMap(([funcion, carpeta]) => [
      { source: `/${funcion}`, destination: `/${carpeta}` },
      { source: `/${funcion}/:ruta*`, destination: `/${carpeta}/:ruta*` },
    ]);
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
