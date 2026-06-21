"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import gsap from "gsap";

type PageHeroProps = {
  badge: string;
  title: React.ReactNode;
  description: string;
};

export default function PageHero({ badge, title, description }: PageHeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", clearProps: "transform,opacity" },
      });
      tl.from(".hero-back", { x: -20, opacity: 0, duration: 0.5 })
        .from(".hero-badge", { y: 15, opacity: 0, duration: 0.5 }, "-=0.2")
        .from(".hero-title", { y: 30, opacity: 0, duration: 0.7 }, "-=0.2")
        .from(".hero-description", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4");
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="bg-[#f3f4f6] dark:bg-[#0a0e1a] px-4 pb-12 pt-[96px] sm:px-6 sm:pb-16 sm:pt-[102px] md:px-[100px] md:pt-[122px]"
    >
      <div className="mx-auto max-w-[1240px]">
        <Link
          href="/"
          className="hero-back inline-flex items-center text-[14px] font-medium leading-[20px] text-[#101828] dark:text-white transition-colors hover:text-[#2563eb]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Link>

        <div className="mt-6 max-w-[976px] sm:mt-7">
          <div className="hero-badge group relative mb-5 inline-flex h-[34px] items-center gap-2.5 overflow-hidden rounded-full border border-white/40 bg-gradient-to-r from-[#1ec4ff] via-[#1082ff] to-[#0047ff] px-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_4px_18px_-4px_rgba(16,130,255,0.55)] sm:mb-7 dark:border-white/10 dark:from-[#1ec4ff]/20 dark:via-[#1082ff]/20 dark:to-[#0047ff]/20 dark:text-white dark:shadow-[0_0_25px_-2px_rgba(30,196,255,0.35)] dark:backdrop-blur-md">
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75 dark:bg-[#1ec4ff]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white dark:bg-[#1ec4ff]" />
            </span>
            {badge}
          </div>

          <h1 className="hero-title mb-5 text-[32px] font-extrabold leading-[1.05] tracking-[-0.02em] text-[#101828] dark:text-white sm:text-[38px] sm:leading-[1.02] sm:tracking-[-0.03em] md:mb-6 md:text-[51.2px] md:leading-[56.32px] md:tracking-[-1.792px]">
            {title}
          </h1>

          <p className="hero-description max-w-[560px] text-[14px] leading-[22px] text-[#101828] dark:text-[#a1a8b3] sm:leading-[25.2px]">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
