"use client";

import { useEffect, useRef } from "react";
import { Target, Zap, Users, Award } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const valores = [
  {
    icon: Target,
    title: "Enfoque en resultados",
    description:
      "No vendemos horas, vendemos impacto. Cada decisión técnica está alineada con tus objetivos de negocio.",
  },
  {
    icon: Zap,
    title: "Velocidad sin fricción",
    description:
      "Entregamos rápido sin sacrificar calidad. Sprints cortos, feedback continuo, productos que funcionan.",
  },
  {
    icon: Users,
    title: "Partnership real",
    description:
      "Somos una extensión de tu equipo. Pensamos contigo, no solo ejecutamos lo que pides.",
  },
  {
    icon: Award,
    title: "Calidad técnica",
    description:
      "Código limpio, arquitectura escalable y stacks modernos. Construimos para que perdure.",
  },
];

export default function SectionMisionValores() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".mv-heading", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: ".mv-heading",
          start: "top 90%",
          once: true,
        },
      });

      const cards = sectionRef.current?.querySelectorAll(".valor-card");
      if (cards && cards.length) {
        gsap.from(cards, {
          y: 50,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.12,
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: cards[0],
            start: "top 90%",
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
      className="mx-auto w-full max-w-[1240px] px-6 py-16 md:px-[80px] md:py-24"
    >
      <div className="mv-heading mb-14 max-w-[720px]">
        <span className="mb-4 inline-block text-[13px] font-semibold uppercase tracking-wider text-[#0047ff]">
          Lo que nos mueve
        </span>
        <h2 className="mb-4 text-[34px] font-extrabold tracking-[-0.06em] text-[#101828] dark:text-white md:text-[44px] md:leading-[52px]">
          Construimos tecnología con propósito
        </h2>
        <p className="text-[16px] leading-[26px] text-[#7a8595] dark:text-[#a1a8b3]">
          TEKO nació para cerrar la brecha entre ideas brillantes y productos
          digitales funcionando. Cuatro principios guían cada proyecto.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {valores.map((v, i) => {
          const Icon = v.icon;
          return (
            <div
              key={i}
              className="valor-card flex flex-col rounded-[20px] border border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-[#141a2b] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#0047ff]/30 hover:shadow-lg"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f4f7ff] dark:bg-[#0a0e1a] text-[#0047ff]">
                <Icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="mb-2 text-[18px] font-semibold text-[#101828] dark:text-white">
                {v.title}
              </h3>
              <p className="text-[14px] leading-[22px] text-[#7a8595] dark:text-[#a1a8b3]">
                {v.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
