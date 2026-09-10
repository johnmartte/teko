"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { id: 1, title: "Investigación", desc: "Entendemos tu negocio, usuarios y objetivos para definir el alcance.", highlight: true },
  { id: 2, title: "Estrategia", desc: "Arquitectura, roadmap y métricas de éxito del producto digital." },
  { id: 3, title: "Diseño", desc: "Wireframes, prototipos interactivos y el sistema de diseño visual." },
  { id: 4, title: "Desarrollo", desc: "Código limpio, sprints ágiles y revisiones continuas." },
  { id: 5, title: "Lanzamiento", desc: "Desplegamos, monitoreamos y optimizamos para un lanzamiento impecable." },
];

export default function SectionNuestroProcesoTrabajo() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const items = sectionRef.current?.querySelectorAll("[data-reveal]");
      if (items) {
        items.forEach((el) => {
          const rect = (el as HTMLElement).getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.9) return;
          gsap.set(el, { opacity: 0, y: 18 });
          gsap.to(el, {
            opacity: 1, y: 0, duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} data-reveal="" className="relative z-[2] mx-auto max-w-[1200px] px-6 pt-[120px]" style={{ color: "#f2f3f5" }}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-[620px]">
          <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.08em]" style={{ color: "rgba(242,243,245,0.55)" }}>
            <span className="h-1.5 w-1.5 rounded-full bg-[#1ec4ff]" style={{ boxShadow: "0 0 12px #1ec4ff" }} />
            Proceso de trabajo
          </p>
          <h2 className="mt-[18px] text-[clamp(32px,4vw,54px)] font-semibold leading-[1.02] tracking-[-0.035em]" style={{ textWrap: "balance" }}>
            Un método probado en más de 50 proyectos.
          </h2>
        </div>
        <p className="max-w-[36ch] text-[15px] font-light leading-[1.55]" style={{ color: "rgba(242,243,245,0.6)" }}>
          Reduce la incertidumbre y maximiza resultados. Cinco etapas, siempre en el mismo orden.
        </p>
      </div>

      <ol className="mt-14 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((s) => (
          <li key={s.id} data-reveal="" className="flex min-h-[230px] flex-col items-start rounded-[18px] border p-[24px_22px]" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
            <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-full text-[13px] font-semibold" style={{
              border: s.highlight ? "1px solid rgba(30,196,255,0.5)" : "1px solid rgba(255,255,255,0.18)",
              color: s.highlight ? "#8fe3ff" : "#f2f3f5",
              boxShadow: s.highlight ? "0 0 24px rgba(30,196,255,0.25)" : "none",
            }}>
              {s.id}
            </span>
            <h3 className="mt-11 text-lg font-semibold tracking-[-0.02em]">{s.title}</h3>
            <p className="mt-2 text-[13.5px] leading-[1.5]" style={{ color: "rgba(242,243,245,0.6)" }}>{s.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
