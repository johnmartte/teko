import Image from "next/image";
import EstrategiaDigital from "@/public/Estrategia-Digital-Imagen.svg";
import DisenoDesarrollo from "@/public/Diseno-Desarrollo-Imagen.svg";
import SistemeTecnologia from "@/public/Sistema-Tecnologia-Imagen.svg";

export default function SectionTransformacionDigital() {
  return (
    <section className="flex flex-col items-center gap-10 px-4 pb-10 pt-1 md:px-[200px]">
      {/* Encabezado */}
      <div className="max-w-[1040px] space-y-3 text-center">
        <h2 className="text-[34px] font-extrabold tracking-[-0.06em] text-[#101828] md:text-[38px] md:leading-[46px]">
          Tu proceso de Transformación Digital
        </h2>
        <p className="mx-auto max-w-[855px] text-[14px] font-light leading-[26px] text-black md:text-[20px] md:tracking-[-0.05em]">
          Ofrecer servicios de Transformación Digital: desde el desarrollo de
          estrategia de branding digital, diseño de identidad visual, creación
          de presencia web/mobile, hasta la implementación de sistemas y
          soluciones tecnológicas específicas
        </p>
      </div>

      {/* Contenedor de las 3 columnas */}
      <div className="relative grid w-full max-w-[1004px] grid-cols-1 gap-8 md:grid-cols-3 md:gap-[38px]">
        
        {/* Línea conectora (SVG) - Oculta en móviles, detrás de las imágenes */}
        <div className="absolute left-0 top-[100px] -z-10 hidden w-[976px] md:block">
          <svg 
            className="h-full w-full"
            viewBox="0 0 522 32" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path 
              d="M0.75 15.75C60.75 15.75 80.75 0.75 140.75 0.75C200.75 0.75 220.75 30.75 280.75 30.75C340.75 30.75 360.75 0.75 400.75 0.75C460.75 0.75 480.75 15.75 520.75 15.75" 
              stroke="#93B4D4" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeDasharray="5 5"
            />
          </svg>
        </div>

        {/* Columna 1 */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex h-[150px] items-center justify-center bg-white">
            <Image src={EstrategiaDigital} alt="Estrategia de Branding" />
          </div>
          <h3 className="text-[14px] font-bold leading-[20.88px] text-[#101828]">
            Estrategia de Branding <br /> & Identidad Visual
          </h3>
          <p className="max-w-[214px] text-[12px] font-normal leading-[20.4px] text-[#99a1af]">
            Definimos tu ADN de marca, paleta de colores, tipografía y guía de
            estilo para crear una identidad digital coherente e impactante
          </p>
        </div>

        {/* Columna 2 */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex h-[150px] items-center justify-center bg-white">
            <Image src={DisenoDesarrollo} alt="Diseño y Desarrollo" />
          </div>
          <h3 className="text-[14px] font-bold leading-[20.88px] text-[#101828]">
            Diseño & Desarrollo <br /> Web y Mobile
          </h3>
          <p className="max-w-[214px] text-[12px] font-normal leading-[20.4px] text-[#99a1af]">
            Creamos experiencias digitales responsivas que convierten visitantes
            en clientes, con diseño UX/UI centrado en resultados
          </p>
        </div>

        {/* Columna 3 */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex h-[150px] items-center justify-center bg-white">
            <Image src={SistemeTecnologia} alt="Implementación de Sistemas" />
          </div>
          <h3 className="text-[14px] font-bold leading-[20.88px] text-[#101828]">
            Implementación de <br /> Sistemas y Tecnología
          </h3>
          <p className="max-w-[214px] text-[12px] font-normal leading-[20.4px] text-[#99a1af]">
            Integramos CRM, automatización, analytics y soluciones a medida que
            potencian tu operación y escalan con tu negocio
          </p>
        </div>

      </div>
    </section>
  );
}