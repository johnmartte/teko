export interface ServiceCard {
  icon: React.ReactNode;
  badge: string;
  title: string;
  /** Markdown string — puede ser lista o texto libre */
  description: string;
  /** Heredado de la sección — colorea badge e ícono */
  accentText?: string;
}

export interface ServiceSectionProps {
  phase: string;        // ej: "01"
  phaseLabel?: string;  // ej: "FASE"
  title: string;        // ej: "Diseño & Branding"
  /** Clases Tailwind para el fondo del badge circular del número y el color del texto del badge */
  accentBg?: string;    // ej: "bg-violet-100"
  accentText?: string;  // ej: "text-violet-600"
  /** Clase Tailwind para el fondo de la sección completa */
  sectionBg?: string;   // ej: "bg-slate-100"
  cards: ServiceCard[];
}
