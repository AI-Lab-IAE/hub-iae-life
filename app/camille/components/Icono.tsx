// Íconos dibujados en SVG, del mismo estilo para toda la app.
const trazos = {
  inicio: (
    <>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </>
  ),
  anuncios: (
    <>
      <path d="M3 10v4h3l7 4V6l-7 4H3z" />
      <path d="M17 9a4 4 0 0 1 0 6" />
    </>
  ),
  calendario: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  contactos: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M16 14.5a5 5 0 0 1 5.5 5.5" />
    </>
  ),
  mapa: (
    <>
      <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  informacion: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6" />
      <circle cx="12" cy="7.75" r="0.6" fill="currentColor" />
    </>
  ),
  atras: <path d="M15 5l-7 7 7 7" />,
  adelante: <path d="M9 5l7 7-7 7" />,
  correo: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  ubicacion: (
    <>
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  reloj: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  perfil: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  buscar: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </>
  ),
  editar: (
    <>
      <path d="M4 20h4L19 9l-4-4L4 16z" />
      <path d="M13 7l4 4" />
    </>
  ),
  basura: (
    <>
      <path d="M4 7h16M10 11v6M14 11v6" />
      <path d="M6 7l1 13h10l1-13M9 7V4h6v3" />
    </>
  ),
  check: <path d="M5 12l5 5L20 7" />,
  escudo: (
    <>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  puerta: (
    <>
      <path d="M6 21V4h12v17M3 21h18" />
      <circle cx="14.5" cy="12.5" r="0.6" fill="currentColor" />
    </>
  ),
  maletin: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5h6v2M3 13h18" />
    </>
  ),
  campana: (
    <>
      <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" />
      <path d="M10 21h4" />
    </>
  ),
  arbol: (
    <>
      <path d="M12 3a5 5 0 0 1 5 5 4 4 0 0 1-1 7.5H8A4 4 0 0 1 7 8a5 5 0 0 1 5-5z" />
      <path d="M12 15.5V21M9 21h6" />
    </>
  ),
  libro: (
    <>
      <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" />
      <path d="M4 21V5M8 7h7" />
    </>
  ),
  estrella: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
  lista: (
    <>
      <path d="M4 6l1.5 1.5L8 5M4 12l1.5 1.5L8 11M4 18l1.5 1.5L8 17" />
      <path d="M12 6.5h8M12 12.5h8M12 18.5h8" />
    </>
  ),
  mas: <path d="M12 5v14M5 12h14" />,
  pregunta: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.8 2.1c-.8.5-1.3 1-1.3 1.9" />
      <circle cx="12" cy="16.75" r="0.6" fill="currentColor" />
    </>
  ),
  robot: (
    <>
      <rect x="4" y="8" width="16" height="12" rx="3" />
      <path d="M12 4v4M9 13v1M15 13v1M9 17h6" />
      <circle cx="12" cy="3.5" r="0.6" fill="currentColor" />
    </>
  ),
  corona: <path d="M4 18L3 7l5 4 4-7 4 7 5-4-1 11zM5 21h14" />,
  paleta: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2 0-1.5 1-2.5 2.5-2.5H18a3 3 0 0 0 3-3C21 7 17 3 12 3z" />
      <circle cx="8" cy="11" r="0.8" fill="currentColor" />
      <circle cx="12" cy="7.5" r="0.8" fill="currentColor" />
      <circle cx="16" cy="10" r="0.8" fill="currentColor" />
    </>
  ),
  musica: (
    <>
      <path d="M9 18V6l11-2v12" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="17.5" cy="16" r="2.5" />
    </>
  ),
  burbuja: (
    <>
      <path d="M21 12a8 8 0 0 1-8 8H4l2-3.5A8 8 0 1 1 21 12z" />
      <path d="M9 10.5h7M9 14h4" />
    </>
  ),
};

export type NombreIcono = keyof typeof trazos;

export function Icono({ nombre, className = "size-6" }: { nombre: NombreIcono; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {trazos[nombre]}
    </svg>
  );
}
