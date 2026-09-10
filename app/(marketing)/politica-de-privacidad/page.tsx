"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";
import LegalContent from "@/components/legal/legal-content";

const sections = [
  {
    title: "Información que recopilamos",
    content: [
      "Cuando usted utiliza nuestro sitio web o se pone en contacto con nosotros, podemos recopilar información personal como su nombre, dirección de correo electrónico, número de teléfono y nombre de su empresa. Esta información se recopila únicamente cuando usted la proporciona voluntariamente a través de nuestros formularios de contacto o cotización.",
      "También recopilamos automáticamente información técnica como su dirección IP, tipo de navegador, sistema operativo, páginas visitadas y tiempo de permanencia en el sitio, mediante cookies y tecnologías similares.",
    ],
  },
  {
    title: "Uso de la información",
    content: [
      "Utilizamos su información personal para: responder a sus consultas y solicitudes de cotización, enviarle información relevante sobre nuestros servicios (solo si usted lo ha autorizado), mejorar nuestro sitio web y la experiencia del usuario, y cumplir con obligaciones legales aplicables.",
      "No vendemos, alquilamos ni compartimos su información personal con terceros con fines comerciales. Solo compartimos datos con proveedores de servicios que nos asisten en la operación del sitio y que están obligados a mantener la confidencialidad de dicha información.",
    ],
  },
  {
    title: "Protección de datos",
    content: [
      "Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción. Estas medidas incluyen cifrado de datos en tránsito (HTTPS), acceso restringido a la información y respaldos periódicos.",
    ],
  },
  {
    title: "Sus derechos",
    content: [
      "Usted tiene derecho a acceder, rectificar, actualizar o solicitar la eliminación de su información personal en cualquier momento. Para ejercer estos derechos, puede contactarnos a través de nuestro formulario de contacto o enviando un correo electrónico a nuestro equipo.",
    ],
  },
  {
    title: "Retención de datos",
    content: [
      "Conservamos su información personal solo durante el tiempo necesario para cumplir con los fines para los que fue recopilada, incluyendo obligaciones legales, contables o de informes.",
    ],
  },
  {
    title: "Cambios en esta política",
    content: [
      "Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento. Cualquier cambio será publicado en esta página con la fecha de actualización correspondiente. Le recomendamos revisar esta política periódicamente.",
    ],
  },
  {
    title: "Contacto",
    content: [
      "Si tiene preguntas sobre esta Política de Privacidad o sobre el tratamiento de sus datos personales, no dude en contactarnos a través de la sección de contacto de nuestro sitio web.",
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

export default function PoliticaPrivacidadPage() {
  return (
    <main style={{ background: "#080a0f" }}>
      <LegalHero
        badge="Legal"
        title="Política de"
        accentWord="Privacidad"
        description="En TEKO nos comprometemos a proteger su privacidad y sus datos personales. Esta política describe cómo recopilamos, usamos y protegemos su información."
      />
      <LegalContent lastUpdated="15 de julio de 2026" sections={sections} />
    </main>
  );
}
