import { redirect } from "next/navigation";

// Hoy ahora es la portada (/). Los enlaces viejos a /hoy siguen funcionando.
export default function Pagina() {
  redirect("/");
}
