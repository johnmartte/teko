import PageHero from "@/components/globales/PageHero";
import LegalContent from "@/components/legal/legal-content";

export const metadata = {
  title: "Términos y Condiciones | TEKO",
};

const sections = [
  {
    title: "Aceptación de los términos",
    content: [
      "Al acceder y utilizar el sitio web de TEKO (teko.do), usted acepta cumplir con estos Términos y Condiciones. Si no está de acuerdo con alguno de estos términos, le recomendamos no utilizar nuestro sitio web.",
    ],
  },
  {
    title: "Servicios",
    content: [
      "TEKO es una agencia de transformación digital que ofrece servicios de diseño, desarrollo e implementación de soluciones tecnológicas. Los servicios específicos, alcances, plazos y costos se definen en propuestas y contratos individuales acordados entre TEKO y cada cliente.",
      "Las cotizaciones presentadas en nuestro sitio web son referenciales y pueden variar según los requerimientos específicos de cada proyecto. Los precios finales se establecen mediante cotización personalizada.",
    ],
  },
  {
    title: "Propiedad intelectual",
    content: [
      "Todo el contenido de este sitio web, incluyendo pero no limitado a textos, gráficos, logotipos, iconos, imágenes, diseños y código fuente, es propiedad de TEKO o se utiliza con la debida autorización, y está protegido por las leyes de propiedad intelectual aplicables.",
      "Los entregables de cada proyecto se rigen por los términos específicos del contrato correspondiente. Salvo acuerdo en contrario, los derechos de propiedad intelectual del producto final se transfieren al cliente una vez completado el pago total del proyecto.",
    ],
  },
  {
    title: "Uso del sitio web",
    content: [
      "Usted se compromete a utilizar este sitio web únicamente para fines legales y de manera que no infrinja los derechos de terceros ni restrinja o inhiba su uso y disfrute. Queda prohibido el uso de este sitio para transmitir material que sea difamatorio, ofensivo o ilegal.",
      "No está permitido intentar acceder sin autorización a ningún sistema informático, red o dato conectado a este sitio web, ni realizar actividades que puedan dañar, deshabilitar o sobrecargar nuestros servidores o infraestructura.",
    ],
  },
  {
    title: "Limitación de responsabilidad",
    content: [
      "TEKO se esfuerza por mantener la información de este sitio web actualizada y precisa, pero no garantiza que el contenido sea completo, exacto o actualizado en todo momento. El sitio web se proporciona \"tal cual\" sin garantías de ningún tipo.",
      "En ningún caso TEKO será responsable por daños directos, indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de uso de este sitio web o de los servicios ofrecidos a través del mismo.",
    ],
  },
  {
    title: "Enlaces externos",
    content: [
      "Nuestro sitio web puede contener enlaces a sitios web de terceros. Estos enlaces se proporcionan únicamente para su conveniencia y no implican respaldo ni responsabilidad por el contenido de dichos sitios. TEKO no se hace responsable del contenido ni de las prácticas de privacidad de sitios web de terceros.",
    ],
  },
  {
    title: "Confidencialidad",
    content: [
      "Toda la información compartida entre TEKO y sus clientes durante el proceso de consulta, cotización y ejecución de proyectos se considera confidencial. TEKO se compromete a no divulgar información del cliente a terceros sin su consentimiento previo, salvo que sea requerido por ley.",
    ],
  },
  {
    title: "Legislación aplicable",
    content: [
      "Estos Términos y Condiciones se rigen por las leyes de la República Dominicana. Cualquier disputa que surja en relación con estos términos será sometida a la jurisdicción de los tribunales competentes de la República Dominicana.",
    ],
  },
  {
    title: "Modificaciones",
    content: [
      "TEKO se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en este sitio web. El uso continuado del sitio después de la publicación de cambios constituye su aceptación de los mismos.",
    ],
  },
  {
    title: "Contacto",
    content: [
      "Para cualquier consulta relacionada con estos Términos y Condiciones, puede contactarnos a través de la sección de contacto de nuestro sitio web o mediante nuestros canales oficiales de comunicación.",
    ],
  },
];

export default function TerminosCondicionesPage() {
  return (
    <main>
      <PageHero
        badge="Legal"
        title={
          <>
            Términos y <span className="text-[#0047ff]">Condiciones</span>
          </>
        }
        description="Las condiciones que rigen el uso de nuestro sitio web y la contratación de nuestros servicios."
      />
      <LegalContent lastUpdated="15 de julio de 2026" sections={sections} />
    </main>
  );
}
