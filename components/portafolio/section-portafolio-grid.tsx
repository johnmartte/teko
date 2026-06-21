"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import CitasMedicasLight from "@/public/portafolio/citas-medicas-light.png";
import CitasMedicasDark from "@/public/portafolio/citas-medicas-dark.png";
import DeliveryLight from "@/public/portafolio/delivery-light.png";
import DeliveryDark from "@/public/portafolio/delivery-dark.png";
import FintechLight from "@/public/portafolio/identidad-fintech-light.png";
import FintechDark from "@/public/portafolio/identidad-fintech-dark.png";
import CrmLight from "@/public/portafolio/crm-light.png";
import CrmDark from "@/public/portafolio/crm-dark.png";
import EcommerceLight from "@/public/portafolio/ecommerce-light.png";
import EcommerceDark from "@/public/portafolio/ecommerce-dark.png";
import BarberiaLight from "@/public/portafolio/barberia-light.png";
import BarberiaDark from "@/public/portafolio/barberia-dark.png";
import LandingLight from "@/public/portafolio/landing-light.png";
import LandingDark from "@/public/portafolio/landing-dark.png";
import FacturaLight from "@/public/portafolio/factura-light.png";
import FacturaDark from "@/public/portafolio/factura-dark.png";
import BrandingLight from "@/public/portafolio/branding-light.png";
import BrandingDark from "@/public/portafolio/branding-dark.png";

gsap.registerPlugin(ScrollTrigger);

const categories = ["Todos", "Web", "Mobile", "Branding", "Sistemas"] as const;
type Category = (typeof categories)[number];

type Project = {
  title: string;
  category: Exclude<Category, "Todos">;
  client: string;
  description: string;
  metric: string;
  imageLight: StaticImageData;
  imageDark: StaticImageData;
};

const projects: Project[] = [
  {
    title: "Plataforma de citas médicas",
    category: "Web",
    client: "HealthCare LATAM",
    description:
      "Sistema de agendamiento online con integración a calendarios y recordatorios automáticos.",
    metric: "+40% conversión",
    imageLight: CitasMedicasLight,
    imageDark: CitasMedicasDark,
  },
  {
    title: "App de delivery gastronómico",
    category: "Mobile",
    client: "FoodExpress",
    description:
      "Aplicación nativa iOS/Android con tracking en tiempo real y pagos integrados.",
    metric: "50k+ descargas",
    imageLight: DeliveryLight,
    imageDark: DeliveryDark,
  },
  {
    title: "Identidad visual — Fintech",
    category: "Branding",
    client: "PayFlow",
    description:
      "Rebrand completo: logo, design system, guía de marca y aplicaciones digitales.",
    metric: "Brand kit completo",
    imageLight: FintechLight,
    imageDark: FintechDark,
  },
  {
    title: "CRM empresarial a medida",
    category: "Sistemas",
    client: "VentasPro",
    description:
      "Panel de gestión de clientes, pipelines y automatización de seguimientos.",
    metric: "-60% tiempo operativo",
    imageLight: CrmLight,
    imageDark: CrmDark,
  },
  {
    title: "E-commerce de moda",
    category: "Web",
    client: "Urban Style",
    description:
      "Tienda online con catálogo dinámico, pagos y gestión de inventario.",
    metric: "+220% ventas online",
    imageLight: EcommerceLight,
    imageDark: EcommerceDark,
  },
  {
    title: "App de reservas de barbería",
    category: "Mobile",
    client: "BarberNow",
    description:
      "Reservas por WhatsApp, panel de profesionales y recordatorios automáticos.",
    metric: "3min tiempo de reserva",
    imageLight: BarberiaLight,
    imageDark: BarberiaDark,
  },
  {
    title: "Landing page SaaS B2B",
    category: "Web",
    client: "Cloudify",
    description:
      "Landing conversión con animaciones, A/B testing y analítica integrada.",
    metric: "+180% leads calificados",
    imageLight: LandingLight,
    imageDark: LandingDark,
  },
  {
    title: "Sistema de facturación fiscal",
    category: "Sistemas",
    client: "ContaFiscal",
    description:
      "Generación de facturas electrónicas con validación y envío automático.",
    metric: "10k+ facturas/mes",
    imageLight: FacturaLight,
    imageDark: FacturaDark,
  },
  {
    title: "Branding — Agencia creativa",
    category: "Branding",
    client: "Neon Studio",
    description:
      "Nueva identidad con paleta moderna, tipografía editorial y aplicaciones.",
    metric: "Design system v1.0",
    imageLight: BrandingLight,
    imageDark: BrandingDark,
  },
];

export default function SectionPortafolioGrid() {
  const [filter, setFilter] = useState<Category>("Todos");
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered =
    filter === "Todos" ? projects : projects.filter((p) => p.category === filter);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll(".project-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.08,
            clearProps: "transform,opacity",
          },
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [filter]);

  return (
    <section
      ref={sectionRef}
      className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-10 sm:px-6 md:px-[80px] md:pb-28 md:pt-14"
    >
      {/* Filtros */}
      <div className="mb-10 flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`h-10 rounded-full px-5 text-[13px] font-semibold transition-all ${
              filter === cat
                ? "bg-[#101828] dark:bg-white text-white dark:text-[#0a0e1a]"
                : "border border-[#d5d7da] dark:border-white/10 bg-white dark:bg-[#141a2b] text-[#252b37] dark:text-white hover:bg-[#f4f7ff] dark:hover:bg-white/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de proyectos */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((p, i) => (
          <article
            key={`${filter}-${i}`}
            className="project-card group relative flex flex-col overflow-hidden rounded-[24px] border border-[#e6eaf2] bg-white shadow-[0_10px_30px_-14px_rgba(16,24,40,0.15)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_48px_-16px_rgba(11,110,255,0.3)] dark:border-white/10 dark:bg-[#0f1525] dark:shadow-[0_10px_30px_-14px_rgba(0,0,0,0.55)] dark:hover:shadow-[0_18px_48px_-16px_rgba(11,110,255,0.5)]"
          >
            {/* Imagen rectangular */}
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={p.imageLight}
                alt={p.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] dark:hidden"
              />
              <Image
                src={p.imageDark}
                alt={p.title}
                className="hidden h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] dark:block"
              />

              {/* Tag categoría + flecha en la imagen */}
              <span className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white ring-1 ring-white/20 backdrop-blur-md">
                {p.category}
              </span>
              <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white ring-1 ring-white/20 backdrop-blur-md transition-all duration-300 group-hover:rotate-45 group-hover:bg-black/65">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>

            {/* Texto debajo: limpio y compacto */}
            <div className="flex flex-1 items-end justify-between gap-4 p-5">
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a8595] dark:text-[#7aa3ff]">
                  {p.client}
                </p>
                <h3 className="text-[18px] font-bold leading-[22px] tracking-[-0.01em] text-[#101828] dark:text-white">
                  {p.title}
                </h3>
              </div>
              <span className="shrink-0 inline-flex items-center rounded-full bg-[#101828] px-3.5 py-1.5 text-[11px] font-semibold text-white transition-all duration-300 group-hover:bg-[#0047ff] dark:bg-white dark:text-[#0a0e1a] dark:group-hover:bg-[#7aa3ff] dark:group-hover:text-white">
                {p.metric}
              </span>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-[#99a1af] dark:text-[#a1a8b3]">
          No hay proyectos en esta categoría todavía.
        </p>
      )}
    </section>
  );
}
