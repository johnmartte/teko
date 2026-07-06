"use client";

import { useEffect, useMemo, useState } from "react";
import { serviciosSections as staticSections } from "@/Data/servicios/servicios-data";
import { SectionServicios } from "@/components/globales/section-servicios";
import ServicesHero from "@/components/servicios/section-hero-service";
import SectionMicroservicios from "@/components/servicios/section-microservicios";
import type { ServiceSectionProps } from "@/shared/types";
import {
  Globe,
  Layers,
  Palette,
  Code2,
  Plug,
  Wrench,
  Cloud,
  GitBranch,
  MessageSquare,
  Presentation,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL no está definida");
}

const iconMap = {
  globe: <Globe size={18} />,
  layers: <Layers size={18} />,
  palette: <Palette size={18} />,
  code: <Code2 size={18} />,
  plug: <Plug size={18} />,
  wrench: <Wrench size={18} />,
  cloud: <Cloud size={18} />,
  git_branch: <GitBranch size={18} />,
  message_square: <MessageSquare size={18} />,
  presentation: <Presentation size={18} />,
};

type ApiService = {
  id: number;
  title: string;
  description: string | null;
  type: string;
  icon_key: keyof typeof iconMap | null;
  badge: string | null;
  category: {
    name: string;
    slug: string;
  } | null;
};

export default function ServiciosPage() {
  const [services, setServices] = useState<ApiService[]>([]);

  useEffect(() => {
    async function loadServices() {
      const res = await fetch(`${API_URL}/services`);
      const data = await res.json();
      setServices(data);
    }

    loadServices();
  }, []);

  const sections = useMemo<ServiceSectionProps[]>(() => {
    return staticSections.map((section) => {
      const sectionServices = services.filter(
        (service) =>
          service.type === "service" &&
          service.category?.name === section.title,
      );

      if (!sectionServices.length) return section;

      return {
        ...section,
        cards: sectionServices.map((service) => ({
          icon: service.icon_key ? iconMap[service.icon_key] : <Globe size={18} />,
          badge: service.badge || "",
          title: service.title,
          description: service.description || "",
        })),
      };
    });
  }, [services]);

  return (
    <main>
      <ServicesHero />
      {sections.map((section, i) => (
        <div key={section.title} className={i === 0 ? "-mt-8 md:-mt-10" : ""}>
          <SectionServicios {...section} />
        </div>
      ))}
      <SectionMicroservicios />
    </main>
  );
}