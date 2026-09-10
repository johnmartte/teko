"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";
import SectionPlanes from "@/components/precios/section-planes";
import SectionMicroserviciosPrecios from "@/components/precios/section-microservicios-precios";
import SectionFAQ from "@/components/precios/section-faq";

function PreciosHero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const els = ref.current?.querySelectorAll("[data-reveal]");
      if (!els) return;
      els.forEach((el, i) => {
        gsap.set(el, { opacity: 0, y: 18 });
        gsap.to(el, { opacity: 1, y: 0, duration: 0.7, delay: i * 0.08, ease: "power3.out" });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden px-6 pb-16 pt-[130px] md:px-[100px]" style={{ color: "#f2f3f5" }}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 40% at 50% 0%, rgba(30,120,255,0.12), transparent 70%)" }} />

      <div className="relative mx-auto max-w-[1200px]">
        <Link
          href="/"
          data-reveal=""
          className="inline-flex items-center gap-2 text-[13px] font-medium transition-colors hover:text-white"
          style={{ color: "rgba(242,243,245,0.5)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8.5 3L4.5 7l4 4" /></svg>
          Volver al inicio
        </Link>

        <div data-reveal="" className="mt-8 max-w-[760px]">
          <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.08em]" style={{ color: "rgba(242,243,245,0.55)" }}>
            <span className="h-1.5 w-1.5 rounded-full bg-[#1ec4ff]" style={{ boxShadow: "0 0 12px #1ec4ff" }} />
            Nuestros Planes
          </p>

          <h1 className="mt-5 text-[clamp(36px,5vw,58px)] font-semibold leading-[1.02] tracking-[-0.035em]" style={{ textWrap: "balance" }}>
            El plan perfecto para tu{" "}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", fontWeight: 400, color: "#bfe9ff" }}>negocio</em>
          </h1>

          <p className="mt-5 max-w-[520px] text-[15.5px] font-light leading-[1.6]" style={{ color: "rgba(242,243,245,0.62)" }}>
            Tres planes diseñados para cubrir desde los primeros pasos digitales hasta la transformación completa de tu empresa. Cotiza directamente con nosotros.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function PreciosPage() {
  return (
    <main style={{ background: "#080a0f" }}>
      <PreciosHero />
      <SectionPlanes />
      <SectionMicroserviciosPrecios />
      <SectionFAQ />
    </main>
  );
}
