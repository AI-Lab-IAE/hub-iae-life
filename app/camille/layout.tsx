import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Colegio",
  description: "Mapa, contactos, clubes, calendario y reglas del IAE.",
};

// Colegio usa el marco de IAE LIFE (barra de arriba y de abajo del layout común): sin menú ni logo propios.
export default function Layout({ children }: LayoutProps<"/camille">) {
  return children;
}
