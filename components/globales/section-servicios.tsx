"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ServiceSectionProps } from "@/shared/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";
import ReactMarkdown from "react-markdown";

gsap.registerPlugin(ScrollTrigger);

export function SectionServicios({
  phase,
  phaseLabel = "FASE",
  title,
  accentColor = "#1ec4ff",
  cards,
}: ServiceSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const els = sectionRef.current?.querySelectorAll("[data-reveal]");
      if (!els) return;
      els.forEach((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) return;
        gsap.set(el, { opacity: 0, y: 18 });
        gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -340 : 340, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="py-[80px]" style={{ color: "#f2f3f5" }}>
      <div className="mx-auto max-w-[1200px] px-6 md:px-[100px]">
        {/* Header */}
        <div data-reveal="" className="mb-12 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: `${accentColor}15` }}>
            <span className="text-[17.6px] font-black leading-[26.4px]" style={{ color: accentColor }}>
              {phase}
            </span>
          </div>

          <div className="flex-1">
            <span className="text-[12px] font-semibold uppercase tracking-[1.2px]" style={{ color: accentColor }}>
              {phaseLabel}
            </span>
            <h2 className="text-[clamp(24px,3vw,32px)] font-semibold leading-[1.15] tracking-[-0.02em]">
              {title}
            </h2>
          </div>

          {/* Scroll arrows */}
          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Anterior"
              className="flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 hover:bg-white/[0.08] disabled:pointer-events-none disabled:opacity-30"
              style={{ borderColor: "rgba(255,255,255,0.15)", color: "#f2f3f5" }}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Siguiente"
              className="flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 hover:bg-white/[0.08] disabled:pointer-events-none disabled:opacity-30"
              style={{ borderColor: "rgba(255,255,255,0.15)", color: "#f2f3f5" }}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable cards */}
        <div className="relative">
          <div
            className={cn(
              "pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-[#080a0f] to-transparent transition-opacity duration-300",
              canScrollLeft ? "opacity-100" : "opacity-0",
            )}
          />
          <div
            className={cn(
              "pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-[#080a0f] to-transparent transition-opacity duration-300",
              canScrollRight ? "opacity-100" : "opacity-0",
            )}
          />

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto overflow-y-visible py-[1px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {cards.map((card, i) => (
              <DarkServiceCard key={i} {...card} accentColor={accentColor} data-reveal="" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DarkServiceCard({ icon, badge, title, description, accentColor = "#1ec4ff", ...rest }: {
  icon: React.ReactNode;
  badge: string;
  title: string;
  description: string;
  accentColor?: string;
  [key: string]: unknown;
}) {
  return (
    <article
      {...rest}
      className="flex min-h-[274px] w-[312px] shrink-0 flex-col overflow-hidden rounded-[18px] border p-6"
      style={{ borderColor: "rgba(255,255,255,0.1)", background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))" }}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-[12px]" style={{ background: `${accentColor}15`, color: accentColor }}>
          {icon}
        </span>
        <span className="rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: `${accentColor}30`, color: accentColor }}>
          {badge}
        </span>
      </div>

      <h3 className="mt-5 text-[16.8px] font-semibold leading-[1.3] tracking-[-0.01em]">{title}</h3>

      <div
        className="tk-list-accent mt-3 text-[13.5px] leading-[1.6] [&_ul]:list-none [&_ul]:space-y-[8px] [&_ul]:p-0 [&_li]:relative [&_li]:pl-4 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[7px] [&_li]:before:h-[5px] [&_li]:before:w-[5px] [&_li]:before:rounded-full [&_li]:before:opacity-50 [&_p]:m-0"
        style={{ color: "rgba(242,243,245,0.55)", "--accent": accentColor } as React.CSSProperties}
      >
        <ReactMarkdown>{description}</ReactMarkdown>
      </div>
    </article>
  );
}
