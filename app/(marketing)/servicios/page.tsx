import { SectionServicios } from "@/components/globales/section-servicios";
import ServicesHero from "@/components/servicios/section-hero-service";
import SectionMicroservicios from "@/components/servicios/section-microservicios";
import { serviciosSections } from "@/Data/servicios/servicios-data";

export default function ServiciosPage() {
  return (
    <main>
      <ServicesHero/>
      {serviciosSections.map((section, i) => (
        <div key={i} className={i === 0 ? "-mt-8 md:-mt-10" : ""}>
          <SectionServicios {...section} />
        </div>
      ))}
      <SectionMicroservicios />
    </main>
  );
}
