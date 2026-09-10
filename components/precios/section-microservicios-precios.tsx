"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const microservicios = [
  { name: "Menú Digital QR", desc: "Menú interactivo vía QR para restaurantes y cafeterías." },
  { name: "Badges & Certificados", desc: "Badges digitales con validación QR para cursos y eventos." },
  { name: "Flyers & Redes Sociales", desc: "Pack mensual de piezas gráficas para redes." },
  { name: "Landing Page Única", desc: "Página web con dominio y hosting incluido por 1 año." },
  { name: "Sistema de Facturación", desc: "Genera cotizaciones y facturas PDF en segundos." },
  { name: "Formulario de Pedidos", desc: "Pedidos o reservas online conectados a WhatsApp." },
  { name: "Link de Cobro", desc: "Página de pago personalizada para transferencia o tarjeta." },
  { name: "CRM Básico", desc: "Panel para gestionar contactos y seguimientos." },
  { name: "Chatbot WhatsApp", desc: "Flujos de atención al cliente 24/7." },
  { name: "Notificaciones Auto.", desc: "Recordatorios de citas, pagos o entregas por WhatsApp." },
  { name: "Tarjeta Digital NFC", desc: "Tarjeta de presentación con NFC y QR." },
  { name: "Kit Redes Sociales", desc: "Plantillas de portadas, stories y posts editables." },
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
      className="px-6 py-16 md:px-[100px] md:py-24"
      style={{ color: "#f2f3f5" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="ms-heading mb-12 max-w-[720px]">
          <span className="mb-4 inline-block text-[13px] font-semibold uppercase tracking-[0.08em]" style={{ color: "#1ec4ff" }}>
            Microservicios
          </span>
          <h2 className="mb-4 text-[clamp(28px,4vw,40px)] font-semibold leading-[1.1] tracking-[-0.03em]">
            Soluciones puntuales listas para usar
          </h2>
          <p className="text-[15.5px] font-light leading-[1.6]" style={{ color: "rgba(242,243,245,0.6)" }}>
            Entregables independientes listos para usar. Cotiza directamente con nosotros para conocer el precio.
          </p>
        </div>

        <div className="overflow-hidden rounded-[18px] border" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <div
            className="hidden px-6 py-4 md:grid md:grid-cols-[1fr_2fr]  md:gap-6"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: "rgba(242,243,245,0.5)" }}>
              Microservicio
            </span>
            <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: "rgba(242,243,245,0.5)" }}>
              Qué incluye
            </span>
          </div>

          <div>
            {microservicios.map((m, i) => (
              <div
                key={i}
                className="ms-row grid grid-cols-1 gap-2 border-t px-6 py-5 transition-colors hover:bg-white/[0.03] md:grid-cols-[1fr_2fr] md:items-center md:gap-6"
                style={{ borderColor: "rgba(255,255,255,0.07)" }}
              >
                <span className="text-[15px] font-semibold">
                  {m.name}
                </span>
                <span className="text-[14px] leading-[20px]" style={{ color: "rgba(242,243,245,0.55)" }}>
                  {m.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
