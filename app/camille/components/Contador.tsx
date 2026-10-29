"use client";

import { useEffect, useState } from "react";

// Número que sube desde 0 hasta su valor al aparecer en pantalla.
export function Contador({ valor, duracion = 900 }: { valor: number; duracion?: number }) {
  const [actual, setActual] = useState(0);

  useEffect(() => {
    let cuadro = 0;
    const inicio = performance.now();
    const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function paso(ahora: number) {
      const avance = sinMovimiento ? 1 : Math.min((ahora - inicio) / duracion, 1);
      // Empieza rápido y frena al final.
      setActual(Math.round(valor * (1 - Math.pow(1 - avance, 3))));
      if (avance < 1) cuadro = requestAnimationFrame(paso);
    }
    cuadro = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(cuadro);
  }, [valor, duracion]);

  return <span className="tabular-nums">{actual}</span>;
}
