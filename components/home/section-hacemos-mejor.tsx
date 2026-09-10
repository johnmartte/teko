"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export default function SectionHacemosMejor() {
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
    <section ref={sectionRef} id="servicios" data-reveal="" className="relative z-[2] mx-auto max-w-[1200px] px-6 pt-[120px]" style={{ color: "#f2f3f5" }}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-[620px]">
          <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.08em]" style={{ color: "rgba(242,243,245,0.55)" }}>
            <span className="h-1.5 w-1.5 rounded-full bg-[#1ec4ff]" style={{ boxShadow: "0 0 12px #1ec4ff" }} />
            Lo que hacemos mejor
          </p>
          <h2 className="mt-[18px] text-[clamp(32px,4vw,54px)] font-semibold leading-[1.02] tracking-[-0.035em]" style={{ textWrap: "balance" }}>
            Un ecosistema completo para llevar tu negocio al{" "}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", fontWeight: 400, color: "#bfe9ff" }}>siguiente nivel</em>.
          </h2>
        </div>
        <Link href="/servicios" className="inline-flex items-center gap-2.5 rounded-full border px-5 py-3 text-[13.5px] font-medium transition-colors hover:bg-white/[0.06]" style={{ borderColor: "rgba(255,255,255,0.16)" }}>
          Ver todos los servicios
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" /></svg>
        </Link>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Branding */}
        <ServiceCard data-reveal="" tags={["Logo y sistema", "Storytelling", "Guías de marca"]} title="Branding e identidad visual" desc="Marcas memorables con estrategia, storytelling y sistemas de diseño que conectan con tu audiencia.">
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-[30px] select-none text-[260px] leading-none" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", color: "rgba(255,255,255,0.05)" }}>Aa</div>
        </ServiceCard>

        {/* Apps */}
        <ServiceCard data-reveal="" tags={["iOS y Android", "Nativas e híbridas"]} title="Aplicaciones móviles" desc="Apps para iOS y Android con interfaces intuitivas y una experiencia cuidada hasta el último detalle.">
          <div aria-hidden="true" className="absolute right-8 -top-[70px] h-[300px] w-[170px] rounded-[30px] border p-[16px_12px]" style={{ borderColor: "rgba(255,255,255,0.16)", background: "#0d1017", transform: "rotate(-8deg)", boxShadow: "0 40px 80px -30px rgba(0,0,0,0.9)" }}>
            <div className="mx-auto mb-[18px] mt-2 h-1.5 w-2/5 rounded bg-white/30" />
            <div className="h-[70px] rounded-xl" style={{ background: "rgba(30,196,255,0.14)", border: "1px solid rgba(30,196,255,0.25)" }} />
            <div className="mt-3.5 h-1.5 w-3/4 rounded bg-white/25" />
            <div className="mt-2 h-1.5 w-[55%] rounded bg-white/[0.12]" />
            <div className="mt-4 flex gap-2"><span className="h-10 flex-1 rounded-[10px] bg-white/[0.06]" /><span className="h-10 flex-1 rounded-[10px] bg-white/[0.06]" /></div>
          </div>
        </ServiceCard>

        {/* Web */}
        <ServiceCard data-reveal="" tags={["Next.js", "E-commerce", "Landing pages"]} title="Diseño y desarrollo web" desc="Sitios y plataformas de alto rendimiento con UX centrado en conversión y tecnología moderna." tagsStyle={{ marginTop: "170px" }}>
          <div aria-hidden="true" className="absolute left-8 right-[-80px] top-6 rounded-[14px] border p-3" style={{ borderColor: "rgba(255,255,255,0.14)", background: "#0d1017", boxShadow: "0 40px 80px -30px rgba(0,0,0,0.9)" }}>
            <div className="flex gap-1.5"><span className="h-2 w-2 rounded-full bg-[#3a3f4b]" /><span className="h-2 w-2 rounded-full bg-[#3a3f4b]" /><span className="h-2 w-2 rounded-full bg-[#3a3f4b]" /></div>
            <div className="mt-3 grid grid-cols-3 gap-2"><span className="h-[54px] rounded-lg bg-white/[0.06]" /><span className="h-[54px] rounded-lg" style={{ background: "rgba(30,196,255,0.14)" }} /><span className="h-[54px] rounded-lg bg-white/[0.06]" /></div>
            <div className="mt-3 h-1.5 w-1/2 rounded bg-white/25" />
            <div className="mt-2 h-1.5 w-[70%] rounded bg-white/10" />
          </div>
        </ServiceCard>

        {/* Sistemas */}
        <ServiceCard data-reveal="" tags={[]} title="Sistemas y automatización" desc="Software empresarial a medida: CRM, ERP, integraciones y automatización que escala con tu negocio.">
          <div aria-hidden="true" className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(60% 50% at 70% 30%, #000, transparent)",
            WebkitMaskImage: "radial-gradient(60% 50% at 70% 30%, #000, transparent)",
          }} />
          <div className="relative flex flex-col items-end gap-2">
            <EventPill color="#5ee08a" text="Factura #2210 generada · PDF" />
            <EventPill color="#8fe3ff" text="Recordatorio enviado por WhatsApp" />
            <EventPill color="#ffd47a" text="Sincronizado con CRM" />
          </div>
        </ServiceCard>
      </div>
    </section>
  );
}

function ServiceCard({ tags, title, desc, children, tagsStyle, ...rest }: {
  tags: string[];
  title: string;
  desc: string;
  children?: React.ReactNode;
  tagsStyle?: React.CSSProperties;
  [key: string]: unknown;
}) {
  return (
    <article {...rest} className="relative flex min-h-[360px] flex-col justify-between gap-7 overflow-hidden rounded-[22px] border p-8" style={{ borderColor: "rgba(255,255,255,0.1)", background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))" }}>
      {children}
      {tags.length > 0 && (
        <div className="relative flex flex-wrap gap-2.5" style={tagsStyle}>
          {tags.map((t) => (
            <span key={t} className="rounded-full border px-3 py-1.5 text-xs" style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(242,243,245,0.75)", background: title === "Diseño y desarrollo web" ? "#0d1017" : "transparent" }}>{t}</span>
          ))}
        </div>
      )}
      <div className="relative">
        <h3 className="text-[clamp(24px,2.4vw,32px)] font-semibold tracking-[-0.03em]">{title}</h3>
        <p className="mt-3 max-w-[46ch] text-[14.5px] leading-[1.55]" style={{ color: "rgba(242,243,245,0.62)" }}>{desc}</p>
      </div>
    </article>
  );
}

function EventPill({ color, text }: { color: string; text: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-[10px] border px-3 py-2 text-xs" style={{ borderColor: "rgba(255,255,255,0.12)", background: "#0d1017" }}>
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {text}
    </div>
  );
}
