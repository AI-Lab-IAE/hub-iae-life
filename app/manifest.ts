import type { MetadataRoute } from "next";

// Permite instalar IAE LIFE en el celular como una app.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IAE LIFE",
    short_name: "IAE LIFE",
    description: "La app para la vida escolar del IAE.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1d3a8a",
    lang: "es",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
