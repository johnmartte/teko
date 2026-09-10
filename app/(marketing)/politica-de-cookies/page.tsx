"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";
import LegalContent from "@/components/legal/legal-content";

const sections = [
  {
    title: "¿Qué son las cookies?",
    content: [
      "Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. Se utilizan ampliamente para hacer que los sitios web funcionen de manera más eficiente y para proporcionar información a los propietarios del sitio.",
    ],
  },
  {
    title: "Cookies que utilizamos",
    content: [
      "Cookies estrictamente necesarias: Son esenciales para que el sitio web funcione correctamente. Incluyen cookies que le permiten navegar por el sitio y utilizar sus funciones. Estas cookies no recopilan información que pueda identificarlo.",
      "Cookies de rendimiento y análisis: Nos permiten contar las visitas y fuentes de tráfico para medir y mejorar el rendimiento de nuestro sitio. Nos ayudan a saber qué páginas son las más y menos populares, y cómo los visitantes se mueven por el sitio. Toda la información que recogen estas cookies es agregada y, por lo tanto, anónima.",
      "Cookies de funcionalidad: Permiten que el sitio web recuerde las elecciones que usted hace (como su preferencia de idioma o tema visual) y proporcionen funciones mejoradas y más personalizadas.",
    ],
  },
  {
    title: "Cookies de terceros",
    content: [
      "Nuestro sitio web puede utilizar servicios de terceros que establecen sus propias cookies, como Google Analytics para análisis de tráfico. Estas cookies están sujetas a las políticas de privacidad de los respectivos terceros y no tenemos control sobre ellas.",
    ],
  },
  {
    title: "Control de cookies",
    content: [
      "Usted puede configurar su navegador para rechazar todas las cookies o para que le avise cuando se envía una cookie. Sin embargo, si desactiva las cookies, algunas partes del sitio web podrían no funcionar correctamente.",
      "La mayoría de los navegadores permiten gestionar las preferencias de cookies. Puede encontrar información sobre cómo gestionar cookies en la sección de ayuda de su navegador.",
    ],
  },
  {
    title: "Cambios en esta política",
    content: [
      "Podemos actualizar esta Política de Cookies periódicamente para reflejar cambios en las cookies que utilizamos o por otros motivos operativos, legales o regulatorios. Le recomendamos revisar esta política con regularidad para estar informado sobre nuestro uso de cookies.",
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

export default function PoliticaCookiesPage() {
  return (
    <main style={{ background: "#080a0f" }}>
      <LegalHero
        badge="Legal"
        title="Política de"
        accentWord="Cookies"
        description="Información sobre cómo utilizamos las cookies en nuestro sitio web para mejorar su experiencia de navegación."
      />
      <LegalContent lastUpdated="15 de julio de 2026" sections={sections} />
    </main>
  );
}
