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
import type { ServiceSectionProps } from "@/shared/types";

export const serviciosSections: ServiceSectionProps[] = [
  {
    phase: "01",
    phaseLabel: "FASE",
    title: "Diseño & Branding",
    accentBg: "bg-[#eef2ff]",
    accentText: "text-[#6366f1]",
    sectionBg: "bg-[#f0f4f8]",
    cards: [
      {
        icon: <Palette size={18} />,
        badge: "Branding",
        title: "Identidad Visual Completa",
        description: `- Logo, paleta de colores y tipografía corporativa\n- Brand guidelines y design system completo\n- Variantes para uso digital e impresión`,
      },
      {
        icon: <Layers size={18} />,
        badge: "UI / UX",
        title: "Diseño de Interfaces",
        description: `- Wireframes, prototipos y flujos de usuario\n- Diseño de apps web y móviles en Figma\n- Testing de usabilidad`,
      },
      {
        icon: <Globe size={18} />,
        badge: "Web",
        title: "Landing Pages & Sitios Web",
        description: `- Diseño visual orientado a conversión\n- Maquetas Figma listas para desarrollo\n- Responsive y mobile-first`,
      },
      {
        icon: <Presentation size={18} />,
        badge: "Pitch",
        title: "Presentaciones & Pitch Decks",
        description: `- Pitch para inversionistas y clientes\n- Catálogos y portafolios digitales\n- Presentaciones de marca corporativa`,
      },
    ],
  },
  {
    phase: "02",
    phaseLabel: "FASE",
    title: "Desarrollo Web & Software",
    accentBg: "bg-[#eff6ff]",
    accentText: "text-[#3b82f6]",
    sectionBg: "bg-white",
    cards: [
      {
        icon: <Code2 size={18} />,
        badge: "Dev",
        title: "Desarrollo Web",
        description: `- Sitios y landing pages con React / Next.js\n- Aplicaciones web a medida\n- E-commerce y tiendas online`,
      },
      {
        icon: <Plug size={18} />,
        badge: "API",
        title: "Integraciones & APIs",
        description: `- Integración con plataformas externas\n- Automatizaciones de flujo de trabajo\n- Conexión a pagos, CRMs y ERPs`,
      },
      {
        icon: <Wrench size={18} />,
        badge: "Ops",
        title: "Mantenimiento & Soporte",
        description: `- Actualizaciones y correcciones continuas\n- Monitoreo de rendimiento\n- Soporte técnico mensual`,
      },
    ],
  },
  {
    phase: "03",
    phaseLabel: "FASE",
    title: "Infraestructura & Cloud",
    accentBg: "bg-[#ecfeff]",
    accentText: "text-[#22d3ee]",
    sectionBg: "bg-[#f0f4f8]",
    cards: [
      {
        icon: <Cloud size={18} />,
        badge: "Cloud",
        title: "Servidores & Hosting",
        description: `- AWS, Vercel, DigitalOcean, Cloudflare\n- Configuración de dominios, DNS y SSL\n- Seguridad y respaldos automáticos`,
      },
      {
        icon: <GitBranch size={18} />,
        badge: "CI/CD",
        title: "DevOps & Automatización",
        description: `- Pipelines de deployment automáticos\n- Control de versiones y ambientes\n- Monitoreo y alertas en tiempo real`,
      },
      {
        icon: <MessageSquare size={18} />,
        badge: "Consult",
        title: "Consultoría Tecnológica",
        description: `- Auditoría tecnológica de productos existentes\n- Arquitectura de software para startups\n- Selección de stack tecnológico`,
      },
    ],
  },
];
