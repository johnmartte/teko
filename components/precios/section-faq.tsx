"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ApiErrorToast from "@/components/ui/api-error-toast";

gsap.registerPlugin(ScrollTrigger);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL no está definida");
}

type FAQ = {
  id: number;
  question: string;
  answer: string;
};

function FaqSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-[16px] border px-6 py-5"
          style={{
            borderColor: "rgba(255,255,255,0.1)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="skeleton h-5 flex-1" />
            <div className="skeleton h-8 w-8 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SectionFAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);

  const loadFaqs = useCallback(async () => {
    setError(false);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/faqs`);
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setFaqs(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFaqs();
  }, [loadFaqs]);

  useEffect(() => {
    if (loading || faqs.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.from(".faq-heading", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: ".faq-heading",
          start: "top 90%",
          once: true,
        },
      });

      const items = sectionRef.current?.querySelectorAll(".faq-item");
      if (items && items.length) {
        gsap.from(items, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.08,
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: items[0],
            start: "top 90%",
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [faqs, loading]);

  return (
    <section
      ref={sectionRef}
      className="mx-auto w-full max-w-[960px] px-6 pb-24 pt-8 md:px-[80px] md:pb-32"
      style={{ color: "#f2f3f5" }}
    >
      <div className="faq-heading mb-12 text-center">
        <h2 className="mb-4 text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.03em]">
          Preguntas frecuentes
        </h2>
        <p className="mx-auto max-w-[560px] text-[15.5px] font-light leading-[1.6]" style={{ color: "rgba(242,243,245,0.6)" }}>
          Todo lo que necesitas saber antes de empezar con TEKO.
        </p>
      </div>

      {loading ? (
        <FaqSkeleton />
      ) : (
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;

            return (
              <div
                key={faq.id}
                className="faq-item overflow-hidden rounded-[16px] border transition-colors"
                style={{
                  borderColor: isOpen ? "rgba(30,196,255,0.3)" : "rgba(255,255,255,0.1)",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-[16px] font-semibold">
                    {faq.question}
                  </span>

                  <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors"
                    style={{
                      background: isOpen ? "#1ec4ff" : "rgba(255,255,255,0.08)",
                      color: isOpen ? "#080a0f" : "#f2f3f5",
                    }}
                  >
                    {isOpen ? (
                      <Minus className="h-4 w-4" strokeWidth={2.5} />
                    ) : (
                      <Plus className="h-4 w-4" strokeWidth={2.5} />
                    )}
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-[14px] leading-[22px]" style={{ color: "rgba(242,243,245,0.55)" }}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {error && (
        <ApiErrorToast
          message="No pudimos cargar las preguntas frecuentes."
          onRetry={loadFaqs}
          onDismiss={() => setError(false)}
        />
      )}
    </section>
  );
}
