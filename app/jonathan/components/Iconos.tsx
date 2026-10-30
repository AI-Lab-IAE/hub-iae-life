import type { CSSProperties, ReactNode } from "react";

/* ---------- Iconos (SVG inline, trazo simple) ---------- */

type IconProps = { className?: string; style?: CSSProperties };
export type IconComponent = (p: IconProps) => ReactNode;

function svg(children: ReactNode, strokeWidth = "1.8", extra: { strokeLinecap?: "round" } = {}): IconComponent {
  function SvgIcon({ className, style }: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className={className}
        style={style}
        width="1em"
        height="1em"
        {...extra}
      >
        {children}
      </svg>
    );
  }
  return SvgIcon;
}

export const Icon = {
  home: svg(
    <>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-9" />
      <path d="M9.5 20v-6h5v6" />
    </>,
  ),
  plus: svg(<path d="M12 5v14M5 12h14" />, "2"),
  clock: svg(
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>,
  ),
  history: svg(
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
      <path d="M12 8v4l3 2" />
    </>,
  ),
  calendar: svg(
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </>,
  ),
  user: svg(
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5" />
    </>,
  ),
  check: svg(<path d="M4 12.5l5 5L20 6.5" />, "2.2"),
  chevronRight: svg(<path d="M9 5l7 7-7 7" />, "2"),
  sparkles: svg(
    <>
      <path d="M12 4v3M12 17v3M4 12h3M17 12h3M6.5 6.5l2 2M15.5 15.5l2 2M17.5 6.5l-2 2M8.5 15.5l-2 2" />
      <circle cx="12" cy="12" r="2.3" />
    </>,
    "1.7",
  ),
  x: svg(<path d="M6 6l12 12M18 6L6 18" />, "2.4", { strokeLinecap: "round" }),
};
