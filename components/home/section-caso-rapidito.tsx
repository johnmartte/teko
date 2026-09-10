"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export default function SectionCasoRapidito() {
  const sectionRef = useRef<HTMLElement>(null);

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
    <section ref={sectionRef} id="caso" className="relative z-[2] mx-auto max-w-[1200px] px-6 pt-[120px]" style={{ color: "#f2f3f5" }}>
      <div data-reveal="" className="relative grid grid-cols-1 overflow-hidden rounded-[26px] border lg:grid-cols-2" style={{ borderColor: "rgba(184,240,106,0.22)", background: "radial-gradient(90% 90% at 100% 0%, #1f5c3f 0%, #0f2a1e 55%, #0b1a14 100%)" }}>
        {/* Left: content */}
        <div className="flex flex-col justify-between gap-10 p-8 md:p-[52px_48px]">
          <div>
            <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.08em] text-[#b8f06a]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b8f06a]" style={{ boxShadow: "0 0 12px #b8f06a" }} />
              Caso · Producto propio
            </p>
            <Image src="/Rapidito-Logo.png" alt="Rapidito" width={184} height={46} className="mt-[26px] rounded-md" style={{ height: "46px", width: "auto" }} />
            <h2 className="mt-6 text-[clamp(30px,3.4vw,46px)] font-semibold leading-[1.04] tracking-[-0.035em]" style={{ textWrap: "balance" }}>
              Tu carta, tu caja y tus pedidos en un solo lugar.
            </h2>
            <p className="mt-[18px] max-w-[46ch] text-[15.5px] font-light leading-[1.55]" style={{ color: "rgba(242,243,245,0.78)" }}>
              Publica tu menú con un QR, cobra en efectivo o tarjeta desde el mostrador y mira cada pedido pasar por la cocina. Sin comisión por pedido.
            </p>
          </div>
          <div>
            <div className="flex gap-9 border-t pt-[22px]" style={{ borderColor: "rgba(255,255,255,0.14)" }}>
              <div>
                <p className="text-[38px] font-semibold leading-none tracking-[-0.04em] text-[#b8f06a]">0%</p>
                <p className="mt-2 text-[12.5px]" style={{ color: "rgba(242,243,245,0.65)" }}>de comisión por pedido</p>
              </div>
              <div>
                <p className="text-[38px] font-semibold leading-none tracking-[-0.04em]">QR</p>
                <p className="mt-2 text-[12.5px]" style={{ color: "rgba(242,243,245,0.65)" }}>menú al alcance de todos</p>
              </div>
            </div>
            <div className="mt-[26px] flex flex-wrap gap-3">
              <a href="https://rapidito.do" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 rounded-full bg-[#b8f06a] px-[22px] py-[13px] text-sm font-semibold text-[#0f2a1e] transition-colors hover:bg-[#cdf58f]">
                Publicar mi carta
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 10L10 2M4 2h6v6" /></svg>
              </a>
              <a href="https://rapidito.do" target="_blank" rel="noopener noreferrer" className="rounded-full border px-[22px] py-3 text-sm font-medium transition-colors hover:bg-white/[0.08]" style={{ borderColor: "rgba(255,255,255,0.22)", color: "#f2f3f5" }}>
                Ver una carta real
              </a>
            </div>
            <p className="mt-3.5 text-xs" style={{ color: "rgba(242,243,245,0.55)" }}>Sin tarjeta. Montamos tu menú actual y lo revisas antes de publicar.</p>
          </div>
        </div>

        {/* Right: phone mockup */}
        <div className="relative hidden min-h-[520px] overflow-hidden lg:block">
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.14]" style={{
            backgroundImage: "url('/Rapidito-Patron.png')",
            backgroundSize: "240px",
            maskImage: "linear-gradient(180deg, #000, transparent 90%)",
            WebkitMaskImage: "linear-gradient(180deg, #000, transparent 90%)",
          }} />
          <div className="absolute bottom-[-60px] left-1/2 h-[600px] w-[300px] -translate-x-1/2 overflow-hidden rounded-[44px] border p-3.5" style={{ borderColor: "rgba(255,255,255,0.22)", background: "#0b1a14", boxShadow: "0 60px 120px -30px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.1)" }}>
            <div className="flex h-full flex-col overflow-hidden rounded-[32px] text-[#0f2a1e]" style={{ background: "#f6f7f2" }}>
              {/* Status bar */}
              <div className="flex items-center justify-between px-[18px] pt-[18px] pb-3 text-[11px] text-[#0f2a1e]">
                <span className="font-semibold">9:41</span>
                <span className="h-4 w-[60px] rounded-full bg-[#0b1a14]" />
                <span>●●●</span>
              </div>
              <div className="px-[18px] pt-1.5">
                <p className="text-[11px] uppercase tracking-[0.04em] text-[#5a6b62]">Mesa 4 · Menú</p>
                <p className="mt-1 text-[20px] font-bold tracking-[-0.03em]">La Cocina de Ana</p>
              </div>
              <div className="flex gap-1.5 px-[18px] pt-3.5 text-[11.5px]">
                <span className="rounded-full bg-[#16a34a] px-[11px] py-1.5 font-semibold text-white">Platos</span>
                <span className="rounded-full bg-[#e7eae2] px-[11px] py-1.5">Bebidas</span>
                <span className="rounded-full bg-[#e7eae2] px-[11px] py-1.5">Postres</span>
              </div>
              <div className="flex flex-col gap-2.5 px-[18px] pt-3.5">
                <MenuItem name="Mofongo con camarones" sub="Plátano, ajo, chicharrón" price="RD$ 550" />
                <MenuItem name="Sancocho de siete carnes" sub="Con arroz y aguacate" price="RD$ 620" />
                <MenuItem name="Chimi de res" sub="Pan de agua, repollo, salsa" price="RD$ 250" />
              </div>
              <div className="mx-3.5 mt-auto mb-3.5 flex items-center justify-between rounded-2xl bg-[#16a34a] px-4 py-3.5 text-[13px] font-semibold text-white">
                <span>Ver pedido · 3</span>
                <span className="text-[#b8f06a]">RD$ 1,420</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MenuItem({ name, sub, price }: { name: string; sub: string; price: string }) {
  return (
    <div className="flex items-center justify-between rounded-[14px] border border-[#e3e6dd] bg-white p-3">
      <div>
        <p className="text-[13px] font-semibold">{name}</p>
        <p className="mt-0.5 text-[11px] text-[#5a6b62]">{sub}</p>
      </div>
      <span className="ml-2.5 shrink-0 whitespace-nowrap text-[13px] font-semibold">{price}</span>
    </div>
  );
}
