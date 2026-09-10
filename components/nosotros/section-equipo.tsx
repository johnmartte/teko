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
      className="px-6 pb-24 pt-8 md:px-[100px] md:pb-32"
      style={{ color: "#f2f3f5" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="team-heading mb-14 text-center">
          <h2 className="mb-4 text-[clamp(28px,4vw,44px)] font-semibold tracking-[-0.03em]">
            El equipo detrás de TEKO
          </h2>
          <p className="mx-auto max-w-[640px] text-[15.5px] font-light leading-[1.6]" style={{ color: "rgba(242,243,245,0.6)" }}>
            Personas reales obsesionadas con entregar productos que funcionan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {team.map((m, i) => (
            <div
              key={i}
              className="team-card overflow-hidden rounded-[20px] border p-1"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
              }}
            >
              <div className={`relative h-[220px] rounded-[16px] bg-gradient-to-br ${m.gradient} flex items-center justify-center`}>
                <span style={{ fontFamily: "'Instrument Serif', Georgia, serif" }} className="text-[88px] font-normal italic text-white/90">
                  {m.initials}
                </span>
              </div>
              <div className="p-6">
                <h3 className="mb-1 text-[20px] font-semibold">
                  {m.name}
                </h3>
                <p className="mb-3 text-[13px] font-semibold uppercase tracking-wide" style={{ color: "#1ec4ff" }}>
                  {m.role}
                </p>
                <p className="mb-5 text-[14px] leading-[22px]" style={{ color: "rgba(242,243,245,0.55)" }}>
                  {m.bio}
                </p>
                <div className="flex gap-2">
                  <a
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:border-[#1ec4ff] hover:text-[#1ec4ff]"
                    style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(242,243,245,0.5)" }}
                    aria-label="LinkedIn"
                  >
                    <FaLinkedinIn className="h-4 w-4" />
                  </a>
                  <a
                    href="mailto:john.marte@unicaribe.edu.do"
                    className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:border-[#1ec4ff] hover:text-[#1ec4ff]"
                    style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(242,243,245,0.5)" }}
                    aria-label="Email"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
