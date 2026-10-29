import { Icono } from "./Icono";
import { coloresAvatar, iniciales, type Perfil } from "./perfil";

// Círculo con las iniciales del perfil. Sin perfil, muestra el ícono de persona.
export function Avatar({ perfil, className = "size-9 text-sm" }: { perfil: Perfil | null; className?: string }) {
  if (!perfil) {
    return (
      <span className={`flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 ${className}`}>
        <Icono nombre="perfil" className="size-1/2" />
      </span>
    );
  }
  return (
    <span
      className={`flex items-center justify-center rounded-full bg-linear-to-br font-bold text-white shadow-sm ${coloresAvatar[perfil.color]} ${className}`}
    >
      {iniciales(perfil.nombre)}
    </span>
  );
}
