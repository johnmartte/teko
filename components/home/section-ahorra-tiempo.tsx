"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export default function SectionAhorraTiempo() {
  const sectionRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const el = sectionRef.current?.querySelector("[data-reveal]");
      if (el) {
        const rect = (el as HTMLElement).getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) return;
        gsap.set(el, { opacity: 0, y: 18 });
        gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contacto" className="relative z-[2] mx-auto max-w-[1200px] px-6 py-[120px]" style={{ color: "#f2f3f5" }}>
      <div data-reveal="" className="relative overflow-hidden rounded-[28px] border" style={{ borderColor: "rgba(255,255,255,0.12)", background: "#0b0e16", padding: "clamp(40px, 6vw, 80px) clamp(24px, 5vw, 64px)" }}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(70% 60% at 50% 110%, rgba(30,120,255,0.35), transparent 70%)" }} />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(60% 80% at 50% 100%, #000, transparent)",
          WebkitMaskImage: "radial-gradient(60% 80% at 50% 100%, #000, transparent)",
        }} />

        <div className="relative grid grid-cols-1 items-end gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div>
            <h2 className="text-[clamp(36px,4.6vw,64px)] font-semibold leading-none tracking-[-0.04em]" style={{ textWrap: "balance" }}>
              Ahorra tiempo, dinero y{" "}
              <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", fontWeight: 400, color: "#bfe9ff", textShadow: "0 0 40px rgba(30,196,255,0.35)" }}>escala</em>{" "}
              tu negocio.
            </h2>
            <p className="mt-[22px] max-w-[50ch] text-base font-light leading-[1.55]" style={{ color: "rgba(242,243,245,0.68)" }}>
              TEKO se integra con las plataformas que ya usas y unifica todo en un solo lugar para potenciar tu operación digital.
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="flex gap-2 rounded-full border p-1.5 backdrop-blur-[10px]" style={{ borderColor: "rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.05)" }}>
              <input
                type="email"
                required
                placeholder="Tu email de trabajo"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setSent(false); }}
                className="h-[46px] min-w-0 flex-1 border-none bg-transparent px-[18px] text-[14.5px] text-white outline-none placeholder:text-white/40"
              />
              <button type="submit" className="h-[46px] whitespace-nowrap rounded-full bg-white px-5 text-sm font-semibold text-[#080a0f] transition-colors hover:bg-[#e8ecf5]">
                {sent ? "Recibido ✓" : "Empezar"}
              </button>
            </form>
            <p className="ml-[18px] mt-3 text-[12.5px]" style={{ color: "rgba(242,243,245,0.5)" }}>
              Respondemos en menos de 24 horas laborables. Sin compromiso.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
