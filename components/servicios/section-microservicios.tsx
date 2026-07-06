"use client";

import { useEffect, useState } from "react";
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

export default function SectionMicroservicios() {
  const [microservicios, setMicroservicios] = useState<ApiService[]>([]);

  useEffect(() => {
    async function loadMicroservicios() {
      const res = await fetch(`${API_URL}/services`);
      const data: ApiService[] = await res.json();

      setMicroservicios(
        data.filter((item) => item.type === "microservice"),
      );
    }

    loadMicroservicios();
  }, []);

  return (
    <section className="relative overflow-hidden px-4 py-16 md:px-8 md:py-24">
      <Image
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover opacity-95 dark:opacity-20"
        src={Background}
        alt=""
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[rgba(43,127,255,0.14)] dark:bg-[rgba(10,14,26,0.85)]" />

      <div className="relative mx-auto max-w-[1058px] rounded-[24px] bg-[#dbebff]/92 p-6 shadow-[0_20px_40px_rgba(28,57,142,0.10)] backdrop-blur-[2px] md:p-[56px] dark:bg-[#141a2b]/95 dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(90,128,255,0.1)]">
            <span className="text-[17.6px] font-black leading-[26.4px] text-[#22d3ee]">
              04
            </span>
          </div>

          <div>
            <span className="text-[12px] font-semibold uppercase tracking-[1.2px] text-[#22d3ee]">
              FASE
            </span>
            <h2 className="text-[28.8px] font-extrabold leading-[43.2px] tracking-[-0.576px] text-[#1482ff]">
              Microservicios para Emprendimientos
            </h2>
          </div>
        </div>

        <p className="mb-7 max-w-[631px] text-[14px] leading-[25.2px] text-[#111122] dark:text-[#a1a8b3]">
          Soluciones puntuales a precio cerrado para negocios que necesitan
          presencia digital rapida sin complejidad tecnica. Cada microservicio
          es un entregable independiente, listo para usar.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {microservicios.map((item) => {
            const Icon =
              item.icon_key && iconMap[item.icon_key]
                ? iconMap[item.icon_key]
                : Globe;

            return (
              <div
                key={item.id}
                className="rounded-[14px] border border-[rgba(17,17,34,0.06)] bg-[rgba(0,0,0,0.04)] p-[20px] dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-[2px] flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(90,128,255,0.1)]">
                    <Icon
                      className="h-4 w-4 text-[#1f4fff]"
                      strokeWidth={1.9}
                    />
                  </div>

                  <div>
                    <p className="text-[14.4px] font-bold leading-[21.6px] text-[#111122] dark:text-white">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[12px] leading-[20.4px] text-[rgba(17,17,34,0.35)] dark:text-[#a1a8b3]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
