"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
    <section className={cn("py-16  md:py-24 ", sectionBg)}>
      <div className="mx-auto max-w-7xl px-8 sm:px-6 md:px-0">
        {/* Encabezado */}
        <div className="mb-10 flex items-center gap-4">
          {/* Número con fondo circular de color */}
          <div className={cn("flex flex-col items-center justify-center rounded-2xl px-3 py-2 min-w-14", accentBg)}>

            <span className={cn("text-2xl py-2 px-1 font-extrabold leading-none", accentText)}>
              {phase}
            </span>
          </div>

          {/* Título */}
          <div>        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {phaseLabel}
          </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {title}
            </h2></div>

        </div>

        {/* Carousel */}
        <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {cards.map((card, i) => (
              <CarouselItem
                key={i}
                className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <ServiceCard {...card} accentText={accentText} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 md:-left-6" />
          <CarouselNext className="right-2 md:-right-6" />
        </Carousel>
      </div>
    </section>
  );
}
