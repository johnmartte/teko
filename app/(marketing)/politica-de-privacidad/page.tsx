import PageHero from "@/components/globales/PageHero";
import LegalContent from "@/components/legal/legal-content";

export const metadata = {
  title: "Política de Privacidad | TEKO",
};

const sections = [
  {
    title: "Información que recopilamos",
    content: [
      "Cuando usted utiliza nuestro sitio web o se pone en contacto con nosotros, podemos recopilar información personal como su nombre, dirección de correo electrónico, número de teléfono y nombre de su empresa. Esta información se recopila únicamente cuando usted la proporciona voluntariamente a través de nuestros formularios de contacto o cotización.",
      "También recopilamos automáticamente información técnica como su dirección IP, tipo de navegador, sistema operativo, páginas visitadas y tiempo de permanencia en el sitio, mediante cookies y tecnologías similares.",
    ],
  },
  {
    title: "Uso de la información",
    content: [
      "Utilizamos su información personal para: responder a sus consultas y solicitudes de cotización, enviarle información relevante sobre nuestros servicios (solo si usted lo ha autorizado), mejorar nuestro sitio web y la experiencia del usuario, y cumplir con obligaciones legales aplicables.",
      "No vendemos, alquilamos ni compartimos su información personal con terceros con fines comerciales. Solo compartimos datos con proveedores de servicios que nos asisten en la operación del sitio y que están obligados a mantener la confidencialidad de dicha información.",
    ],
  },
  {
    title: "Protección de datos",
    content: [
      "Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción. Estas medidas incluyen cifrado de datos en tránsito (HTTPS), acceso restringido a la información y respaldos periódicos.",
    ],
  },
  {
    title: "Sus derechos",
    content: [
      "Usted tiene derecho a acceder, rectificar, actualizar o solicitar la eliminación de su información personal en cualquier momento. Para ejercer estos derechos, puede contactarnos a través de nuestro formulario de contacto o enviando un correo electrónico a nuestro equipo.",
    ],
  },
  {
    title: "Retención de datos",
    content: [
      "Conservamos su información personal solo durante el tiempo necesario para cumplir con los fines para los que fue recopilada, incluyendo obligaciones legales, contables o de informes.",
    ],
  },
  {
    title: "Cambios en esta política",
    content: [
      "Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento. Cualquier cambio será publicado en esta página con la fecha de actualización correspondiente. Le recomendamos revisar esta política periódicamente.",
    ],
  },
  {
    title: "Contacto",
    content: [
      "Si tiene preguntas sobre esta Política de Privacidad o sobre el tratamiento de sus datos personales, no dude en contactarnos a través de la sección de contacto de nuestro sitio web.",
    ],
  },
];

export default function PoliticaPrivacidadPage() {
  return (
    <main>
      <PageHero
        badge="Legal"
        title={
          <>
            Política de <span className="text-[#0047ff]">Privacidad</span>
          </>
        }
        description="En TEKO nos comprometemos a proteger su privacidad y sus datos personales. Esta política describe cómo recopilamos, usamos y protegemos su información."
      />
      <LegalContent lastUpdated="15 de julio de 2026" sections={sections} />
    </main>
  );
}
