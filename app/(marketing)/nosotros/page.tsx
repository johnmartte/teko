import PageHero from "@/components/globales/PageHero";
import SectionMisionValores from "@/components/nosotros/section-mision-valores";
import SectionStats from "@/components/nosotros/section-stats";
import SectionEquipo from "@/components/nosotros/section-equipo";

export default function NosotrosPage() {
  return (
    <main>
      <PageHero
        badge="Sobre TEKO"
        title={
          <>
            Tu partner tecnológico <br className="hidden md:block" />
            <span className="text-[#0047ff]">integral</span>
          </>
        }
        description="Somos un equipo apasionado por construir productos digitales que generan resultados reales. Trabajamos con startups, negocios establecidos y emprendimientos en Estados Unidos y América Latina."
      />
      <SectionStats />
      <SectionMisionValores />
      <SectionEquipo />
    </main>
  );
}
