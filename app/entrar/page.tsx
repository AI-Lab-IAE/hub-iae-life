import type { Metadata } from "next";
import Entrar from "./Entrar";

export const metadata: Metadata = {
  title: "Entrar",
};

export default function Pagina() {
  return <Entrar clienteGoogle={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""} />;
}
