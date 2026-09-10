import SectionHero from "@/components/home/section-hero";
import TechMarquee from "@/components/home/tech-marquee";
import SectionTransformacionDigital from "@/components/home/section-transfromacion-digital";
import SectionNuestroProcesoTrabajo from "@/components/home/section-nuestro-proceso-trabajo";
import SectionHacemosMejor from "@/components/home/section-hacemos-mejor";
import SectionCasoRapidito from "@/components/home/section-caso-rapidito";
import SectionPlataformas from "@/components/home/section-plataformas";
import SectionAhorraTiempo from "@/components/home/section-ahorra-tiempo";

export default function Home() {
  return (
    <div style={{ background: "#080a0f" }}>
      <SectionHero />
      <TechMarquee />
      <SectionTransformacionDigital />
      <SectionNuestroProcesoTrabajo />
      <SectionHacemosMejor />
      <SectionCasoRapidito />
      <SectionPlataformas />
      <SectionAhorraTiempo />
    </div>
  );
}
