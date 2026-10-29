import { EncabezadoSeccion } from "../components/EncabezadoSeccion";
import { ListaContactos } from "../components/ListaContactos";
import { Pantalla } from "../components/Pantalla";

export default function Page() {
  return (
    <Pantalla>
      <EncabezadoSeccion ruta="contactos" />
      <div className="mt-6">
        <ListaContactos />
      </div>
    </Pantalla>
  );
}
