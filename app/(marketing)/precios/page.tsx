import PageHero from "@/components/globales/PageHero";
import SectionPlanes from "@/components/precios/section-planes";
import SectionMicroserviciosPrecios from "@/components/precios/section-microservicios-precios";
import SectionFAQ from "@/components/precios/section-faq";

export default function PreciosPage() {
  return (
    <main>
      <PageHero
        badge="Nuestros Planes"
        title={
          <>
            El plan perfecto para <span className="text-[#0047ff]">tu negocio</span>
          </>
        }
        description="Tres planes diseñados para cubrir desde los primeros pasos digitales hasta la transformación completa de tu empresa. Cotiza directamente con nosotros."
      />
      <SectionPlanes />
      <SectionMicroserviciosPrecios />
      <SectionFAQ />
    </main>
  );
}
