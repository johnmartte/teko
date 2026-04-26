"use client";

import { useEffect, useRef } from "react";
import { Button } from "@base-ui/react";
import Image from "next/image";
import { Input } from "../ui/input";
import {
  ArrowRight,
  MessageSquare,
  Code,
  Database,
  Cloud,
  LayoutGrid,
  Share2,
} from "lucide-react";
import Background from "@/public/Background-seccion.svg";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SectionAhorraTiempo() {
  const icons = [MessageSquare, Code, Database, Cloud, LayoutGrid, Share2];

  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Contenido de texto y CTA
      const contentElements = contentRef.current?.children;
      if (contentElements) {
        gsap.from(contentElements, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 85%",
            once: true,
          },
        });
      }

      // Iconos con efecto pop escalonado
      const iconBoxes = iconsRef.current?.querySelectorAll(".icon-box");
      if (iconBoxes) {
        gsap.from(iconBoxes, {
          y: 30,
          opacity: 0,
          scale: 0.7,
          duration: 0.5,
          ease: "back.out(1.7)",
          stagger: 0.08,
          scrollTrigger: {
            trigger: iconsRef.current,
            start: "top 85%",
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[500px] items-center justify-center overflow-hidden px-4 py-16 md:px-8 md:py-24"
    >
      <Image
        className="absolute inset-0 -z-10 h-full w-full object-cover dark:opacity-20"
        src={Background}
        alt="Background"
      />
      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center justify-between gap-10 rounded-3xl bg-gradient-to-br from-[#eaf4ff] to-white/60 p-6 shadow-sm backdrop-blur-md sm:p-8 md:gap-12 md:rounded-[2.5rem] md:p-14 lg:flex-row dark:border dark:border-white/10 dark:from-[#141a2b] dark:to-[#141a2b] dark:shadow-[0_8px_40px_-12px_rgba(0,71,255,0.4)]">
        <div
          ref={contentRef}
          className="max-w-xl space-y-6 text-center lg:text-left"
        >
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#007aff] sm:text-4xl md:text-5xl dark:text-[#3b8bff]">
            Ahorra Tiempo, Dinero <br className="hidden md:block" />y Escala tu
            Negocio.
          </h2>
          <p className="text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
            TEKO se integra con las plataformas que ya usas, facilitando
            unificar todo en un solo lugar para potenciar tu operación digital.
          </p>

          <div className="flex w-full flex-col items-center justify-center gap-3 pt-2 sm:flex-row lg:justify-start">
            <Input
              type="email"
              placeholder="Tu email de trabajo"
              className="h-14 w-full flex-1 rounded-full border-none bg-slate-50/80 px-6 text-base shadow-inner focus-visible:ring-1 focus-visible:ring-[#007aff] sm:w-auto"
            />
            <Button className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-slate-950 px-8 font-medium text-white hover:bg-slate-800 sm:w-auto">
              Empezar <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        <div
          ref={iconsRef}
          className="grid w-full max-w-[260px] grid-cols-3 place-items-center gap-3 sm:max-w-none sm:gap-5"
        >
          {icons.map((Icon, index) => (
            <div
              key={index}
              className="icon-box flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-transform hover:-translate-y-1 sm:h-16 sm:w-16 md:h-[72px] md:w-[72px] dark:bg-[#1a2138] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
            >
              <Icon className="h-5 w-5 stroke-[1.5] text-slate-600 sm:h-6 sm:w-6 md:h-7 md:w-7 dark:text-slate-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
