"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import gsap from "gsap";
import HeroGrid from "./hero-grid";
import { prefersReducedMotion } from "@/lib/motion";

export default function SectionHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const transformanRef = useRef<HTMLSpanElement>(null);
  const futuroRef = useRef<HTMLSpanElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // Blur-rise: las líneas suben mientras se enfocan
      tl.from([line1Ref.current, line2Ref.current, line3Ref.current], {
        y: 48,
        opacity: 0,
        filter: "blur(12px)",
        duration: 1.0,
        stagger: 0.17,
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
          "-=0.55",
        )
        // Botones suben al final
        .from(
          buttonsRef.current,
          {
            y: 28,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.35",
        )
        // Los chips se "posan" uno a uno sobre la retícula
        .from(
          chipsRef.current ? Array.from(chipsRef.current.children) : [],
          {
            y: 14,
            opacity: 0,
            filter: "blur(6px)",
            duration: 0.5,
            stagger: 0.12,
          },
          "-=0.3",
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
              digitales que<br className="sm:hidden" />{" "}
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
          <Link
            href="/contacto"
            className="flex h-11 w-full items-center justify-center rounded-full bg-gradient-to-b from-[#1ec4ff] via-[#0b6eff] to-[#0047ff] px-7 text-[13px] font-black text-white whitespace-nowrap shadow-[0_8px_24px_-6px_rgba(11,110,255,0.6)] transition-[box-shadow,transform,filter] duration-200 ease-out hover:shadow-[0_10px_30px_-6px_rgba(11,110,255,0.8)] hover:brightness-110 active:scale-[0.97] sm:w-[140px]"
          >
            Agendar cita
          </Link>

          <Link
            href="/precios"
            className="flex h-11 w-full items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 text-[13px] font-medium text-[#0047ff] shadow-none backdrop-blur-md transition-[background-color,transform] duration-200 ease-out hover:bg-white/20 active:scale-[0.97] sm:w-[140px] dark:text-white"
          >
            Ver planes
          </Link>
        </div>

        {/* Prueba social: chips de vidrio posados sobre la retícula */}
        <div
          ref={chipsRef}
          className="mt-10 flex flex-wrap items-center justify-center gap-2.5 px-4 sm:gap-3"
        >
          {[
            "+50 proyectos entregados",
            "Web · Mobile · Sistemas",
            "Soporte y evolución continua",
          ].map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-[#0047ff]/20 bg-[#0047ff]/10 px-4 py-1.5 text-[12px] font-medium text-[#0047ff] shadow-[inset_0_1px_1px_rgba(0,71,255,0.1)] backdrop-blur-md dark:border-white/15 dark:bg-white/5 dark:text-white dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-[#0047ff] dark:bg-[#00d7f2]"
              />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
