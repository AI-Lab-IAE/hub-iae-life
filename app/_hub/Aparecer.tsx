"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Hace aparecer su contenido (sube y se endereza en 3D) cuando entra en pantalla.
export default function Aparecer({
  children,
  retraso = 0,
  className = "",
}: {
  children: ReactNode;
  retraso?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("hub-visible");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`hub-aparecer ${className}`} style={{ transitionDelay: `${retraso}ms` }}>
      {children}
    </div>
  );
}
