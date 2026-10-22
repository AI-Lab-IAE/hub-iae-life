"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Escena 3D del inicio: un núcleo (IAE LIFE) con un nodo en órbita por cada módulo,
// conectados por líneas por donde viajan pulsos de luz. Sigue al ratón.
export default function Escena3D({ colores }: { colores: string[] }) {
  const contenedor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = contenedor.current;
    if (!div) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // Sin WebGL queda el fondo de CSS.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    const lienzo = renderer.domElement;
    lienzo.style.width = "100%";
    lienzo.style.height = "100%";
    lienzo.style.display = "block";
    div.appendChild(lienzo);

    const desechables: { dispose(): void }[] = [];
    const guardar = <T extends { dispose(): void }>(x: T) => {
      desechables.push(x);
      return x;
    };

    const escena = new THREE.Scene();
    const camara = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camara.position.set(0, 0, 10);

    const brillo = guardar(texturaBrillo());
    const aditivo = { transparent: true, blending: THREE.AdditiveBlending, depthWrite: false } as const;

    const raiz = new THREE.Group();
    const sistema = new THREE.Group();
    raiz.add(sistema);
    escena.add(raiz);

    // Núcleo: dos poliedros de alambre y una esfera de puntos que late.
    const nucleo = new THREE.LineSegments(
      guardar(new THREE.EdgesGeometry(guardar(new THREE.IcosahedronGeometry(1.35, 1)))),
      guardar(new THREE.LineBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.7 })),
    );
    const cascara = new THREE.LineSegments(
      guardar(new THREE.EdgesGeometry(guardar(new THREE.IcosahedronGeometry(1.9, 0)))),
      guardar(new THREE.LineBasicMaterial({ color: 0xc4b5fd, transparent: true, opacity: 0.3 })),
    );
    const puntos = new THREE.Points(
      guardar(new THREE.IcosahedronGeometry(0.9, 6)),
      guardar(new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, map: brillo, opacity: 0.9, ...aditivo })),
    );
    const halo = new THREE.Sprite(
      guardar(new THREE.SpriteMaterial({ map: brillo, color: 0x38bdf8, opacity: 0.8, ...aditivo })),
    );
    halo.scale.setScalar(5.5);
    sistema.add(nucleo, cascara, puntos, halo);

    // Un nodo por módulo, cada uno en su propia órbita inclinada.
    const esferaGeo = guardar(new THREE.SphereGeometry(0.12, 24, 16));
    const nodos = colores.map((hex, i) => {
      const color = new THREE.Color(hex);
      const orbita = new THREE.Group();
      orbita.rotation.set(0.4 + i * 0.55, 0, (i - (colores.length - 1) / 2) * 0.4);
      sistema.add(orbita);

      const radio = 2.7 + (i % 3) * 0.55;
      const anillo = new THREE.Mesh(
        guardar(new THREE.TorusGeometry(radio, 0.006, 6, 256)),
        guardar(new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.25 })),
      );
      anillo.rotation.x = Math.PI / 2;
      orbita.add(anillo);

      const esfera = new THREE.Mesh(esferaGeo, guardar(new THREE.MeshBasicMaterial({ color })));
      const aura = new THREE.Sprite(guardar(new THREE.SpriteMaterial({ map: brillo, color, ...aditivo })));
      aura.scale.setScalar(1.3);
      esfera.add(aura);
      orbita.add(esfera);

      const lineaGeo = guardar(new THREE.BufferGeometry());
      lineaGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
      const linea = new THREE.Line(
        lineaGeo,
        guardar(new THREE.LineBasicMaterial({ color, opacity: 0.35, ...aditivo })),
      );
      linea.frustumCulled = false;
      sistema.add(linea);

      const pulsoMat = guardar(new THREE.SpriteMaterial({ map: brillo, color, ...aditivo }));
      const pulso = new THREE.Sprite(pulsoMat);
      pulso.scale.setScalar(0.45);
      sistema.add(pulso);

      return { esfera, linea, pulso, pulsoMat, radio, velocidad: 0.16 + i * 0.035, fase: (i / colores.length) * Math.PI * 2 };
    });

    // Polvo de estrellas alrededor.
    const N = 1600;
    const posiciones = new Float32Array(N * 3);
    const tonos = new Float32Array(N * 3);
    const cian = new THREE.Color(0x67e8f9);
    const violeta = new THREE.Color(0xa78bfa);
    const tono = new THREE.Color();
    for (let i = 0; i < N; i++) {
      const u = Math.random() * 2 - 1;
      const a = Math.random() * Math.PI * 2;
      const r = 5 + Math.random() * 11;
      const s = Math.sqrt(1 - u * u);
      posiciones.set([Math.cos(a) * s * r, u * r, Math.sin(a) * s * r], i * 3);
      tono.lerpColors(cian, violeta, Math.random());
      tonos.set([tono.r, tono.g, tono.b], i * 3);
    }
    const polvoGeo = guardar(new THREE.BufferGeometry());
    polvoGeo.setAttribute("position", new THREE.BufferAttribute(posiciones, 3));
    polvoGeo.setAttribute("color", new THREE.BufferAttribute(tonos, 3));
    const polvo = new THREE.Points(
      polvoGeo,
      guardar(new THREE.PointsMaterial({ size: 0.07, map: brillo, vertexColors: true, opacity: 0.8, ...aditivo })),
    );
    escena.add(polvo);

    // El ratón inclina la escena.
    const raton = { x: 0, y: 0 };
    const actual = { x: 0, y: 0 };
    const alMover = (e: PointerEvent) => {
      raton.x = (e.clientX / window.innerWidth) * 2 - 1;
      raton.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", alMover, { passive: true });

    const ajustar = () => {
      const w = div.clientWidth;
      const h = div.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camara.aspect = w / h;
      const vertical = camara.aspect < 0.9;
      camara.position.z = vertical ? 15 : 10.5;
      raiz.position.x = camara.aspect > 1.2 ? Math.min(4, (camara.aspect - 1) * 3.5) : 0;
      raiz.position.y = vertical ? 2.6 : 0;
      camara.updateProjectionMatrix();
    };

    const v = new THREE.Vector3();
    const dibujar = (t: number) => {
      actual.x += (raton.x - actual.x) * 0.04;
      actual.y += (raton.y - actual.y) * 0.04;
      raiz.rotation.y = actual.x * 0.4;
      raiz.rotation.x = actual.y * 0.25;
      sistema.rotation.y = t * 0.06;

      nucleo.rotation.set(t * 0.2, t * 0.3, 0);
      cascara.rotation.set(-t * 0.1, -t * 0.14, 0);
      const latido = Math.sin(t * 2.2);
      puntos.scale.setScalar(1 + latido * 0.05);
      halo.material.opacity = 0.7 + latido * 0.12;

      nodos.forEach((n, i) => {
        const a = n.fase + t * n.velocidad;
        n.esfera.position.set(Math.cos(a) * n.radio, 0, Math.sin(a) * n.radio);
        n.esfera.getWorldPosition(v);
        sistema.worldToLocal(v);
        const pos = n.linea.geometry.attributes.position as THREE.BufferAttribute;
        pos.setXYZ(1, v.x, v.y, v.z);
        pos.needsUpdate = true;
        const f = (t * 0.45 + i * 0.23) % 1;
        n.pulso.position.copy(v).multiplyScalar(f);
        n.pulsoMat.opacity = Math.sin(f * Math.PI);
      });

      polvo.rotation.y = t * 0.015;
      polvo.rotation.x = t * 0.006;
      renderer.render(escena, camara);
    };

    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const inicio = performance.now();
    let cuadro = 0;
    const bucle = (ahora: number) => {
      dibujar((ahora - inicio) / 1000);
      cuadro = requestAnimationFrame(bucle);
    };
    const arrancar = () => {
      if (!cuadro && !reducir) cuadro = requestAnimationFrame(bucle);
    };
    const parar = () => {
      cancelAnimationFrame(cuadro);
      cuadro = 0;
    };

    // Solo anima mientras se ve en pantalla.
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? arrancar() : parar()));
    io.observe(div);
    const ro = new ResizeObserver(() => {
      ajustar();
      if (reducir) dibujar(6);
    });
    ro.observe(div);

    ajustar();
    dibujar(reducir ? 6 : 0);
    div.dataset.listo = "true";

    return () => {
      parar();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", alMover);
      desechables.forEach((d) => d.dispose());
      renderer.dispose();
      lienzo.remove();
    };
  }, [colores]);

  return <div ref={contenedor} className="hub-escena" aria-hidden />;
}

// Textura redonda y difusa para halos, pulsos y partículas.
function texturaBrillo() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, "rgba(255,255,255,1)");
  r.addColorStop(0.2, "rgba(255,255,255,0.6)");
  r.addColorStop(0.5, "rgba(255,255,255,0.12)");
  r.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
