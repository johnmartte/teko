"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ApiErrorToast from "@/components/ui/api-error-toast";

gsap.registerPlugin(ScrollTrigger);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL no está definida");
}

const WS_LINK =
  "https://wa.me/18092000000?text=Hola%2C%20me%20interesa%20cotizar%20un%20plan";

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

function PlanSkeleton() {
  return (
    <div
      className="flex flex-col rounded-[20px] border p-6 sm:p-8"
      style={{
        borderColor: "rgba(255,255,255,0.1)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
      }}
    >
      <div className="skeleton mb-2 h-7 w-32" />
      <div className="skeleton mb-6 h-4 w-48" />
      <div className="mb-8 flex flex-col gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="skeleton h-4 w-4 rounded-full" />
            <div className="skeleton h-4 flex-1" />
          </div>
        ))}
      </div>
      <div className="skeleton h-12 w-full rounded-full" />
    </div>
  );
}

export default function SectionPlanes() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const loadPlans = useCallback(async () => {
    setError(false);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/plans`);
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setPlans(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  useEffect(() => {
    if (loading || plans.length === 0) return;
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
  }, [plans, loading]);

  return (
    <section
      ref={sectionRef}
      className="px-6 py-14 md:px-[100px] md:py-20"
      style={{ color: "#f2f3f5" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {loading
            ? [1, 2, 3].map((i) => <PlanSkeleton key={i} />)
            : plans.map((p) => {
                const isHighlighted = p.is_highlighted;

                return (
                  <div
                    key={p.id}
                    className={`plan-card relative flex flex-col rounded-[20px] border p-6 transition-all duration-300 sm:p-8 ${
                      isHighlighted ? "lg:-translate-y-4" : ""
                    }`}
                    style={{
                      borderColor: isHighlighted
                        ? "rgba(30,196,255,0.3)"
                        : "rgba(255,255,255,0.1)",
                      background: isHighlighted
                        ? "linear-gradient(180deg, rgba(30,196,255,0.08), rgba(255,255,255,0.02))"
                        : "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
                    }}
                  >
                    {isHighlighted && (
                      <div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[11px] font-bold uppercase tracking-wide"
                        style={{ background: "#1ec4ff", color: "#080a0f" }}
                      >
                        Más popular
                      </div>
                    )}

                    <h3 className="mb-1 text-[22px] font-bold">{p.name}</h3>

                    <p
                      className="mb-6 text-[13px] leading-[20px]"
                      style={{ color: "rgba(242,243,245,0.55)" }}
                    >
                      {p.tagline}
                    </p>

                    <ul className="mb-8 flex flex-1 flex-col gap-3">
                      {p.features.map((f) => (
                        <li
                          key={f.id}
                          className="flex items-start gap-3 text-[14px]"
                        >
                          <Check
                            className="mt-0.5 h-4 w-4 flex-shrink-0"
                            style={{ color: "#1ec4ff" }}
                            strokeWidth={3}
                          />
                          <span style={{ color: "rgba(242,243,245,0.8)" }}>
                            {f.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={`${WS_LINK}%20${encodeURIComponent(p.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[14px] font-semibold transition-all"
                      style={{
                        background: isHighlighted ? "#1ec4ff" : "rgba(255,255,255,0.1)",
                        color: isHighlighted ? "#080a0f" : "#f2f3f5",
                        border: isHighlighted ? "none" : "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      Cotizar {p.name}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                );
              })}
        </div>
      </div>

      {error && (
        <ApiErrorToast
          message="No pudimos cargar los planes. Intenta de nuevo."
          onRetry={loadPlans}
          onDismiss={() => setError(false)}
        />
      )}
    </section>
  );
}
