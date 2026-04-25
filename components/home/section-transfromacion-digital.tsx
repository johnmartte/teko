"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import EstrategiaDigital from "@/public/Tu-proceso-Estrategia-Branding.png";
import DisenoDesarrollo from "@/public/Tu-proceso-Diseno-Desarrollo.png";
import SistemeTecnologia from "@/public/Tu-proceso-Implementacion.png";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SectionTransformacionDigital() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading
      gsap.from(headingRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          once: true,
        },
      });

      // Columnas escalonadas
      const cols = columnsRef.current?.querySelectorAll(".column-item");
      if (cols) {
        gsap.from(cols, {
          y: 50,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: columnsRef.current,
            start: "top 80%",
            once: true,
          },
        });
      }

      // SVG de la línea conectora se "dibuja"
      const path = pathRef.current;
      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.6,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: columnsRef.current,
            start: "top 75%",
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex flex-col items-center gap-10 px-4 pb-10 pt-1 md:px-[200px]"
    >
      {/* Encabezado */}
      <div ref={headingRef} className="max-w-[1040px] text-center">
        <h2 className="text-[34px] font-extrabold tracking-[-0.06em] text-[#101828] md:text-[38px] md:leading-[46px] dark:text-white">
          Tu proceso de Transformación Digital
        </h2>
        <p className="mx-auto mt-4 max-w-[752px] text-[14px] font-normal leading-[22px] text-[#99a1af] md:text-[16px] md:leading-[24px]">
          Ofrecer servicios de Transformación Digital: desde el desarrollo de
          estrategia de branding digital, diseño de identidad visual, creación
          de presencia web/mobile, hasta la implementación de sistemas y
          soluciones tecnológicas específicas
        </p>
      </div>

      {/* Contenedor de las 3 columnas */}
      <div
        ref={columnsRef}
        className="relative grid w-full max-w-[1004px] grid-cols-1 gap-8 md:grid-cols-3 md:gap-[38px]"
      >
        {/* Línea conectora (SVG) */}
        <div className="absolute left-0 top-[20px] -z-10 hidden w-[976px] md:block">
          <svg
            className="h-full w-full"
            viewBox="0 0 522 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              ref={pathRef}
              d="M0.75 15.75C60.75 15.75 80.75 0.75 140.75 0.75C200.75 0.75 220.75 30.75 280.75 30.75C340.75 30.75 360.75 0.75 400.75 0.75C460.75 0.75 480.75 15.75 520.75 15.75"
              stroke="#93B4D4"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="5 5"
            />
          </svg>
        </div>

        {/* Columna 1 */}
        <div className="column-item flex flex-col items-center space-y-4 text-center">
          <div className="flex h-[150px] items-center justify-center bg-white dark:bg-transparent">
            <Image src={EstrategiaDigital} alt="Estrategia de Branding" className="h-full w-auto object-contain" />
          </div>
          <h3 className="text-[14px] font-bold leading-[20.88px] text-[#101828] dark:text-white">
            Estrategia de Branding <br /> & Identidad Visual
          </h3>
          <p className="max-w-[214px] text-[12px] font-normal leading-[20.4px] text-[#99a1af]">
            Definimos tu ADN de marca, paleta de colores, tipografía y guía de
            estilo para crear una identidad digital coherente e impactante
          </p>
        </div>

        {/* Columna 2 */}
        <div className="column-item flex flex-col items-center space-y-4 text-center">
          <div className="flex h-[150px] items-center justify-center bg-white dark:bg-transparent">
            <Image src={DisenoDesarrollo} alt="Diseño y Desarrollo" className="h-full w-auto object-contain" />
          </div>
          <h3 className="text-[14px] font-bold leading-[20.88px] text-[#101828] dark:text-white">
            Diseño & Desarrollo <br /> Web y Mobile
          </h3>
          <p className="max-w-[214px] text-[12px] font-normal leading-[20.4px] text-[#99a1af]">
            Creamos experiencias digitales responsivas que convierten visitantes
            en clientes, con diseño UX/UI centrado en resultados
          </p>
        </div>

        {/* Columna 3 */}
        <div className="column-item flex flex-col items-center space-y-4 text-center">
          <div className="flex h-[150px] items-center justify-center bg-white dark:bg-transparent">
            <Image src={SistemeTecnologia} alt="Implementación de Sistemas" className="h-full w-auto object-contain" />
          </div>
          <h3 className="text-[14px] font-bold leading-[20.88px] text-[#101828] dark:text-white">
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
