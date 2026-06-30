"use client";

import { useEffect, useRef } from "react";
import { Check, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WS_LINK =
  "https://wa.me/18092000000?text=Hola%2C%20me%20interesa%20cotizar%20un%20plan";

const planes = [
  {
    name: "Starter",
    tagline: "Para emprendimientos y primeros pasos digitales.",
    highlight: false,
    features: [
      "1 microservicio a elección",
      "Diseño y desarrollo incluidos",
      "Hosting + dominio por 1 año",
      "Soporte por email (72h)",
      "Entrega en 2-3 semanas",
    ],
  },
  {
    name: "Pro",
    tagline: "El plan favorito para negocios en crecimiento.",
    highlight: true,
    features: [
      "Landing o app web completa",
      "Branding + identidad visual",
      "Integraciones (pagos, CRM, WhatsApp)",
      "SEO y analítica configurados",
      "Soporte prioritario (24h)",
      "3 rondas de revisiones",
    ],
  },
  {
    name: "Enterprise",
    tagline: "Transformación digital integral para empresas.",
    highlight: false,
    features: [
      "Producto digital a medida",
      "Arquitectura cloud escalable",
      "DevOps + CI/CD completo",
      "Equipo dedicado",
      "SLA y soporte 24/7",
      "Consultoría tecnológica continua",
    ],
  },
];

export default function SectionPlanes() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll(".plan-card");
      if (cards) {
        gsap.from(cards, {
          y: 60,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.15,
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: cards[0],
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
      className="mx-auto w-full max-w-[1240px] px-6 py-14 md:px-[80px] md:py-20"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {planes.map((p, i) => (
          <div
            key={i}
            className={`plan-card relative flex flex-col rounded-[24px] p-6 transition-all duration-300 sm:p-8 ${
              p.highlight
                ? "bg-[#101828] text-white shadow-2xl lg:-translate-y-4"
                : "border border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-[#141a2b] text-[#101828] dark:text-white hover:shadow-lg"
            }`}
          >
            {p.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#00d7f2] px-4 py-1 text-[11px] font-bold uppercase tracking-wide text-[#101828]">
                Más popular
              </div>
            )}

            <h3 className="mb-1 text-[22px] font-bold">{p.name}</h3>
            <p
              className={`mb-6 text-[13px] leading-[20px] ${
                p.highlight ? "text-white/70" : "text-[#7a8595] dark:text-[#a1a8b3]"
              }`}
            >
              {p.tagline}
            </p>

            <ul className="mb-8 flex flex-1 flex-col gap-3">
              {p.features.map((f, j) => (
                <li key={j} className="flex items-start gap-3 text-[14px]">
                  <Check
                    className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                      p.highlight ? "text-[#00d7f2]" : "text-[#0047ff]"
                    }`}
                    strokeWidth={3}
                  />
                  <span
                    className={p.highlight ? "text-white/90" : "text-[#252b37] dark:text-white"}
                  >
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href={`${WS_LINK}%20${encodeURIComponent(p.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[14px] font-semibold transition-all ${
                p.highlight
                  ? "bg-white text-[#101828] hover:bg-[#f4f7ff]"
                  : "bg-[#101828] dark:bg-white text-white dark:text-[#0a0e1a] hover:bg-[#252b37] dark:hover:bg-white/90"
              }`}
            >
              Cotizar {p.name}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
