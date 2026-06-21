"use client";

import { useEffect, useRef } from "react";
import { Mail } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const team = [
  {
    name: "John Marte",
    role: "Founder & Tech Lead",
    bio: "Arquitecto de software con foco en producto digital. Lidera la estrategia técnica y la relación con clientes.",
    initials: "JM",
    gradient: "from-[#0047ff] to-[#00d7f2]",
  },
  {
    name: "Diseño & Producto",
    role: "Design Team",
    bio: "Equipo multidisciplinario enfocado en UX/UI, branding y sistemas de diseño que convierten.",
    initials: "DP",
    gradient: "from-[#2e5fff] to-[#1ec4ff]",
  },
  {
    name: "Ingeniería",
    role: "Engineering Team",
    bio: "Desarrolladores full-stack especializados en React, Next.js, Node e infraestructura cloud.",
    initials: "EN",
    gradient: "from-[#0071ff] to-[#2563eb]",
  },
];

export default function SectionEquipo() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".team-heading", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: ".team-heading",
          start: "top 90%",
          once: true,
        },
      });

      const cards = sectionRef.current?.querySelectorAll(".team-card");
      if (cards && cards.length) {
        gsap.from(cards, {
          y: 50,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.15,
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: cards[0],
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
      className="mx-auto w-full max-w-[1240px] px-6 pb-24 pt-8 md:px-[80px] md:pb-32"
    >
      <div className="team-heading mb-14 text-center">
        <h2 className="mb-4 text-[34px] font-extrabold tracking-[-0.06em] text-[#101828] dark:text-white md:text-[44px] md:leading-[52px]">
          El equipo detrás de TEKO
        </h2>
        <p className="mx-auto max-w-[640px] text-[16px] leading-[26px] text-[#7a8595] dark:text-[#a1a8b3]">
          Personas reales obsesionadas con entregar productos que funcionan.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {team.map((m, i) => (
          <div
            key={i}
            className="team-card overflow-hidden rounded-[24px] bg-[#f4f7ff] dark:bg-[#141a2b] p-1"
          >
            <div className={`relative h-[220px] rounded-[20px] bg-gradient-to-br ${m.gradient} flex items-center justify-center`}>
              <span className="font-ppeditorialold text-[88px] font-normal italic text-white/90">
                {m.initials}
              </span>
            </div>
            <div className="p-6">
              <h3 className="mb-1 text-[20px] font-semibold text-[#101828] dark:text-white">
                {m.name}
              </h3>
              <p className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-[#0047ff]">
                {m.role}
              </p>
              <p className="mb-5 text-[14px] leading-[22px] text-[#7a8595] dark:text-[#a1a8b3]">
                {m.bio}
              </p>
              <div className="flex gap-2">
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-[#0a0e1a] text-[#7a8595] dark:text-[#a1a8b3] transition-colors hover:bg-[#0047ff] hover:text-white"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn className="h-4 w-4" />
                </a>
                <a
                  href="mailto:john.marte@unicaribe.edu.do"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-[#0a0e1a] text-[#7a8595] dark:text-[#a1a8b3] transition-colors hover:bg-[#0047ff] hover:text-white"
                  aria-label="Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
