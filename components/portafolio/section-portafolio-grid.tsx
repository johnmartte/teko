"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const categories = ["Todos", "Web", "Mobile", "Branding", "Sistemas"] as const;
type Category = (typeof categories)[number];

type Project = {
  title: string;
  category: Exclude<Category, "Todos">;
  client: string;
  description: string;
  metric: string;
  gradient: string;
};

const projects: Project[] = [
  {
    title: "Plataforma de citas médicas",
    category: "Web",
    client: "HealthCare LATAM",
    description:
      "Sistema de agendamiento online con integración a calendarios y recordatorios automáticos.",
    metric: "+40% conversión",
    gradient: "from-[#0047ff] to-[#00d7f2]",
  },
  {
    title: "App de delivery gastronómico",
    category: "Mobile",
    client: "FoodExpress",
    description:
      "Aplicación nativa iOS/Android con tracking en tiempo real y pagos integrados.",
    metric: "50k+ descargas",
    gradient: "from-[#2e5fff] to-[#0071ff]",
  },
  {
    title: "Identidad visual — Fintech",
    category: "Branding",
    client: "PayFlow",
    description:
      "Rebrand completo: logo, design system, guía de marca y aplicaciones digitales.",
    metric: "Brand kit completo",
    gradient: "from-[#1ec4ff] to-[#2e5fff]",
  },
  {
    title: "CRM empresarial a medida",
    category: "Sistemas",
    client: "VentasPro",
    description:
      "Panel de gestión de clientes, pipelines y automatización de seguimientos.",
    metric: "-60% tiempo operativo",
    gradient: "from-[#0b6eff] to-[#101828]",
  },
  {
    title: "E-commerce de moda",
    category: "Web",
    client: "Urban Style",
    description:
      "Tienda online con catálogo dinámico, pagos y gestión de inventario.",
    metric: "+220% ventas online",
    gradient: "from-[#00d7f2] to-[#0047ff]",
  },
  {
    title: "App de reservas de barbería",
    category: "Mobile",
    client: "BarberNow",
    description:
      "Reservas por WhatsApp, panel de profesionales y recordatorios automáticos.",
    metric: "3min tiempo de reserva",
    gradient: "from-[#2563eb] to-[#1ec4ff]",
  },
  {
    title: "Landing page SaaS B2B",
    category: "Web",
    client: "Cloudify",
    description:
      "Landing conversión con animaciones, A/B testing y analítica integrada.",
    metric: "+180% leads calificados",
    gradient: "from-[#0071ff] to-[#2e5fff]",
  },
  {
    title: "Sistema de facturación fiscal",
    category: "Sistemas",
    client: "ContaFiscal",
    description:
      "Generación de facturas electrónicas con validación y envío automático.",
    metric: "10k+ facturas/mes",
    gradient: "from-[#101828] to-[#2563eb]",
  },
  {
    title: "Branding — Agencia creativa",
    category: "Branding",
    client: "Neon Studio",
    description:
      "Nueva identidad con paleta moderna, tipografía editorial y aplicaciones.",
    metric: "Design system v1.0",
    gradient: "from-[#2e5fff] to-[#00d7f2]",
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
            className="project-card group overflow-hidden rounded-[24px] bg-[#f4f7ff] dark:bg-[#141a2b] transition-shadow duration-300 hover:shadow-xl"
          >
            <div
              className={`relative h-[220px] bg-gradient-to-br ${p.gradient} p-6 flex items-end`}
            >
              <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                {p.category}
              </span>
              <ArrowUpRight className="absolute right-5 top-5 h-6 w-6 text-white opacity-80 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
            <div className="p-6">
              <p className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-[#99a1af] dark:text-[#a1a8b3]">
                {p.client}
              </p>
              <h3 className="mb-2 text-[20px] font-semibold text-[#101828] dark:text-white">
                {p.title}
              </h3>
              <p className="mb-4 text-[14px] leading-[22px] text-[#7a8595] dark:text-[#a1a8b3]">
                {p.description}
              </p>
              <div className="inline-flex items-center rounded-full bg-white dark:bg-[#0a0e1a] px-3 py-1 text-[12px] font-semibold text-[#0047ff]">
                {p.metric}
              </div>
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
