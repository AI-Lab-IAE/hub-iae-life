import type { Metadata } from "next";
import Hoy from "./Hoy";

export const metadata: Metadata = { title: "Hoy" };

export default function Pagina() {
  return <Hoy />;
}
