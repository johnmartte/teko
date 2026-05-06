import PageHero from "@/components/globales/PageHero";
import SectionPlanes from "@/components/precios/section-planes";
import SectionMicroserviciosPrecios from "@/components/precios/section-microservicios-precios";
import SectionFAQ from "@/components/precios/section-faq";

export default function PreciosPage() {
  return (
    <main>
      <PageHero
        badge="Planes y Precios 2026"
        title={
          <>
            Precios claros, <span className="text-[#0047ff]">sin sorpresas</span>
          </>
        }
        description="Tres planes para cubrir desde microservicios puntuales hasta transformación digital completa. Y si necesitas algo específico, también lo cotizamos a medida."
      />
      <SectionPlanes />
      <SectionMicroserviciosPrecios />
      <SectionFAQ />
    </main>
  );
}
