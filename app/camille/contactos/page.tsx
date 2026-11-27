import { ListaContactos } from "../components/ListaContactos";
import { Seccion } from "../components/Seccion";

export default function Page() {
  return (
    <Seccion ruta="contactos">
      <div className="mt-6">
        <ListaContactos />
      </div>
    </Seccion>
  );
}
