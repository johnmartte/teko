"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Users, Share2 } from "lucide-react";
import gsap from "gsap";

const platforms = [
  {
    name: "TEKO Manager",
    description:
      "Administra tus redes sociales desde un solo lugar. Programa publicaciones, analiza metricas y gestiona todas tus cuentas de forma centralizada.",
    icon: Share2,
    href: "https://frontend-kappa-jet-50.vercel.app/login",
    external: true,
    gradient: "from-violet-600 to-indigo-600",
    shadowColor: "rgba(124,58,237,0.5)",
    features: [
      "Programacion de publicaciones",
      "Analitica de redes sociales",
      "Gestion multi-cuenta",
      "Calendario de contenido",
    ],
  },
  {
    name: "Portal de Clientes",
    description:
      "Accede a tu panel personalizado para dar seguimiento a tus proyectos, revisar entregables, ver reuniones programadas y mucho mas.",
    icon: Users,
    href: "/portal/login",
    external: false,
    gradient: "from-[#0b6eff] to-[#0047ff]",
    shadowColor: "rgba(11,110,255,0.5)",
    features: [
      "Seguimiento de proyectos",
      "Entregables y archivos",
      "Reuniones agendadas",
      "Facturacion y pagos",
    ],
  },
];

export default function PlataformasPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current!.children, {
        y: 50,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.15,
        clearProps: "transform,opacity",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-white px-4 pb-20 pt-36 dark:bg-[#0a0e1a] sm:px-6 md:px-8"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0047ff] dark:text-[#7aa3ff]">
            Plataformas
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[#101828] dark:text-white sm:text-4xl md:text-5xl">
            Herramientas digitales{" "}
            <span className="font-ppeditorialold font-normal italic text-[#0047ff] dark:text-[#7aa3ff]">
              TEKO
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-[#52607a] dark:text-white/50">
            Plataformas web desarrolladas por TEKO para potenciar tu operacion
            digital y la de tus clientes.
          </p>
        </div>

        {/* Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const Tag = platform.external ? "a" : Link;
            const extraProps = platform.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {};

            return (
              <Tag
                key={platform.name}
                href={platform.href}
                {...(extraProps as Record<string, string>)}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#e6eaf2] bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 dark:bg-[#0f1525]"
              >
                {/* Gradient header */}
                <div
                  className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${platform.gradient}`}
                >
                  <Icon className="h-16 w-16 text-white/80 transition-transform duration-500 group-hover:scale-110" />
                  <div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_60%)]"
                  />
                  {/* Arrow */}
                  <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white ring-1 ring-white/30 backdrop-blur-md transition-all duration-300 group-hover:rotate-45 group-hover:bg-white/30">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-xl font-bold text-[#101828] dark:text-white">
                    {platform.name}
                  </h2>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#52607a] dark:text-white/50">
                    {platform.description}
                  </p>

                  {/* Features */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {platform.features.map((f) => (
                      <span
                        key={f}
                        className="rounded-full bg-[#f4f7ff] px-3 py-1.5 text-[11px] font-medium text-[#52607a] dark:bg-white/5 dark:text-white/50"
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-6 flex items-center gap-2 text-[13px] font-semibold text-[#0047ff] dark:text-[#7aa3ff]">
                    {platform.external ? "Ir a la plataforma" : "Acceder al portal"}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
}
