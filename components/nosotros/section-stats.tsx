"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 50, suffix: "+", label: "Proyectos entregados" },
  { value: 12, suffix: "", label: "Países atendidos" },
  { value: 98, suffix: "%", label: "Satisfacción cliente" },
  { value: 6, suffix: "", label: "Años de experiencia" },
];

export default function SectionStats() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = sectionRef.current?.querySelectorAll(".stat-item");
      items?.forEach((item) => {
        const numberEl = item.querySelector(".stat-number");
        const target = parseInt(numberEl?.getAttribute("data-value") || "0", 10);
        const obj = { val: 0 };

        gsap.from(item, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            once: true,
          },
        });

        gsap.to(obj, {
          val: target,
          duration: 1.5,
          ease: "power1.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            once: true,
          },
          onUpdate: () => {
            if (numberEl) numberEl.textContent = Math.round(obj.val).toString();
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-6 py-16 md:px-[100px] md:py-20"
      style={{ color: "#f2f3f5" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className="stat-item rounded-[18px] border p-6 text-center md:p-8"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
              }}
            >
              <div className="mb-2 text-[44px] font-extrabold leading-none tracking-tight md:text-[56px]" style={{ color: "#1ec4ff" }}>
                <span className="stat-number" data-value={s.value}>
                  0
                </span>
                {s.suffix}
              </div>
              <p className="text-[13px] font-medium md:text-[14px]" style={{ color: "rgba(242,243,245,0.55)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
