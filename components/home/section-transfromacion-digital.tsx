"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export default function SectionTransformacionDigital() {
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
    <section ref={sectionRef} className="relative z-[2] mx-auto max-w-[1200px] px-6 pt-[120px]" style={{ background: "#080a0f", color: "#f2f3f5" }}>
      <div className="max-w-[720px]">
        <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.08em]" style={{ color: "rgba(242,243,245,0.55)" }}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#1ec4ff]" style={{ boxShadow: "0 0 12px #1ec4ff" }} />
          Transformación digital
        </p>
        <h2 className="mt-[18px] text-[clamp(32px,4vw,54px)] font-semibold leading-[1.02] tracking-[-0.035em]" style={{ textWrap: "balance" }}>
          Tu proceso de transformación digital, de la marca al{" "}
          <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", fontWeight: 400, color: "#bfe9ff" }}>sistema</em>.
        </h2>
        <p className="mt-5 max-w-[58ch] text-base font-light leading-[1.55]" style={{ color: "rgba(242,243,245,0.65)" }}>
          Estrategia de branding, identidad visual, presencia web y mobile, e implementación de sistemas y soluciones tecnológicas específicas. Todo bajo un mismo equipo.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Card 1: Branding */}
        <article data-reveal="" className="relative flex min-h-[400px] flex-col overflow-hidden rounded-[20px] border p-7" style={{ borderColor: "rgba(255,255,255,0.1)", background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))" }}>
          <div className="flex flex-1 flex-col justify-center gap-3.5">
            <div className="flex gap-2">
              <span className="h-14 flex-1 rounded-[10px] bg-[#1f5c3f]" />
              <span className="h-14 flex-1 rounded-[10px] bg-[#b8f06a]" />
              <span className="h-14 flex-1 rounded-[10px] bg-[#f2f3f5]" />
              <span className="h-14 flex-1 rounded-[10px] bg-[#173f2d]" />
            </div>
            <div className="rounded-xl border p-[16px_18px]" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(8,10,15,0.6)" }}>
              <p className="text-[11px] uppercase tracking-[0.06em]" style={{ color: "rgba(242,243,245,0.45)" }}>Tipografía · Titular</p>
              <p className="mt-2 text-[34px] font-bold leading-none tracking-[-0.04em]">Rapidito</p>
              <p className="mt-1.5 text-[13px]" style={{ color: "rgba(242,243,245,0.6)" }}>Geist Bold · -4% tracking</p>
            </div>
          </div>
          <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.08em]" style={{ color: "rgba(242,243,245,0.45)" }}>01</p>
          <h3 className="mt-2 text-[21px] font-semibold tracking-[-0.02em]">Estrategia de branding e identidad visual</h3>
          <p className="mt-2.5 text-sm leading-[1.55]" style={{ color: "rgba(242,243,245,0.62)" }}>Definimos tu ADN de marca, paleta, tipografía y guía de estilo para una identidad digital coherente.</p>
        </article>

        {/* Card 2: Design & Dev */}
        <article data-reveal="" className="relative flex min-h-[400px] flex-col overflow-hidden rounded-[20px] border p-7" style={{ borderColor: "rgba(255,255,255,0.1)", background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))" }}>
          <div className="relative min-h-[200px] flex-1">
            {/* Desktop mockup */}
            <div className="absolute left-0 right-10 top-3 rounded-xl border p-2.5" style={{ borderColor: "rgba(255,255,255,0.12)", background: "#0d1017", boxShadow: "0 30px 60px -30px rgba(0,0,0,0.9)" }}>
              <div className="mb-2.5 flex gap-[5px]"><span className="h-[7px] w-[7px] rounded-full bg-[#3a3f4b]" /><span className="h-[7px] w-[7px] rounded-full bg-[#3a3f4b]" /></div>
              <div className="h-2 w-[55%] rounded bg-white/35" />
              <div className="mt-2 h-1.5 w-4/5 rounded bg-white/[0.12]" />
              <div className="mt-1.5 h-1.5 w-[65%] rounded bg-white/[0.12]" />
              <div className="mt-3.5 flex gap-1.5">
                <span className="h-[22px] w-16 rounded-full bg-white" />
                <span className="h-[22px] w-16 rounded-full border border-white/20" />
              </div>
            </div>
            {/* Mobile mockup */}
            <div className="absolute bottom-0 right-0 h-[190px] w-24 rounded-[18px] border p-[10px_8px]" style={{ borderColor: "rgba(255,255,255,0.18)", background: "#0d1017", boxShadow: "0 30px 60px -30px rgba(0,0,0,0.9)" }}>
              <div className="mx-auto mb-3 mt-1.5 h-[5px] w-2/5 rounded bg-white/35" />
              <div className="h-[54px] rounded-lg" style={{ background: "rgba(30,196,255,0.16)" }} />
              <div className="mt-2.5 h-[5px] w-[70%] rounded bg-white/20" />
              <div className="mt-1.5 h-[5px] w-1/2 rounded bg-white/[0.12]" />
              <div className="mt-7 h-5 rounded-full bg-white" />
            </div>
          </div>
          <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.08em]" style={{ color: "rgba(242,243,245,0.45)" }}>02</p>
          <h3 className="mt-2 text-[21px] font-semibold tracking-[-0.02em]">Diseño y desarrollo web y mobile</h3>
          <p className="mt-2.5 text-sm leading-[1.55]" style={{ color: "rgba(242,243,245,0.62)" }}>Experiencias responsivas que convierten visitantes en clientes, con UX/UI centrado en resultados.</p>
        </article>

        {/* Card 3: Systems */}
        <article data-reveal="" className="relative flex min-h-[400px] flex-col overflow-hidden rounded-[20px] border p-7" style={{ borderColor: "rgba(255,255,255,0.1)", background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))" }}>
          <div className="relative flex min-h-[200px] flex-1 items-center justify-center">
            <svg viewBox="0 0 300 200" className="absolute inset-0 h-full w-full" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1">
              <path d="M60 50 C110 50, 110 100, 150 100 S190 150, 240 150" />
              <path d="M60 150 C110 150, 110 100, 150 100 S190 50, 240 50" />
              <path d="M60 100 H240" />
            </svg>
            <SystemNode label="CRM" pos="left-3.5 top-[34px]" />
            <SystemNode label="Pagos" pos="left-3.5 top-[calc(50%-14px)]" />
            <SystemNode label="WhatsApp" pos="left-3.5 bottom-[34px]" />
            <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border" style={{ background: "#0d1017", borderColor: "rgba(30,196,255,0.5)", boxShadow: "0 0 40px rgba(30,196,255,0.25)" }}>
              <Image src="/Isologo-White.svg" alt="" width={12} height={12} style={{ height: "12px", width: "auto" }} />
            </div>
            <SystemNode label="Analytics" pos="right-3.5 top-[34px]" />
            <SystemNode label="ERP" pos="right-3.5 top-[calc(50%-14px)]" />
            <SystemNode label="Automatización" pos="right-3.5 bottom-[34px]" />
          </div>
          <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.08em]" style={{ color: "rgba(242,243,245,0.45)" }}>03</p>
          <h3 className="mt-2 text-[21px] font-semibold tracking-[-0.02em]">Implementación de sistemas y tecnología</h3>
          <p className="mt-2.5 text-sm leading-[1.55]" style={{ color: "rgba(242,243,245,0.62)" }}>Integramos CRM, automatización, analytics y soluciones a medida que escalan con tu operación.</p>
        </article>
      </div>
    </section>
  );
}

function SystemNode({ label, pos }: { label: string; pos: string }) {
  return (
    <div className={`absolute ${pos} rounded-lg border px-2.5 py-1.5 text-[11.5px]`} style={{ borderColor: "rgba(255,255,255,0.12)", background: "#0d1017" }}>
      {label}
    </div>
  );
}
