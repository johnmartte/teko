import PageHero from "@/components/globales/PageHero";
import SectionContactoForm from "@/components/contacto/section-contacto-form";

export default function ContactoPage() {
  return (
    <main>
      <PageHero
        badge="Conversemos"
        title={
          <>
            Listo para <span className="text-[#0047ff]">empezar</span>?
          </>
        }
        description="Cuéntanos sobre tu proyecto. Respondemos en menos de 24h laborales con una propuesta concreta y un roadmap claro."
      />
      <SectionContactoForm />
    </main>
  );
}
