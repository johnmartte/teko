"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

const CELL_SIZE = 62;

export default function HeroGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cellsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lastIndexRef = useRef<number | null>(null);
  const [dims, setDims] = useState({ cols: 0, rows: 0 });

  useEffect(() => {
    const calc = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDims({
        cols: Math.ceil(width / CELL_SIZE) + 1,
        rows: Math.ceil(height / CELL_SIZE) + 1,
      });
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  useEffect(() => {
    if (!dims.cols || !dims.rows) return;
    if (prefersReducedMotion()) return;

    const lightUp = (index: number) => {
      const cell = cellsRef.current[index];
      if (!cell) return;
      gsap.to(cell, {
        backgroundColor: "rgba(255, 255, 255, 0.35)",
        duration: 0.25,
        ease: "power2.out",
      });
    };

    const fadeOut = (index: number) => {
      const cell = cellsRef.current[index];
      if (!cell) return;
      gsap.to(cell, {
        backgroundColor: "rgba(255, 255, 255, 0)",
        duration: 0.8,
        ease: "power2.out",
      });
    };

    const onMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Si el cursor está fuera del hero (ej. cuando scrollea a otra sección), fadeout
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        if (lastIndexRef.current !== null) {
          fadeOut(lastIndexRef.current);
          lastIndexRef.current = null;
        }
        return;
      }

      const col = Math.floor(x / CELL_SIZE);
      const row = Math.floor(y / CELL_SIZE);

      if (col < 0 || row < 0 || col >= dims.cols || row >= dims.rows) return;

      const index = row * dims.cols + col;
      if (index === lastIndexRef.current) return;

      if (lastIndexRef.current !== null) fadeOut(lastIndexRef.current);
      lightUp(index);
      lastIndexRef.current = index;
    };

    // Listener a nivel window para que funcione también debajo del header fijo
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, [dims]);

  const total = dims.cols * dims.rows;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 grid [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.7)_45%,rgba(0,0,0,0.25)_75%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.7)_45%,rgba(0,0,0,0.25)_75%,transparent_100%)]"
      style={{
        gridTemplateColumns: `repeat(${dims.cols}, ${CELL_SIZE}px)`,
        gridTemplateRows: `repeat(${dims.rows}, ${CELL_SIZE}px)`,
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            cellsRef.current[i] = el;
          }}
          className="border-[0.5px] border-white/[0.28]"
          style={{ backgroundColor: "rgba(255, 255, 255, 0)" }}
        />
      ))}
    </div>
  );
}
