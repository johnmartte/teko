"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const platforms = [
  {
    name: "TEKO Manager",
    badge: "Redes sociales",
    desc: "Administra tus redes desde un solo lugar: programa publicaciones, analiza métricas y gestiona todas tus cuentas de forma centralizada.",
    features: ["Programación de publicaciones", "Analítica de redes", "Gestión multi-cuenta", "Calendario de contenido"],
    cta: "Ir a la plataforma",
    href: "#",
  },
  {
    name: "Portal de Clientes",
    badge: "Para tu proyecto",
    desc: "Tu panel para dar seguimiento al proyecto, revisar entregables, ver reuniones programadas y facturación en un solo lugar.",
    features: ["Seguimiento de proyectos", "Entregables y archivos", "Reuniones agendadas", "Facturación y pagos"],
    cta: "Entrar al portal",
    href: "#",
  },
];

export default function SectionPlataformas() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll("[data-reveal]");
      if (cards) {
        cards.forEach((el) => {
          const rect = (el as HTMLElement).getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.9) return;
          gsap.set(el, { opacity: 0, y: 18 });
          gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="plataformas" data-reveal="" className="relative z-[2] mx-auto max-w-[1200px] px-6 pt-[120px]" style={{ color: "#f2f3f5" }}>
      <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.08em]" style={{ color: "rgba(242,243,245,0.55)" }}>
        <span className="h-1.5 w-1.5 rounded-full bg-[#1ec4ff]" style={{ boxShadow: "0 0 12px #1ec4ff" }} />
        Plataformas TEKO
      </p>
      <h2 className="mt-[18px] max-w-[18ch] text-[clamp(32px,4vw,54px)] font-semibold leading-[1.02] tracking-[-0.035em]" style={{ textWrap: "balance" }}>
        Herramientas que ya usamos con nuestros clientes.
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
        {platforms.map((p) => (
          <article key={p.name} data-reveal="" className="flex flex-col gap-[22px] rounded-[22px] border p-8" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold tracking-[-0.03em]">{p.name}</h3>
              <span className="rounded-full border px-2.5 py-[5px] text-[11px]" style={{ borderColor: "rgba(255,255,255,0.14)", color: "rgba(242,243,245,0.7)" }}>{p.badge}</span>
            </div>
            <p className="text-[14.5px] leading-[1.55]" style={{ color: "rgba(242,243,245,0.65)" }}>{p.desc}</p>
            <ul className="grid grid-cols-2 gap-2.5 text-[13px]" style={{ color: "rgba(242,243,245,0.8)" }}>
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="h-[5px] w-[5px] rounded-full bg-[#8fe3ff]" />{f}
                </li>
              ))}
            </ul>
            <a href={p.href} className="mt-auto inline-flex items-center gap-2 text-[13.5px] font-medium text-white">
              {p.cta}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 10L10 2M4 2h6v6" /></svg>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
