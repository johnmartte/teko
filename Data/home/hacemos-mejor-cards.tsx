import Image from "next/image";
import Branding from "@/public/Branding-Identidad-Visual.png";
import Aplicaciones from "@/public/Diseno-Desarrollo-Web.png";
import AplicacionesMoviles from "@/public/Aplicaciones-Moviles.png";
import Sistemas from "@/public/Sistemas-Automatizacion.png"

export const data_hacemos_mejor_cards = [
  {
    titulo: "Branding & Identidad Visual",
    descripcion:
      "Creamos marcas memorables con estrategia, storytelling y sistemas de diseño que conectan con tu audiencia.",
    image: <Image className="w-full" src={Branding} alt="" />,
  },
  {
    titulo: "Aplicaciones Móviles",
    descripcion:
      "Apps nativas e híbridas para iOS y Android con interfaces intuitivas y experiencia premium.",
    image: <Image className="w-full" src={AplicacionesMoviles} alt="" />,
  },
  {
    titulo: "Diseño & Desarrollo Web",
    descripcion:
      "Sitios y plataformas web de alto rendimiento con UX centrado en conversión y tecnología moderna.",
    image: <Image className="w-full" src={Aplicaciones} alt="" />,
  },
  {
    titulo: "Sistemas & Automatización",
    descripcion:
      "Software empresarial a medida — CRM, ERP, integraciones y automatización que escala con tu negocio.",
    image: <Image className="w-full" src={Sistemas} alt="" />,
  },
];
