import { EncabezadoSeccion } from "../components/EncabezadoSeccion";
import { ListaPendientes } from "../components/ListaPendientes";
import { Pantalla } from "../components/Pantalla";

export default function Page() {
  return (
    <Pantalla>
      <EncabezadoSeccion ruta="pendientes" />
      <div className="mt-6">
        <ListaPendientes />
      </div>
    </Pantalla>
  );
}
