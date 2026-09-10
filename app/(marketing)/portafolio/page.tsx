"use client";

import SectionPortafolioGrid from "@/components/portafolio/section-portafolio-grid";
import PortafolioHero from "@/components/portafolio/portafolio-hero";

export default function PortafolioPage() {
  return (
    <main style={{ background: "#080a0f" }}>
      <PortafolioHero />
      <SectionPortafolioGrid />
    </main>
  );
}
