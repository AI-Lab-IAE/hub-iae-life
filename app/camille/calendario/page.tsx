import { ListaEventos } from "../components/ListaEventos";
import { Seccion } from "../components/Seccion";

export default function Page() {
  return (
    <Seccion ruta="calendario">
      <div className="mt-6">
        <ListaEventos />
      </div>
    </Seccion>
  );
}
