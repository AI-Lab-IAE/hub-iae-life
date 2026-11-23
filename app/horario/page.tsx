import type { Metadata } from "next";
import Horario from "./Horario";

export const metadata: Metadata = {
  title: "Mi horario",
};

export default function Pagina() {
  return <Horario />;
}
