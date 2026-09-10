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
      className="px-6 py-16 md:px-[100px] md:py-24"
      style={{ color: "#f2f3f5" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mv-heading mb-14 max-w-[720px]">
          <span className="mb-4 inline-block text-[13px] font-semibold uppercase tracking-[0.08em]" style={{ color: "#1ec4ff" }}>
            Lo que nos mueve
          </span>
          <h2 className="mb-4 text-[clamp(28px,4vw,44px)] font-semibold leading-[1.1] tracking-[-0.03em]">
            Construimos tecnología con{" "}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", fontWeight: 400, color: "#bfe9ff" }}>propósito</em>
          </h2>
          <p className="text-[15.5px] font-light leading-[1.6]" style={{ color: "rgba(242,243,245,0.6)" }}>
            TEKO nació para cerrar la brecha entre ideas brillantes y productos
            digitales funcionando. Cuatro principios guían cada proyecto.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {valores.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="valor-card flex flex-col rounded-[18px] border p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  borderColor: "rgba(255,255,255,0.1)",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
                }}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "rgba(30,196,255,0.1)", color: "#1ec4ff" }}>
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </div>
                <h3 className="mb-2 text-[17px] font-semibold">
                  {v.title}
                </h3>
                <p className="text-[13.5px] leading-[1.6]" style={{ color: "rgba(242,243,245,0.55)" }}>
                  {v.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
