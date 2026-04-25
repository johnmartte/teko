"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import gsap from "gsap";
import HeroGrid from "./hero-grid";

export default function SectionHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const transformanRef = useRef<HTMLSpanElement>(null);
  const futuroRef = useRef<HTMLSpanElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Líneas del título entran una por una desde abajo
      tl.from([line1Ref.current, line2Ref.current, line3Ref.current], {
        y: 60,
        opacity: 0,
        duration: 0.85,
        stagger: 0.18,
      })
        // Las palabras itálicas tienen un brillo de color
        .from(
          [transformanRef.current, futuroRef.current],
          {
            opacity: 0,
            scale: 0.92,
            duration: 0.5,
            stagger: 0.12,
          },
          "-=0.4",
        )
        // Botones suben al final
        .from(
          buttonsRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.2",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(177.332deg,#0071ff_10.397%,#ffffff_96.272%)] px-4 pt-[200px] pb-16 sm:px-6 md:px-8 dark:bg-[radial-gradient(ellipse_at_center,#15326b_0%,#0a1838_45%,#05080f_100%)]"
    >
      <HeroGrid />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center text-center">
        <div className="relative top-[-22px] w-full max-w-[1120px] md:top-[-26px] lg:h-[301.347px] lg:w-[1120px]">
          <h1
            className={cn(
              "font-advercase text-center text-[34px] font-bold leading-[42px] tracking-[-0.012em] text-white sm:text-[52px] sm:leading-[60px] md:text-[64px] md:leading-[74px] lg:text-[72px] lg:leading-[74px] dark:[text-shadow:0_2px_30px_rgba(120,160,255,0.35)]",
            )}
          >
            <span ref={line1Ref} className="block">
              Construimos productos
            </span>
            <span ref={line2Ref} className="block">
              digitales que{" "}
              <span
                ref={transformanRef}
                className={cn(
                  "font-ppeditorialold font-normal italic text-[#0047ff] lg:text-[72px] lg:leading-[74px] dark:text-[#7aa3ff] dark:[text-shadow:0_0_40px_rgba(122,163,255,0.5)]",
                )}
              >
                transforman
              </span>{" "}
              tu
            </span>
            <span ref={line3Ref} className="block">
              negocio en el{" "}
              <span
                ref={futuroRef}
                className={cn(
                  "font-ppeditorialold font-normal italic text-[#2e5fff] lg:text-[72px] lg:leading-[74px] dark:text-[#9bb8ff] dark:[text-shadow:0_0_40px_rgba(155,184,255,0.5)]",
                )}
              >
                futuro
              </span>
              .
            </span>
          </h1>
        </div>

        <div
          ref={buttonsRef}
          className="mt-1 flex w-full flex-col gap-3 px-4 sm:w-auto sm:flex-row sm:px-0"
        >
          <Button className="h-11 w-full rounded-full bg-[rgba(0,71,255,0.5)] px-7 text-[13px] font-black text-white shadow-none transition-colors hover:bg-[rgba(0,71,255,0.6)] sm:w-[140px]">
            Agenda una cita
          </Button>

          <Button className="h-11 w-full rounded-full border border-white/30 bg-white/10 px-7 text-[13px] font-medium text-[#0047ff] shadow-none backdrop-blur-md transition-colors hover:bg-white/20 sm:w-[140px] dark:text-white">
            Ver planes
          </Button>
        </div>
      </div>
    </section>
  );
}
