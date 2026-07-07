"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL no está definida");
}

const WS_LINK =
  "https://wa.me/18092000000?text=Hola%2C%20me%20interesa%20cotizar%20un%20plan";

type Billing = "mensual" | "proyecto";

type PlanFeature = {
  id: number;
  text: string;
  sort_order: number;
};

type Plan = {
  id: number;
  name: string;
  slug: string;
  tagline: string | null;
  currency: string;
  monthly_price: string | null;
  project_price: string | null;
  project_price_label: string | null;
  is_highlighted: boolean;
  features: PlanFeature[];
};

function formatPrice(value: string | null, fallback: string | null) {
  if (!value) return fallback || "Cotización";

  return Number(value).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
}

export default function SectionPlanes() {
  const [billing, setBilling] = useState<Billing>("proyecto");
  const [plans, setPlans] = useState<Plan[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function loadPlans() {
      const res = await fetch(`${API_URL}/plans`);
      const data = await res.json();
      setPlans(data);
    }

    loadPlans();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll(".plan-card");
      if (cards && cards.length) {
        gsap.from(cards, {
          y: 60,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.15,
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: cards[0],
            start: "top 85%",
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [plans]);

  return (
    <section
      ref={sectionRef}
      className="mx-auto w-full max-w-[1240px] px-6 py-14 md:px-[80px] md:py-20"
    >
      <div className="mb-12 flex justify-center">
        <div className="inline-flex rounded-full border border-[#d5d7da] dark:border-white/10 bg-white dark:bg-[#141a2b] p-1">
          <button
            onClick={() => setBilling("proyecto")}
            className={`rounded-full px-6 py-2 text-[13px] font-semibold transition-all ${
              billing === "proyecto"
                ? "bg-[#101828] dark:bg-white text-white dark:text-[#0a0e1a]"
                : "text-[#252b37] dark:text-white"
            }`}
          >
            Por proyecto
          </button>

          <button
            onClick={() => setBilling("mensual")}
            className={`rounded-full px-6 py-2 text-[13px] font-semibold transition-all ${
              billing === "mensual"
                ? "bg-[#101828] dark:bg-white text-white dark:text-[#0a0e1a]"
                : "text-[#252b37] dark:text-white"
            }`}
          >
            Mensual (retainer)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {plans.map((p) => {
          const currentPrice =
            billing === "mensual" ? p.monthly_price : p.project_price;

          const displayPrice = formatPrice(
            currentPrice,
            billing === "proyecto" ? p.project_price_label : null,
          );

          const isQuote = displayPrice === "Cotización";

          return (
            <div
              key={p.id}
              className={`plan-card relative flex flex-col rounded-[24px] p-6 transition-all duration-300 sm:p-8 ${
                p.is_highlighted
                  ? "bg-[#101828] text-white shadow-2xl lg:-translate-y-4"
                  : "border border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-[#141a2b] text-[#101828] dark:text-white hover:shadow-lg"
              }`}
            >
              {p.is_highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#00d7f2] px-4 py-1 text-[11px] font-bold uppercase tracking-wide text-[#101828]">
                  Más popular
                </div>
              )}

              <h3 className="mb-1 text-[22px] font-bold">{p.name}</h3>

              <p
                className={`mb-6 text-[13px] leading-[20px] ${
                  p.is_highlighted
                    ? "text-white/70"
                    : "text-[#7a8595] dark:text-[#a1a8b3]"
                }`}
              >
                {p.tagline}
              </p>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  {!isQuote && (
                    <span
                      className={`text-[14px] font-semibold ${
                        p.is_highlighted
                          ? "text-white/60"
                          : "text-[#7a8595] dark:text-[#a1a8b3]"
                      }`}
                    >
                      US$
                    </span>
                  )}

                  <span className="break-all text-[40px] font-extrabold leading-none tracking-tight sm:text-[44px] md:text-[52px]">
                    {displayPrice}
                  </span>

                  {!isQuote && (
                    <span
                      className={`text-[13px] ${
                        p.is_highlighted
                          ? "text-white/60"
                          : "text-[#7a8595] dark:text-[#a1a8b3]"
                      }`}
                    >
                      {billing === "mensual" ? "/mes" : "desde"}
                    </span>
                  )}
                </div>
              </div>

              <ul className="mb-8 flex flex-1 flex-col gap-3">
                {p.features.map((f) => (
                  <li key={f.id} className="flex items-start gap-3 text-[14px]">
                    <Check
                      className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                        p.is_highlighted ? "text-[#00d7f2]" : "text-[#0047ff]"
                      }`}
                      strokeWidth={3}
                    />

                    <span
                      className={
                        p.is_highlighted
                          ? "text-white/90"
                          : "text-[#252b37] dark:text-white"
                      }
                    >
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={`${WS_LINK}%20${encodeURIComponent(p.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[14px] font-semibold transition-all ${
                  p.is_highlighted
                    ? "bg-white text-[#101828] hover:bg-[#f4f7ff]"
                    : "bg-[#101828] dark:bg-white text-white dark:text-[#0a0e1a] hover:bg-[#252b37] dark:hover:bg-white/90"
                }`}
              >
                Cotizar {p.name}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}