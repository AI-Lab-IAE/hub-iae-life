import type { Metadata } from "next";
import Perfil from "./Perfil";

export const metadata: Metadata = {
  title: "Mi perfil",
};

export default function Pagina() {
  return <Perfil />;
}
