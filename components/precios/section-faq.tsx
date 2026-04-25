"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: "¿Puedo cambiar de plan en cualquier momento?",
    a: "Sí. Puedes subir o bajar de plan cuando lo necesites. Si estás en un plan de proyecto cerrado, podemos migrarte a un retainer mensual al finalizar.",
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Aceptamos transferencia bancaria, tarjeta de crédito/débito (Stripe), PayPal y criptomonedas. Para proyectos grandes ofrecemos planes de pago en 2-3 cuotas.",
  },
  {
    q: "¿Los precios incluyen hosting y dominio?",
    a: "Los planes Starter y Pro incluyen hosting y dominio por el primer año. Luego se renueva a costo de proveedor (aprox. US$15-50/año según servicio).",
  },
  {
    q: "¿Qué pasa si necesito algo que no está en ningún plan?",
    a: "Cotizamos soluciones a medida. Agenda una llamada gratuita y armamos un alcance específico para tu caso.",
  },
  {
    q: "¿Trabajan con clientes fuera de US y LATAM?",
    a: "Sí, pero nuestro enfoque principal son esas regiones por zona horaria y contexto de mercado. Para otros países evaluamos caso por caso.",
  },
  {
    q: "¿Cuánto tiempo toma un proyecto?",
    a: "Microservicios: 1-2 semanas. Plan Pro: 4-6 semanas. Enterprise: 8+ semanas dependiendo del alcance. Siempre damos un cronograma claro antes de empezar.",
  },
];

export default function SectionFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".faq-heading", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: ".faq-heading",
          start: "top 90%",
          once: true,
        },
      });

      const items = sectionRef.current?.querySelectorAll(".faq-item");
      if (items && items.length) {
        gsap.from(items, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.08,
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: items[0],
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
      className="mx-auto w-full max-w-[960px] px-6 pb-24 pt-8 md:px-[80px] md:pb-32"
    >
      <div className="faq-heading mb-12 text-center">
        <h2 className="mb-4 text-[34px] font-extrabold tracking-[-0.06em] text-[#101828] dark:text-white md:text-[40px] md:leading-[48px]">
          Preguntas frecuentes
        </h2>
        <p className="mx-auto max-w-[560px] text-[16px] leading-[26px] text-[#7a8595] dark:text-[#a1a8b3]">
          Todo lo que necesitas saber antes de empezar con TEKO.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {faqs.map((f, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="faq-item overflow-hidden rounded-[16px] border border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-[#141a2b] transition-colors hover:border-[#0047ff]/30"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="text-[16px] font-semibold text-[#101828] dark:text-white">
                  {f.q}
                </span>
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                    isOpen ? "bg-[#0047ff] text-white" : "bg-[#f4f7ff] dark:bg-[#0a0e1a] text-[#101828] dark:text-white"
                  }`}
                >
                  {isOpen ? (
                    <Minus className="h-4 w-4" strokeWidth={2.5} />
                  ) : (
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                  )}
                </div>
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-[14px] leading-[22px] text-[#7a8595] dark:text-[#a1a8b3]">
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
