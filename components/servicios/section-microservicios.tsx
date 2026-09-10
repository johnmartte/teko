"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Background from "@/public/Background-seccion.svg";
import {
  QrCode,
  Award,
  Image as ImageIcon,
  Globe,
  FileText,
  ClipboardList,
  CreditCard,
  Users,
  MessageCircle,
  Bell,
  CreditCard as NfcCard,
  LayoutGrid,
} from "lucide-react";
import ApiErrorToast from "@/components/ui/api-error-toast";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL no está definida");
}

const iconMap = {
  qr_code: QrCode,
  award: Award,
  image: ImageIcon,
  globe: Globe,
  file_text: FileText,
  clipboard_list: ClipboardList,
  credit_card: CreditCard,
  users: Users,
  message_circle: MessageCircle,
  bell: Bell,
  nfc_card: NfcCard,
  layout_grid: LayoutGrid,
};

type ApiService = {
  id: number;
  title: string;
  description: string | null;
  type: string;
  icon_key: keyof typeof iconMap | null;
};

function MicroservicioSkeleton() {
  return (
    <div className="rounded-[14px] border p-[20px]" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
      <div className="flex items-start gap-3">
        <div className="mt-[2px] h-9 w-9 shrink-0 animate-pulse rounded-[10px]" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="flex-1">
          <div className="mb-2 h-4 w-28 animate-pulse rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-3 w-full animate-pulse rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
          <div className="mt-1 h-3 w-3/4 animate-pulse rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>
      </div>
    </div>
  );
}

export default function SectionMicroservicios() {
  const [microservicios, setMicroservicios] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const loadMicroservicios = useCallback(async () => {
    setError(false);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/services`);
      if (!res.ok) throw new Error(`${res.status}`);
      const data: ApiService[] = await res.json();
      setMicroservicios(data.filter((item) => item.type === "microservice"));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMicroservicios();
  }, [loadMicroservicios]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const els = sectionRef.current?.querySelectorAll("[data-reveal]");
      if (!els) return;
      els.forEach((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) return;
        gsap.set(el, { opacity: 0, y: 18 });
        gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-4 py-16 md:px-8 md:py-24" style={{ color: "#f2f3f5" }}>
      {/* TEKO pattern background — kept from original */}
      <Image
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover opacity-[0.12]"
        src={Background}
        alt=""
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "rgba(8,10,15,0.88)" }} />

      <div data-reveal="" className="relative mx-auto max-w-[1058px] rounded-[22px] border p-6 md:p-[56px]" style={{ borderColor: "rgba(255,255,255,0.1)", background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))", backdropFilter: "blur(12px)" }}>
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "rgba(34,211,238,0.12)" }}>
            <span className="text-[17.6px] font-black leading-[26.4px]" style={{ color: "#22d3ee" }}>
              04
            </span>
          </div>

          <div>
            <span className="text-[12px] font-semibold uppercase tracking-[1.2px]" style={{ color: "#22d3ee" }}>
              FASE
            </span>
            <h2 className="text-[clamp(24px,3vw,30px)] font-semibold leading-[1.15] tracking-[-0.02em]">
              Microservicios para Emprendimientos
            </h2>
          </div>
        </div>

        <p className="mb-7 max-w-[631px] text-[14.5px] leading-[1.6]" style={{ color: "rgba(242,243,245,0.6)" }}>
          Soluciones puntuales a precio cerrado para negocios que necesitan
          presencia digital rápida sin complejidad técnica. Cada microservicio
          es un entregable independiente, listo para usar.
        </p>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {loading
            ? [1, 2, 3, 4, 5, 6].map((i) => (
                <MicroservicioSkeleton key={i} />
              ))
            : microservicios.map((item) => {
                const Icon =
                  item.icon_key && iconMap[item.icon_key]
                    ? iconMap[item.icon_key]
                    : Globe;

                return (
                  <div
                    key={item.id}
                    data-reveal=""
                    className="rounded-[14px] border p-[20px] transition-colors hover:border-[rgba(255,255,255,0.16)]"
                    style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-[2px] flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]" style={{ background: "rgba(34,211,238,0.1)" }}>
                        <Icon className="h-4 w-4" style={{ color: "#22d3ee" }} strokeWidth={1.9} />
                      </div>

                      <div>
                        <p className="text-[14.4px] font-semibold leading-[21.6px]">
                          {item.title}
                        </p>
                        <p className="mt-1 text-[12px] leading-[20.4px]" style={{ color: "rgba(242,243,245,0.5)" }}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>

      {error && (
        <ApiErrorToast
          message="No pudimos cargar los microservicios."
          onRetry={loadMicroservicios}
          onDismiss={() => setError(false)}
        />
      )}
    </section>
  );
}
