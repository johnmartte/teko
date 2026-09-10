"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export default function PlataformasPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const els = pageRef.current?.querySelectorAll("[data-reveal]");
      if (!els) return;
      els.forEach((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) return;
        gsap.set(el, { opacity: 0, y: 18 });
        gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={pageRef} style={{ background: "#080a0f", color: "#f2f3f5" }}>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-0 pt-[130px] md:px-[100px]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 40% at 50% 0%, rgba(30,120,255,0.12), transparent 70%)" }} />
        <div className="relative mx-auto max-w-[1200px]">
          <Link href="/" className="inline-flex items-center gap-2 text-[13px] font-medium transition-colors hover:text-white" style={{ color: "rgba(242,243,245,0.5)" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8.5 3L4.5 7l4 4" /></svg>
            Volver al inicio
          </Link>
          <div className="mt-8 max-w-[760px]">
            <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.08em]" style={{ color: "rgba(242,243,245,0.55)" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#1ec4ff]" style={{ boxShadow: "0 0 12px #1ec4ff" }} />
              Plataformas TEKO
            </p>
            <h1 className="mt-5 text-[clamp(36px,5vw,58px)] font-semibold leading-[1.02] tracking-[-0.035em]">
              Herramientas digitales{" "}
              <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", fontWeight: 400, color: "#bfe9ff" }}>TEKO</em>
            </h1>
            <p className="mt-5 max-w-[520px] text-[15.5px] font-light leading-[1.6]" style={{ color: "rgba(242,243,245,0.62)" }}>
              Plataformas web desarrolladas por TEKO para potenciar tu operación digital y la de tus clientes.
            </p>
          </div>
        </div>
      </section>

      {/* ── TEKO Manager ───────────────────────────────────── */}
      <section className="px-6 pt-16 md:px-[100px]">
        <div data-reveal="" className="relative mx-auto grid max-w-[1200px] grid-cols-1 overflow-hidden rounded-[26px] border lg:grid-cols-2" style={{ borderColor: "rgba(124,58,237,0.22)", background: "radial-gradient(90% 90% at 0% 0%, #2a1854 0%, #120d2a 55%, #0b0e16 100%)" }}>
          {/* Left */}
          <div className="flex flex-col justify-between gap-10 p-8 md:p-[52px_48px]">
            <div>
              <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.08em] text-[#c4b5fd]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c4b5fd]" style={{ boxShadow: "0 0 12px #a78bfa" }} />
                Redes sociales
              </p>
              <h2 className="mt-6 text-[clamp(30px,3.4vw,46px)] font-semibold leading-[1.04] tracking-[-0.035em]">TEKO Manager</h2>
              <p className="mt-[18px] max-w-[46ch] text-[15.5px] font-light leading-[1.55]" style={{ color: "rgba(242,243,245,0.78)" }}>
                Administra tus redes desde un solo lugar: programa publicaciones, analiza métricas y gestiona todas tus cuentas de forma centralizada.
              </p>
            </div>
            <div>
              <ul className="grid grid-cols-2 gap-2.5 border-t pt-[22px] text-[13px]" style={{ borderColor: "rgba(255,255,255,0.14)", color: "rgba(242,243,245,0.8)" }}>
                {["Programación de posts", "Analítica de redes", "Gestión multi-cuenta", "Calendario de contenido"].map((f) => (
                  <li key={f} className="flex items-center gap-2"><span className="h-[5px] w-[5px] rounded-full bg-[#c4b5fd]" />{f}</li>
                ))}
              </ul>
              <div className="mt-[26px] flex flex-wrap gap-3">
                <a href="https://frontend-kappa-jet-50.vercel.app/login" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 rounded-full bg-[#a78bfa] px-[22px] py-[13px] text-sm font-semibold text-[#120d2a] transition-colors hover:bg-[#c4b5fd]">
                  Ir a la plataforma
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 10L10 2M4 2h6v6" /></svg>
                </a>
              </div>
            </div>
          </div>
          {/* Right — Dashboard mockup */}
          <div className="relative hidden min-h-[520px] overflow-hidden lg:block">
            <div aria-hidden="true" className="absolute inset-0 opacity-[0.06]" style={{
              backgroundImage: "radial-gradient(rgba(167,139,250,0.4) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              maskImage: "linear-gradient(180deg, #000, transparent 90%)",
              WebkitMaskImage: "linear-gradient(180deg, #000, transparent 90%)",
            }} />
            <div className="absolute bottom-[-30px] left-[10%] right-[-40px] top-[30px] rounded-[18px] border p-4" style={{ borderColor: "rgba(167,139,250,0.18)", background: "#0d0f1a", boxShadow: "0 40px 80px -20px rgba(0,0,0,0.8)" }}>
              {/* Top bar */}
              <div className="flex items-center gap-3 border-b pb-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="h-2 w-2 rounded-full bg-[#a78bfa]" />
                <div className="h-1.5 w-24 rounded" style={{ background: "rgba(255,255,255,0.12)" }} />
                <div className="ml-auto flex gap-2">
                  <div className="h-6 w-16 rounded-md" style={{ background: "rgba(167,139,250,0.12)" }} />
                  <div className="h-6 w-6 rounded-md" style={{ background: "rgba(255,255,255,0.04)" }} />
                </div>
              </div>
              {/* KPIs */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: "Alcance", value: "24.8K", color: "#a78bfa" },
                  { label: "Engagement", value: "8.2%", color: "#60a5fa" },
                  { label: "Publicaciones", value: "142", color: "#f472b6" },
                ].map((kpi) => (
                  <div key={kpi.label} className="rounded-xl border p-3" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                    <p className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>{kpi.label}</p>
                    <p className="mt-1 text-[18px] font-semibold" style={{ color: kpi.color }}>{kpi.value}</p>
                  </div>
                ))}
              </div>
              {/* Calendar grid */}
              <div className="mt-4 rounded-xl border p-3" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}>
                <div className="mb-2 h-1.5 w-20 rounded" style={{ background: "rgba(255,255,255,0.08)" }} />
                <div className="grid grid-cols-7 gap-1.5">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-md" style={{ background: i === 3 || i === 8 || i === 11 ? "rgba(167,139,250,0.18)" : "rgba(255,255,255,0.025)" }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Portal de Clientes ─────────────────────────────── */}
      <section className="px-6 pt-8 md:px-[100px]">
        <div data-reveal="" className="relative mx-auto grid max-w-[1200px] grid-cols-1 overflow-hidden rounded-[26px] border lg:grid-cols-2" style={{ borderColor: "rgba(30,120,255,0.22)", background: "radial-gradient(90% 90% at 100% 0%, #0d2a5c 0%, #0a1630 55%, #0b0e16 100%)" }}>
          {/* Left */}
          <div className="flex flex-col justify-between gap-10 p-8 md:p-[52px_48px]">
            <div>
              <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.08em] text-[#60a5fa]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#60a5fa]" style={{ boxShadow: "0 0 12px #3b82f6" }} />
                Para tu proyecto
              </p>
              <h2 className="mt-6 text-[clamp(30px,3.4vw,46px)] font-semibold leading-[1.04] tracking-[-0.035em]">Portal de Clientes</h2>
              <p className="mt-[18px] max-w-[46ch] text-[15.5px] font-light leading-[1.55]" style={{ color: "rgba(242,243,245,0.78)" }}>
                Tu panel para dar seguimiento al proyecto, revisar entregables, ver reuniones programadas y facturación en un solo lugar.
              </p>
            </div>
            <div>
              <ul className="grid grid-cols-2 gap-2.5 border-t pt-[22px] text-[13px]" style={{ borderColor: "rgba(255,255,255,0.14)", color: "rgba(242,243,245,0.8)" }}>
                {["Seguimiento de proyectos", "Entregables y archivos", "Reuniones agendadas", "Facturación y pagos"].map((f) => (
                  <li key={f} className="flex items-center gap-2"><span className="h-[5px] w-[5px] rounded-full bg-[#60a5fa]" />{f}</li>
                ))}
              </ul>
              <div className="mt-[26px] flex flex-wrap gap-3">
                <a href="#" className="inline-flex items-center gap-2.5 rounded-full bg-[#60a5fa] px-[22px] py-[13px] text-sm font-semibold text-[#0a1630] transition-colors hover:bg-[#93c5fd]">
                  Entrar al portal
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 10L10 2M4 2h6v6" /></svg>
                </a>
              </div>
            </div>
          </div>
          {/* Right — Portal mockup */}
          <div className="relative hidden min-h-[520px] overflow-hidden lg:block">
            <div aria-hidden="true" className="absolute inset-0 opacity-[0.06]" style={{
              backgroundImage: "radial-gradient(rgba(96,165,250,0.4) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              maskImage: "linear-gradient(180deg, #000, transparent 90%)",
              WebkitMaskImage: "linear-gradient(180deg, #000, transparent 90%)",
            }} />
            <div className="absolute bottom-[-30px] left-[10%] right-[-40px] top-[30px] rounded-[18px] border p-4" style={{ borderColor: "rgba(96,165,250,0.18)", background: "#0d0f1a", boxShadow: "0 40px 80px -20px rgba(0,0,0,0.8)" }}>
              {/* Sidebar + main */}
              <div className="flex h-full gap-3">
                {/* Sidebar */}
                <div className="w-[30%] rounded-xl border p-3" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}>
                  <div className="h-2 w-16 rounded" style={{ background: "rgba(96,165,250,0.3)" }} />
                  <div className="mt-5 space-y-3">
                    {["Proyectos", "Entregables", "Reuniones", "Facturas"].map((item, i) => (
                      <div key={item} className="flex items-center gap-2 rounded-lg px-2 py-1.5" style={{ background: i === 0 ? "rgba(96,165,250,0.1)" : "transparent" }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: i === 0 ? "#60a5fa" : "rgba(255,255,255,0.15)" }} />
                        <span className="text-[10px]" style={{ color: i === 0 ? "#93c5fd" : "rgba(255,255,255,0.3)" }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Main area */}
                <div className="flex-1">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="h-1.5 w-28 rounded" style={{ background: "rgba(255,255,255,0.1)" }} />
                    <div className="h-6 w-20 rounded-full" style={{ background: "rgba(96,165,250,0.12)" }} />
                  </div>
                  {/* Project cards */}
                  <div className="space-y-2.5">
                    {[
                      { progress: "85%", status: "#5ee08a" },
                      { progress: "42%", status: "#fbbf24" },
                      { progress: "100%", status: "#60a5fa" },
                    ].map((proj, i) => (
                      <div key={i} className="rounded-xl border p-3" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                        <div className="flex items-center justify-between">
                          <div className="h-1.5 w-24 rounded" style={{ background: "rgba(255,255,255,0.1)" }} />
                          <span className="h-2 w-2 rounded-full" style={{ background: proj.status }} />
                        </div>
                        <div className="mt-2 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }}>
                          <div className="h-full rounded-full" style={{ background: "rgba(96,165,250,0.35)", width: proj.progress }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Rapidito ───────────────────────────────────────── */}

      {/* Mobile: compact promo card */}
      <section className="px-6 pt-8 pb-20 lg:hidden">
        <div data-reveal="" className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[22px] border p-6" style={{ borderColor: "rgba(184,240,106,0.22)", background: "radial-gradient(80% 80% at 50% 0%, #1f5c3f 0%, #0f2a1e 60%, #0b1a14 100%)" }}>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{
            backgroundImage: "url('/Rapidito-Patron.png')",
            backgroundSize: "180px",
            maskImage: "radial-gradient(ellipse 80% 80% at 80% 20%, #000, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 80% 20%, #000, transparent 70%)",
          }} />
          <div className="relative flex flex-col items-start gap-4">
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[#b8f06a]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b8f06a]" style={{ boxShadow: "0 0 10px #b8f06a" }} />
              FoodTech · SaaS
            </p>
            <div className="relative" style={{ height: "36px", width: "148px" }}>
              <Image src="/Rapidito-Logo.png" alt="Rapidito" fill className="object-contain object-left" />
            </div>
            <p className="max-w-[48ch] text-[14px] font-light leading-[1.55]" style={{ color: "rgba(242,243,245,0.72)" }}>
              La carta digital que entiende al restaurante criollo. Crea tu menú en minutos.
            </p>
            <a href="https://rapidito.do" target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-2 rounded-full bg-[#b8f06a] px-5 py-[11px] text-[13px] font-semibold text-[#0f2a1e] transition-colors hover:bg-[#cdf58f]">
              Publicar mi carta
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 10L10 2M4 2h6v6" /></svg>
            </a>
          </div>
        </div>
      </section>

      {/* Desktop: full card with phone mockup */}
      <section className="hidden px-6 pt-8 pb-20 md:px-[100px] md:pb-32 lg:block">
        <div data-reveal="" className="relative mx-auto grid max-w-[1200px] grid-cols-2 overflow-hidden rounded-[26px] border" style={{ borderColor: "rgba(184,240,106,0.22)", background: "radial-gradient(90% 90% at 100% 0%, #1f5c3f 0%, #0f2a1e 55%, #0b1a14 100%)" }}>
          {/* Left */}
          <div className="flex flex-col justify-between gap-10 p-[52px_48px]">
            <div>
              <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.08em] text-[#b8f06a]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#b8f06a]" style={{ boxShadow: "0 0 12px #b8f06a" }} />
                FoodTech · SaaS
              </p>
              <div className="relative mt-[26px]" style={{ height: "46px", width: "184px" }}>
                <Image src="/Rapidito-Logo.png" alt="Rapidito" fill className="object-contain object-left" />
              </div>
              <p className="mt-[18px] max-w-[46ch] text-[15.5px] font-light leading-[1.55]" style={{ color: "rgba(242,243,245,0.78)" }}>
                La carta digital que entiende al restaurante criollo. Crea y gestiona tu menú en minutos, de forma simple, rápida y profesional.
              </p>
            </div>
            <div>
              <ul className="grid grid-cols-2 gap-2.5 border-t pt-[22px] text-[13px]" style={{ borderColor: "rgba(255,255,255,0.14)", color: "rgba(242,243,245,0.8)" }}>
                {["Carta digital en minutos", "Gestión de categorías", "Plantillas personalizables", "Sin comisión por pedido"].map((f) => (
                  <li key={f} className="flex items-center gap-2"><span className="h-[5px] w-[5px] rounded-full bg-[#b8f06a]" />{f}</li>
                ))}
              </ul>
              <div className="mt-[26px] flex flex-wrap gap-3">
                <a href="https://rapidito.do" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 rounded-full bg-[#b8f06a] px-[22px] py-[13px] text-sm font-semibold text-[#0f2a1e] transition-colors hover:bg-[#cdf58f]">
                  Publicar mi carta
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 10L10 2M4 2h6v6" /></svg>
                </a>
              </div>
            </div>
          </div>
          {/* Right — Phone mockup */}
          <div className="relative min-h-[520px] overflow-hidden">
            <div aria-hidden="true" className="absolute inset-0 opacity-[0.14]" style={{
              backgroundImage: "url('/Rapidito-Patron.png')",
              backgroundSize: "240px",
              maskImage: "linear-gradient(180deg, #000, transparent 90%)",
              WebkitMaskImage: "linear-gradient(180deg, #000, transparent 90%)",
            }} />
            <div className="absolute bottom-[-60px] left-1/2 h-[600px] w-[300px] -translate-x-1/2 overflow-hidden rounded-[44px] border p-3.5" style={{ borderColor: "rgba(255,255,255,0.22)", background: "#0b1a14", boxShadow: "0 60px 120px -30px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.1)" }}>
              <div className="flex h-full flex-col overflow-hidden rounded-[32px] text-[#0f2a1e]" style={{ background: "#f6f7f2" }}>
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
                  {[
                    { name: "Mofongo con camarones", sub: "Plátano, ajo, chicharrón", price: "RD$ 550" },
                    { name: "Sancocho de siete carnes", sub: "Con arroz y aguacate", price: "RD$ 620" },
                    { name: "Chimi de res", sub: "Pan de agua, repollo, salsa", price: "RD$ 250" },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between rounded-[14px] border border-[#e3e6dd] bg-white p-3">
                      <div>
                        <p className="text-[13px] font-semibold">{item.name}</p>
                        <p className="mt-0.5 text-[11px] text-[#5a6b62]">{item.sub}</p>
                      </div>
                      <span className="ml-2.5 shrink-0 whitespace-nowrap text-[13px] font-semibold">{item.price}</span>
                    </div>
                  ))}
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
    </main>
  );
}
