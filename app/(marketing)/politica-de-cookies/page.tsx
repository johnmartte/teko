import PageHero from "@/components/globales/PageHero";
import LegalContent from "@/components/legal/legal-content";

export const metadata = {
  title: "Política de Cookies | TEKO",
};

const sections = [
  {
    title: "¿Qué son las cookies?",
    content: [
      "Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. Se utilizan ampliamente para hacer que los sitios web funcionen de manera más eficiente y para proporcionar información a los propietarios del sitio.",
    ],
  },
  {
    title: "Cookies que utilizamos",
    content: [
      "Cookies estrictamente necesarias: Son esenciales para que el sitio web funcione correctamente. Incluyen cookies que le permiten navegar por el sitio y utilizar sus funciones. Estas cookies no recopilan información que pueda identificarlo.",
      "Cookies de rendimiento y análisis: Nos permiten contar las visitas y fuentes de tráfico para medir y mejorar el rendimiento de nuestro sitio. Nos ayudan a saber qué páginas son las más y menos populares, y cómo los visitantes se mueven por el sitio. Toda la información que recogen estas cookies es agregada y, por lo tanto, anónima.",
      "Cookies de funcionalidad: Permiten que el sitio web recuerde las elecciones que usted hace (como su preferencia de idioma o tema visual) y proporcionen funciones mejoradas y más personalizadas.",
    ],
  },
  {
    title: "Cookies de terceros",
    content: [
      "Nuestro sitio web puede utilizar servicios de terceros que establecen sus propias cookies, como Google Analytics para análisis de tráfico. Estas cookies están sujetas a las políticas de privacidad de los respectivos terceros y no tenemos control sobre ellas.",
    ],
  },
  {
    title: "Control de cookies",
    content: [
      "Usted puede configurar su navegador para rechazar todas las cookies o para que le avise cuando se envía una cookie. Sin embargo, si desactiva las cookies, algunas partes del sitio web podrían no funcionar correctamente.",
      "La mayoría de los navegadores permiten gestionar las preferencias de cookies. Puede encontrar información sobre cómo gestionar cookies en la sección de ayuda de su navegador.",
    ],
  },
  {
    title: "Cambios en esta política",
    content: [
      "Podemos actualizar esta Política de Cookies periódicamente para reflejar cambios en las cookies que utilizamos o por otros motivos operativos, legales o regulatorios. Le recomendamos revisar esta política con regularidad para estar informado sobre nuestro uso de cookies.",
    ],
  },
];

export default function PoliticaCookiesPage() {
  return (
    <main>
      <PageHero
        badge="Legal"
        title={
          <>
            Política de <span className="text-[#0047ff]">Cookies</span>
          </>
        }
        description="Información sobre cómo utilizamos las cookies en nuestro sitio web para mejorar su experiencia de navegación."
      />
      <LegalContent lastUpdated="15 de julio de 2026" sections={sections} />
    </main>
  );
}
