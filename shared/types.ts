export interface ServiceCard {
  icon: React.ReactNode;
  badge: string;
  title: string;
  /** Markdown string — puede ser lista o texto libre */
  description: string;
  /** @deprecated — no longer used in the dark redesign */
  accentText?: string;
}

export interface ServiceSectionProps {
  phase: string;
  phaseLabel?: string;
  title: string;
  /** Single hex color for phase number, badge, icon and bullet dots */
  accentColor?: string;
  cards: ServiceCard[];
  /** @deprecated — replaced by accentColor */
  accentBg?: string;
  accentText?: string;
  sectionBg?: string;
}
