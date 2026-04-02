import SectionHero from "@/components/home/section-hero";
import SectionNuestroProcesoTrabajo from "@/components/home/section-nuestro-proceso-trabajo";
import SectionTransformacionDigital from "@/components/home/section-transfromacion-digital";

export default function Home() {
  return (
    <div className="l">
      <SectionHero />
      <SectionTransformacionDigital />
      <SectionNuestroProcesoTrabajo />
    </div>
  );
}
