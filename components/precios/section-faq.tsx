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
          className="rounded-[16px] border border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-[#141a2b] px-6 py-5"
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
    >
      <div className="faq-heading mb-12 text-center">
        <h2 className="mb-4 text-[34px] font-extrabold tracking-[-0.06em] text-[#101828] dark:text-white md:text-[40px] md:leading-[48px]">
          Preguntas frecuentes
        </h2>
        <p className="mx-auto max-w-[560px] text-[16px] leading-[26px] text-[#7a8595] dark:text-[#a1a8b3]">
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
                className="faq-item overflow-hidden rounded-[16px] border border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-[#141a2b] transition-colors hover:border-[#0047ff]/30"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-[16px] font-semibold text-[#101828] dark:text-white">
                    {faq.question}
                  </span>

                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                      isOpen
                        ? "bg-[#0047ff] text-white"
                        : "bg-[#f4f7ff] dark:bg-[#0a0e1a] text-[#101828] dark:text-white"
                    }`}
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
                    <p className="px-6 pb-5 text-[14px] leading-[22px] text-[#7a8595] dark:text-[#a1a8b3]">
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
