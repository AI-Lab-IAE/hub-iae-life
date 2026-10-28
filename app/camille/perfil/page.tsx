import { EditorPerfil } from "../components/EditorPerfil";
import { Pantalla } from "../components/Pantalla";

export default function Page() {
  return (
    <Pantalla>
      <div className="mx-auto max-w-lg">
        <EditorPerfil />
      </div>
    </Pantalla>
  );
}
