"use client";

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
  return (
    <section className={cn("py-[80px]", sectionBg)}>
      <div className="mx-auto max-w-[1280px] px-6 md:px-[100px]">
        {/* Encabezado */}
        <div className="mb-12 flex items-center gap-4">
          {/* Número con fondo circular de color */}
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

          {/* Título */}
          <div>
            <span className={cn("text-[12px] font-semibold uppercase tracking-[1.2px]", accentText)}>
              {phaseLabel}
            </span>
            <h2 className="text-[30px] font-extrabold leading-[43.2px] tracking-[-0.576px] text-[#101828]">
              {title}
            </h2>
          </div>
        </div>

        {/* Cards desplazables horizontalmente */}
        <div className="flex gap-[29px] overflow-x-auto overflow-y-visible py-[1px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {cards.map((card, i) => (
            <ServiceCard key={i} {...card} accentText={accentText} />
          ))}
        </div>
      </div>
    </section>
  );
}
