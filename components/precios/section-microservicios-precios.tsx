"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const microservicios = [
  { name: "Menú Digital QR", price: "149", desc: "Menú interactivo vía QR para restaurantes y cafeterías." },
  { name: "Badges & Certificados", price: "199", desc: "Badges digitales con validación QR para cursos y eventos." },
  { name: "Flyers & Redes Sociales", price: "89/mes", desc: "Pack mensual de piezas gráficas para redes." },
  { name: "Landing Page Única", price: "349", desc: "Página web con dominio y hosting incluido por 1 año." },
  { name: "Sistema de Facturación", price: "299", desc: "Genera cotizaciones y facturas PDF en segundos." },
  { name: "Formulario de Pedidos", price: "249", desc: "Pedidos o reservas online conectados a WhatsApp." },
  { name: "Link de Cobro", price: "179", desc: "Página de pago personalizada para transferencia o tarjeta." },
  { name: "CRM Básico", price: "399", desc: "Panel para gestionar contactos y seguimientos." },
  { name: "Chatbot WhatsApp", price: "299", desc: "Flujos de atención al cliente 24/7." },
  { name: "Notificaciones Auto.", price: "149", desc: "Recordatorios de citas, pagos o entregas por WhatsApp." },
  { name: "Tarjeta Digital NFC", price: "79", desc: "Tarjeta de presentación con NFC y QR." },
  { name: "Kit Redes Sociales", price: "129", desc: "Plantillas de portadas, stories y posts editables." },
];

export default function SectionMicroserviciosPrecios() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".ms-heading", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: ".ms-heading",
          start: "top 90%",
          once: true,
        },
      });

      const rows = sectionRef.current?.querySelectorAll(".ms-row");
      if (rows && rows.length) {
        gsap.from(rows, {
          y: 20,
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.05,
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: rows[0],
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
      <div className="ms-heading mb-12 max-w-[720px]">
        <span className="mb-4 inline-block text-[13px] font-semibold uppercase tracking-wider text-[#0047ff]">
          Fase 04 · Microservicios
        </span>
        <h2 className="mb-4 text-[34px] font-extrabold tracking-[-0.06em] text-[#101828] dark:text-white md:text-[40px] md:leading-[48px]">
          Soluciones puntuales a precio cerrado
        </h2>
        <p className="text-[16px] leading-[26px] text-[#7a8595] dark:text-[#a1a8b3]">
          Entregables independientes listos para usar. Sin complejidad técnica,
          sin costos ocultos.
        </p>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-[#e5e7eb] dark:border-white/10">
        <div className="hidden bg-[#f4f7ff] dark:bg-[#0a0e1a] px-6 py-4 md:grid md:grid-cols-[1fr_2fr_140px] md:gap-6">
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#252b37] dark:text-white">
            Microservicio
          </span>
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#252b37] dark:text-white">
            Qué incluye
          </span>
          <span className="text-right text-[12px] font-bold uppercase tracking-wider text-[#252b37] dark:text-white">
            Desde
          </span>
        </div>

        <div className="divide-y divide-[#e5e7eb] dark:divide-white/10 bg-white dark:bg-[#141a2b]">
          {microservicios.map((m, i) => (
            <div
              key={i}
              className="ms-row grid grid-cols-1 gap-2 px-6 py-5 transition-colors hover:bg-[#f4f7ff] dark:hover:bg-white/5 md:grid-cols-[1fr_2fr_140px] md:items-center md:gap-6"
            >
              <span className="text-[15px] font-semibold text-[#101828] dark:text-white">
                {m.name}
              </span>
              <span className="text-[14px] leading-[20px] text-[#7a8595] dark:text-[#a1a8b3]">
                {m.desc}
              </span>
              <span className="text-left text-[18px] font-bold text-[#0047ff] md:text-right">
                US${m.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
