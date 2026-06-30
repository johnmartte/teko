"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ServiceCard } from "@/components/globales/service-card";
import { cn } from "@/lib/utils";
import type { ServiceSectionProps } from "@/shared/types";

export function SectionServicios({
  phase,
  phaseLabel = "FASE",
  title,
  accentBg = "bg-slate-100",
  accentText = "text-slate-600",
  sectionBg = "bg-background",
  cards,
}: ServiceSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
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

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -340 : 340, behavior: "smooth" });
  };

  return (
    <section className={cn("py-[80px]", sectionBg)}>
      <div className="mx-auto max-w-[1280px] px-6 md:px-[100px]">
        {/* Encabezado */}
        <div className="mb-12 flex items-center gap-4">
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl",
              accentBg,
            )}
          >
            <span className={cn("text-[17.6px] font-black leading-[26.4px]", accentText)}>
              {phase}
            </span>
          </div>

          <div className="flex-1">
            <span className={cn("text-[12px] font-semibold uppercase tracking-[1.2px]", accentText)}>
              {phaseLabel}
            </span>
            <h2 className="text-[30px] font-extrabold leading-[43.2px] tracking-[-0.576px] text-[#101828] dark:text-white">
              {title}
            </h2>
          </div>

          {/* Flechas de navegación */}
          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Anterior"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d5d7da] bg-white text-[#252b37] transition-all duration-200 hover:bg-[#f4f7ff] disabled:pointer-events-none disabled:opacity-30 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Siguiente"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d5d7da] bg-white text-[#252b37] transition-all duration-200 hover:bg-[#f4f7ff] disabled:pointer-events-none disabled:opacity-30 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Cards desplazables con gradientes indicadores */}
        <div className="relative">
          <div
            className={cn(
              "pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-white to-transparent transition-opacity duration-300 dark:from-[#05080f]",
              canScrollLeft ? "opacity-100" : "opacity-0",
            )}
          />
          <div
            className={cn(
              "pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-white to-transparent transition-opacity duration-300 dark:from-[#05080f]",
              canScrollRight ? "opacity-100" : "opacity-0",
            )}
          />

          <div
            ref={scrollRef}
            className="flex gap-[29px] overflow-x-auto overflow-y-visible py-[1px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {cards.map((card, i) => (
              <ServiceCard key={i} {...card} accentText={accentText} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
