"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { data_hacemos_mejor_cards } from "@/Data/home/hacemos-mejor-cards";
import { Card, CardHeader, CardContent } from "../ui/card";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export default function SectionHacemosMejor() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Animación del encabezado
      gsap.from(headingRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          once: true,
        },
      });

      // Animación escalonada de las cards
      const cards = cardsRef.current?.querySelectorAll(".service-card");
      if (cards) {
        gsap.from(cards, {
          y: 60,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
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
      className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 pb-14 pt-12 md:px-[80px] md:pb-20 md:pt-[50px]"
    >
      {/* Encabezado y Botón adaptables */}
      <div
        ref={headingRef}
        className="flex w-full flex-col items-start justify-between gap-6 md:flex-row md:items-end"
      >
        <div className="flex max-w-[700px] flex-col items-start">
          <h2 className="mb-3 text-[34px] font-extrabold tracking-[-0.06em] text-[#101828] md:text-[40px] md:leading-[48px] dark:text-white">
            Lo que hacemos mejor
          </h2>
          <p className="text-[14px] font-normal leading-[24px] text-[#99a1af]">
            Un ecosistema completo de servicios digitales para llevar tu negocio
            al siguiente nivel. La transformación digital de tu negocio empieza en
            TEKO.
          </p>
        </div>

        <Link
          href="/servicios"
          className="inline-flex h-[48px] w-full items-center justify-center whitespace-nowrap rounded-full border border-[#d5d7da] bg-transparent px-6 text-[14px] font-semibold text-[#252b37] transition-colors hover:bg-[#f4f7ff] sm:w-auto dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
        >
          Ver todos los servicios <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>

      {/* Grid responsivo */}
      <div
        ref={cardsRef}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4"
      >
        {data_hacemos_mejor_cards.map((card, index) => (
          <Card
            key={index}
            className="service-card flex h-full min-h-[390px] flex-col justify-between rounded-[24px] border-none bg-[#f4f7ff] p-0 shadow-none transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:shadow-lg dark:bg-[#141a2b] dark:hover:shadow-[0_8px_30px_-12px_rgba(0,71,255,0.45)]"
          >
            <CardHeader className="flex min-h-[220px] items-center justify-center p-6 pb-4">
              {card.image}
            </CardHeader>
            <CardContent className="px-6 pb-6 text-left">
              <h3 className="mb-2 text-[20px] font-semibold leading-[26px] text-[#101828] dark:text-white">
                {card.titulo}
              </h3>
              <p className="text-[14px] leading-[22px] text-[#7a8595]">
                {card.descripcion}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
