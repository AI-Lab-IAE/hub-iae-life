import { EncabezadoSeccion } from "../components/EncabezadoSeccion";
import { ListaEventos } from "../components/ListaEventos";
import { Pantalla } from "../components/Pantalla";

export default function Page() {
  return (
    <Pantalla>
      <EncabezadoSeccion ruta="calendario" />
      <div className="mt-6">
        <ListaEventos />
      </div>
    </Pantalla>
  );
}
