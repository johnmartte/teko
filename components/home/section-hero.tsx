"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

export default function SectionHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".tk-r2", { y: 28, opacity: 0, filter: "blur(10px)", duration: 0.9, delay: 0.15, ease: "power3.out", clearProps: "all" });
      gsap.from(".tk-r3", { y: 28, opacity: 0, filter: "blur(10px)", duration: 0.9, delay: 0.3, ease: "power3.out", clearProps: "all" });
      gsap.from(".tk-r4", { y: 28, opacity: 0, filter: "blur(10px)", duration: 1.1, delay: 0.5, ease: "power3.out", clearProps: "all" });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-x-clip" style={{ background: "#080a0f", color: "#f2f3f5", fontFamily: "var(--font-sans)" }}>
      {/* Background effects */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[1100px] overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 50% at 50% 0%, rgba(30,120,255,0.22), rgba(8,10,15,0) 70%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,10,15,0.2) 0%, rgba(8,10,15,0.55) 55%, #080a0f 100%)" }} />
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(70% 60% at 50% 20%, #000 20%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(70% 60% at 50% 20%, #000 20%, transparent 100%)",
        }} />
      </div>

      {/* Noise overlay */}
      <svg aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] h-full w-full opacity-[0.06]" style={{ mixBlendMode: "overlay" }}>
        <filter id="tk-noise"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" /></filter>
        <rect width="100%" height="100%" filter="url(#tk-noise)" />
      </svg>

      {/* Hero content */}
      <div className="relative z-[2] mx-auto flex max-w-[1200px] flex-col items-center px-6 pt-[168px] text-center">
        <h1 className="tk-r2 mx-auto max-w-[15ch] text-[clamp(44px,6.6vw,92px)] font-semibold leading-[0.98] tracking-[-0.04em]" style={{ textWrap: "balance" }}>
          Construimos productos digitales que{" "}
          <em className="font-normal not-italic" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", letterSpacing: "-0.02em", color: "#bfe9ff", textShadow: "0 0 48px rgba(30,196,255,0.35)" }}>
            transforman
          </em>{" "}
          tu negocio.
        </h1>

        <p className="tk-r3 mx-auto mt-7 max-w-[54ch] text-[17px] font-light leading-[1.55]" style={{ color: "rgba(242,243,245,0.68)" }}>
          Plataformas web, aplicaciones móviles, sistemas internos y APIs a medida. Diseñamos, desarrollamos y acompañamos después del lanzamiento.
        </p>

        <div className="tk-r3 mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/contacto" className="inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#080a0f] transition-colors hover:bg-[#e8ecf5]" style={{ boxShadow: "0 10px 40px -12px rgba(255,255,255,0.35)" }}>
            Agendar una cita
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" /></svg>
          </Link>
          <Link href="/precios" className="rounded-full border px-6 py-3.5 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/[0.09]" style={{ borderColor: "rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.04)", color: "#f2f3f5" }}>
            Ver planes
          </Link>
        </div>

        {/* Rapidito Dashboard Mockup */}
        <div className="tk-r4 relative mt-[72px] w-full max-w-[1080px]">
          <div aria-hidden="true" className="absolute inset-x-[10%] -bottom-10 h-[120px] rounded-full blur-[60px]" style={{ background: "rgba(30,120,255,0.25)" }} />
          <div className="relative overflow-hidden rounded-[18px] border text-left" style={{ borderColor: "rgba(255,255,255,0.12)", background: "#0d1017", boxShadow: "0 60px 120px -40px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
            {/* Browser chrome */}
            <div className="flex items-center gap-2.5 border-b px-4 py-3" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
              <span className="h-[11px] w-[11px] rounded-full bg-[#3a3f4b]" />
              <span className="h-[11px] w-[11px] rounded-full bg-[#3a3f4b]" />
              <span className="h-[11px] w-[11px] rounded-full bg-[#3a3f4b]" />
              <div className="mx-auto min-w-[260px] rounded-[7px] px-3.5 py-1.5 text-center text-[11.5px]" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(242,243,245,0.55)" }}>
                panel.rapidito.do — Dashboard
              </div>
            </div>

            {/* Dashboard body */}
            <div className="grid min-h-[480px] grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)]">
              {/* Sidebar */}
              <aside className="hidden border-r p-[18px_14px] md:flex md:flex-col md:gap-1" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <Image src="/Rapidito-Logo.png" alt="Rapidito" width={104} height={26} className="mb-3.5 ml-1 rounded" style={{ height: "26px", width: "auto" }} />
                <p className="mx-3 my-1.5 text-[9.5px] font-bold uppercase tracking-[0.12em]" style={{ color: "rgba(242,243,245,0.5)" }}>Gestión del menú</p>
                <SidebarItem label="Dashboard" active />
                <SidebarItem label="Categorías" />
                <SidebarItem label="Títulos" />
                <SidebarItem label="Artículos" badge="22" />
                <p className="mx-3 mt-3.5 mb-1.5 text-[9.5px] font-bold uppercase tracking-[0.12em]" style={{ color: "rgba(242,243,245,0.5)" }}>Presentación</p>
                <SidebarItem label="Plantillas" />
                <SidebarItem label="Ajustes" />
                <span className="mt-auto rounded-full bg-[#16a34a] py-2.5 text-center text-[13px] font-semibold text-white" style={{ boxShadow: "0 8px 24px -8px rgba(22,163,74,0.6)" }}>Ver la carta</span>
                <div className="mt-2.5 flex items-center gap-2.5 rounded-xl border p-2.5" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                  <span className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-full text-[11px] font-bold text-[#16a34a]" style={{ background: "rgba(22,163,74,0.18)" }}>JM</span>
                  <div>
                    <p className="text-[12.5px] font-semibold">Juan Marte</p>
                    <p className="text-[11px]" style={{ color: "rgba(242,243,245,0.5)" }}>Administrador</p>
                  </div>
                </div>
              </aside>

              {/* Main dashboard */}
              <div className="flex min-w-0 flex-col gap-[18px] p-[22px_24px]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[22px] font-extrabold leading-none tracking-[-0.03em]">Dashboard</p>
                    <p className="mt-1.5 text-[12.5px]" style={{ color: "rgba(242,243,245,0.5)" }}>Resumen general de tu carta digital</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs" style={{ borderColor: "rgba(255,255,255,0.08)", color: "rgba(242,243,245,0.5)" }}>
                      <span className="h-2.5 w-2.5 rounded-full border-[1.5px] border-current" />Buscar en el panel…
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[12.5px] font-semibold" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                      <span className="h-[7px] w-[7px] rounded-full bg-[#16a34a]" style={{ boxShadow: "0 0 10px #16a34a", animation: "tk-pulse 1.8s infinite" }} />Carta en línea
                    </span>
                  </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
                  <KpiCard label="Categorías" value="4" sub="4 activas" />
                  <KpiCard label="Títulos (secciones)" value="7" sub="en 4 categorías" />
                  <KpiCard label="Artículos" value="22" sub="21 visibles en la carta" />
                  <KpiCard label="Agotados" value="2" sub="marcados en la carta" valueColor="#f59e0b" />
                </div>

                {/* Bottom grid */}
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                  {/* Recent articles */}
                  <div className="rounded-[14px] border p-[16px_18px]" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold">Últimos artículos</p>
                      <span className="text-xs font-semibold text-[#16a34a]">Ver todos</span>
                    </div>
                    <div className="mt-1.5">
                      <ArticleRow name="Bizcocho Dominicano" cat="Bebidas y Postres · Dulces Criollos" price="RD$140.00" color="#5a3826" />
                      <ArticleRow name="Flan de Coco" cat="Bebidas y Postres · Dulces Criollos" price="RD$165.00" color="#c96a6a" />
                      <ArticleRow name="Habichuelas con Dulce" cat="Bebidas y Postres · Dulces Criollos" price="RD$150.00" color="#8a4a2a" />
                      <ArticleRow name="Batida de Lechosa" cat="Bebidas y Postres · Frías y Naturales" price="RD$135.00" color="#b03a5c" />
                    </div>
                  </div>

                  {/* Right column */}
                  <div className="flex flex-col gap-3">
                    <div className="rounded-[14px] border p-[16px_18px]" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
                      <p className="mb-2.5 text-sm font-bold">Salud del menú</p>
                      <div className="flex items-center gap-2 rounded-[10px] p-[9px_12px] text-xs" style={{ background: "rgba(245,158,11,0.12)" }}>
                        <span className="h-[7px] w-[7px] rounded-full bg-[#f59e0b]" />
                        <span className="flex-1"><strong className="font-semibold">2 agotados</strong> siguen en la carta</span>
                        <span className="font-semibold text-[#16a34a]">Revisar</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 rounded-[10px] p-[9px_12px] text-xs" style={{ background: "rgba(245,158,11,0.12)" }}>
                        <span className="h-[7px] w-[7px] rounded-full bg-[#f59e0b]" />
                        <span className="flex-1"><strong className="font-semibold">1 sin foto</strong> en la carta</span>
                        <span className="font-semibold text-[#16a34a]">Revisar</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 rounded-[14px] border p-[16px_18px]" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
                      <p className="mb-1 text-sm font-bold">Accesos rápidos</p>
                      <span className="rounded-[10px] border p-[9px_12px] text-[12.5px] font-medium" style={{ borderColor: "rgba(255,255,255,0.08)" }}><span className="mr-2 text-[#16a34a]">+</span>Nueva categoría</span>
                      <span className="rounded-[10px] border p-[9px_12px] text-[12.5px] font-medium" style={{ borderColor: "rgba(255,255,255,0.08)" }}><span className="mr-2 text-[#16a34a]">+</span>Nuevo artículo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-[18px] text-center text-xs" style={{ color: "rgba(242,243,245,0.45)" }}>
            Rapidito — panel de administración de la carta digital. Producto propio de TEKO, en producción.
          </p>
        </div>
      </div>
    </section>
  );
}

function SidebarItem({ label, active, badge }: { label: string; active?: boolean; badge?: string }) {
  return (
    <span className="flex items-center justify-between rounded-[10px] px-3 py-[9px] text-[13px]" style={{
      background: active ? "rgba(22,163,74,0.14)" : "transparent",
      color: active ? "#16a34a" : "rgba(242,243,245,0.65)",
      fontWeight: active ? 600 : 400,
    }}>
      <span className="flex items-center gap-2.5">
        <span className="h-3.5 w-3.5 rounded border-[1.5px] border-current opacity-80" />
        {label}
      </span>
      {badge && (
        <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold text-[#16a34a]" style={{ background: "rgba(22,163,74,0.16)" }}>{badge}</span>
      )}
    </span>
  );
}

function KpiCard({ label, value, sub, valueColor }: { label: string; value: string; sub: string; valueColor?: string }) {
  return (
    <div className="rounded-[14px] border p-[16px_18px]" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
      <p className="text-xs" style={{ color: "rgba(242,243,245,0.5)" }}>{label}</p>
      <p className="mt-2 text-[clamp(22px,2.2vw,30px)] font-extrabold leading-none tracking-[-0.04em]" style={{ color: valueColor || "#f2f3f5" }}>{value}</p>
      <p className="mt-2 text-[11.5px]" style={{ color: "rgba(242,243,245,0.5)" }}>{sub}</p>
    </div>
  );
}

function ArticleRow({ name, cat, price, color }: { name: string; cat: string; price: string; color: string }) {
  return (
    <div className="flex items-center gap-3 border-b py-2.5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      <span className="h-[38px] w-[38px] shrink-0 rounded-[9px]" style={{ background: color }} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold">{name}</p>
        <p className="mt-0.5 truncate text-[11.5px]" style={{ color: "rgba(242,243,245,0.5)" }}>{cat}</p>
      </div>
      <span className="whitespace-nowrap text-[13px] font-bold">{price}</span>
    </div>
  );
}
