import PageHero from "@/components/globales/PageHero";
import SectionPortafolioGrid from "@/components/portafolio/section-portafolio-grid";

export default function PortafolioPage() {
  return (
    <main>
      <PageHero
        badge="Casos de Éxito 2026"
        title={
          <>
            Proyectos que <span className="text-[#0047ff]">transforman</span>
          </>
        }
        description="Una selección de productos digitales que hemos construido para startups, negocios establecidos y emprendimientos en US y LATAM."
      />
      <SectionPortafolioGrid />
    </main>
  );
}
