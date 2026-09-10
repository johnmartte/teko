"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";
import LegalContent from "@/components/legal/legal-content";

const sections = [
  {
    title: "Aceptación de los términos",
    content: [
      "Al acceder y utilizar el sitio web de TEKO (teko.do), usted acepta cumplir con estos Términos y Condiciones. Si no está de acuerdo con alguno de estos términos, le recomendamos no utilizar nuestro sitio web.",
    ],
  },
  {
    title: "Servicios",
    content: [
      "TEKO es una agencia de transformación digital que ofrece servicios de diseño, desarrollo e implementación de soluciones tecnológicas. Los servicios específicos, alcances, plazos y costos se definen en propuestas y contratos individuales acordados entre TEKO y cada cliente.",
      "Las cotizaciones presentadas en nuestro sitio web son referenciales y pueden variar según los requerimientos específicos de cada proyecto. Los precios finales se establecen mediante cotización personalizada.",
    ],
  },
  {
    title: "Propiedad intelectual",
    content: [
      "Todo el contenido de este sitio web, incluyendo pero no limitado a textos, gráficos, logotipos, iconos, imágenes, diseños y código fuente, es propiedad de TEKO o se utiliza con la debida autorización, y está protegido por las leyes de propiedad intelectual aplicables.",
      "Los entregables de cada proyecto se rigen por los términos específicos del contrato correspondiente. Salvo acuerdo en contrario, los derechos de propiedad intelectual del producto final se transfieren al cliente una vez completado el pago total del proyecto.",
    ],
  },
  {
    title: "Uso del sitio web",
    content: [
      "Usted se compromete a utilizar este sitio web únicamente para fines legales y de manera que no infrinja los derechos de terceros ni restrinja o inhiba su uso y disfrute. Queda prohibido el uso de este sitio para transmitir material que sea difamatorio, ofensivo o ilegal.",
      "No está permitido intentar acceder sin autorización a ningún sistema informático, red o dato conectado a este sitio web, ni realizar actividades que puedan dañar, deshabilitar o sobrecargar nuestros servidores o infraestructura.",
    ],
  },
  {
    title: "Limitación de responsabilidad",
    content: [
      "TEKO se esfuerza por mantener la información de este sitio web actualizada y precisa, pero no garantiza que el contenido sea completo, exacto o actualizado en todo momento. El sitio web se proporciona \"tal cual\" sin garantías de ningún tipo.",
      "En ningún caso TEKO será responsable por daños directos, indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de uso de este sitio web o de los servicios ofrecidos a través del mismo.",
    ],
  },
  {
    title: "Enlaces externos",
    content: [
      "Nuestro sitio web puede contener enlaces a sitios web de terceros. Estos enlaces se proporcionan únicamente para su conveniencia y no implican respaldo ni responsabilidad por el contenido de dichos sitios. TEKO no se hace responsable del contenido ni de las prácticas de privacidad de sitios web de terceros.",
    ],
  },
  {
    title: "Confidencialidad",
    content: [
      "Toda la información compartida entre TEKO y sus clientes durante el proceso de consulta, cotización y ejecución de proyectos se considera confidencial. TEKO se compromete a no divulgar información del cliente a terceros sin su consentimiento previo, salvo que sea requerido por ley.",
    ],
  },
  {
    title: "Legislación aplicable",
    content: [
      "Estos Términos y Condiciones se rigen por las leyes de la República Dominicana. Cualquier disputa que surja en relación con estos términos será sometida a la jurisdicción de los tribunales competentes de la República Dominicana.",
    ],
  },
  {
    title: "Modificaciones",
    content: [
      "TEKO se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en este sitio web. El uso continuado del sitio después de la publicación de cambios constituye su aceptación de los mismos.",
    ],
  },
  {
    title: "Contacto",
    content: [
      "Para cualquier consulta relacionada con estos Términos y Condiciones, puede contactarnos a través de la sección de contacto de nuestro sitio web o mediante nuestros canales oficiales de comunicación.",
    ],
  },
];

function LegalHero({ badge, title, accentWord, description }: { badge: string; title: string; accentWord: string; description: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const els = ref.current?.querySelectorAll("[data-reveal]");
      if (!els) return;
      els.forEach((el, i) => {
        gsap.set(el, { opacity: 0, y: 18 });
        gsap.to(el, { opacity: 1, y: 0, duration: 0.7, delay: i * 0.08, ease: "power3.out" });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden px-6 pb-8 pt-[130px] md:px-[100px]" style={{ color: "#f2f3f5" }}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 40% at 50% 0%, rgba(30,120,255,0.1), transparent 70%)" }} />

      <div className="relative mx-auto max-w-[820px]">
        <Link
          href="/"
          data-reveal=""
          className="inline-flex items-center gap-2 text-[13px] font-medium transition-colors hover:text-white"
          style={{ color: "rgba(242,243,245,0.5)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8.5 3L4.5 7l4 4" /></svg>
          Volver al inicio
        </Link>

        <div data-reveal="" className="mt-8 max-w-[760px]">
          <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.08em]" style={{ color: "rgba(242,243,245,0.55)" }}>
            <span className="h-1.5 w-1.5 rounded-full bg-[#1ec4ff]" style={{ boxShadow: "0 0 12px #1ec4ff" }} />
            {badge}
          </p>

          <h1 className="mt-5 text-[clamp(32px,5vw,50px)] font-semibold leading-[1.08] tracking-[-0.035em]">
            {title}{" "}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", fontWeight: 400, color: "#bfe9ff" }}>{accentWord}</em>
          </h1>

          <p className="mt-5 max-w-[520px] text-[15.5px] font-light leading-[1.6]" style={{ color: "rgba(242,243,245,0.62)" }}>
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}

export default function TerminosCondicionesPage() {
  return (
    <main style={{ background: "#080a0f" }}>
      <LegalHero
        badge="Legal"
        title="Términos y"
        accentWord="Condiciones"
        description="Las condiciones que rigen el uso de nuestro sitio web y la contratación de nuestros servicios."
      />
      <LegalContent lastUpdated="15 de julio de 2026" sections={sections} />
    </main>
  );
}
