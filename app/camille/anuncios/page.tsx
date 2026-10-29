import { EncabezadoSeccion } from "../components/EncabezadoSeccion";
import { ListaAnuncios } from "../components/ListaAnuncios";
import { Pantalla } from "../components/Pantalla";

export default function Page() {
  return (
    <Pantalla>
      <EncabezadoSeccion ruta="anuncios" />
      <div className="mt-6">
        <ListaAnuncios />
      </div>
    </Pantalla>
  );
}
