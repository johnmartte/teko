"use client";

import { useEffect, useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InvestigacionImg from "@/public/Proceso-Investigacion.png";
import EstrategiaImg from "@/public/Proceso-Estrategia.png";
import DisenoImg from "@/public/Proceso-Diseno.png";
import DesarrolloImg from "@/public/Proceso-Desarrollo.png";
import LanzamientoImg from "@/public/Proceso-Lanzamiento.png";

gsap.registerPlugin(ScrollTrigger);

type WorkflowStepData = {
  id: number;
  title: string;
  description: string;
  image: StaticImageData;
  badgeColor: string;
};

const workflowSteps: WorkflowStepData[] = [
  {
    id: 1,
    title: "Investigación",
    description:
      "Entendemos tu negocio, usuarios y objetivos para definir el alcance del proyecto.",
    image: InvestigacionImg,
    badgeColor: "bg-[#00d7f2]",
  },
  {
    id: 2,
    title: "Estrategia",
    description:
      "Definimos la arquitectura, roadmap y métricas de éxito del producto digital.",
    image: EstrategiaImg,
    badgeColor: "bg-[#2563eb]",
  },
  {
    id: 3,
    title: "Diseño",
    description:
      "Creamos wireframes, prototipos interactivos y el sistema de diseño visual.",
    image: DisenoImg,
    badgeColor: "bg-[#0047ff]",
  },
  {
    id: 4,
    title: "Desarrollo",
    description:
      "Construimos con código limpio, sprints ágiles y revisiones continuas.",
    image: DesarrolloImg,
    badgeColor: "bg-[#00d7f2]",
  },
  {
    id: 5,
    title: "Lanzamiento",
    description:
      "Desplegamos, monitoreamos y optimizamos para un lanzamiento impecable.",
    image: LanzamientoImg,
    badgeColor: "bg-[#00d7f2]",
  },
];

const WorkflowStep = ({ step }: { step: WorkflowStepData }) => {
  return (
    <div className="workflow-step flex flex-col items-center group">
      <div className="relative mb-5">
        <div
          className={cn(
            "flex items-center justify-center h-[104px] w-[104px] border border-[#f2f4f7] bg-white rounded-full shadow-[0_8px_22px_-12px_rgba(16,24,40,0.28)] group-hover:shadow-[0_14px_32px_-12px_rgba(16,24,40,0.38)] transition-shadow duration-300 overflow-hidden dark:border-white/10 dark:bg-[#141a2b] dark:shadow-[0_8px_22px_-12px_rgba(0,0,0,0.6)]",
          )}
        >
          <Image
            src={step.image}
            alt={step.title}
            className="h-full w-full object-contain p-2"
          />
        </div>
        <div
          className={`absolute right-0 top-3 flex h-7 w-7 items-center justify-center rounded-full ${step.badgeColor} translate-x-1/2 -translate-y-1/2 shadow-md`}
        >
          <span className="text-[12px] font-semibold text-white">{step.id}</span>
        </div>
      </div>

      <div className="text-center">
        <h3 className="mb-2 text-[18px] font-semibold text-[#101828] dark:text-white">
          {step.title}
        </h3>
        <p className="max-w-60 text-[14px] leading-[22px] text-[#99a1af]">
          {step.description}
        </p>
      </div>
    </div>
  );
};

export default function SectionNuestroProcesoTrabajo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      // Línea conectora se expande desde el centro
      if (lineRef.current) {
        gsap.from(lineRef.current, {
          scaleX: 0,
          duration: 1.2,
          ease: "power2.inOut",
          transformOrigin: "center center",
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 80%",
            once: true,
          },
        });
      }

      // Pasos escalonados
      const steps = stepsRef.current?.querySelectorAll(".workflow-step");
      if (steps) {
        gsap.from(steps, {
          y: 40,
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          ease: "back.out(1.4)",
          stagger: 0.12,
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 78%",
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="bg-white dark:bg-[#0a0e1a]">
      <section className="px-4 pb-24 pt-10 md:px-[145px] md:pb-[120px] md:pt-8">
        <div className="mx-auto max-w-[1150px]">
          <div
            ref={headingRef}
            className="mx-auto mb-14 max-w-[840px] text-center"
          >
            <h2 className="mb-4 text-[34px] font-extrabold tracking-[-0.06em] text-[#101828] md:text-[40px] md:leading-[48px] dark:text-white">
              Nuestro proceso de trabajo
            </h2>
            <p className="mx-auto max-w-[752px] text-[14px] font-normal leading-[22px] text-[#99a1af] md:text-[16px] md:leading-[24px]">
              Un método probado en +50 proyectos que reduce la incertidumbre y
              maximiza resultados.
            </p>
          </div>

          <div ref={stepsRef} className="relative">
            <div className="absolute left-0 right-0 top-[52px] hidden md:block">
              <div
                ref={lineRef}
                className="mx-auto h-[2px] w-full max-w-[calc(100%-110px)] rounded-full bg-[#00d7f2]/20"
              ></div>
            </div>


            <div className="relative z-10 grid grid-cols-1 gap-y-14 sm:grid-cols-2 md:grid-cols-5 md:gap-x-8">
              {workflowSteps.map((step) => (
                <WorkflowStep key={step.id} step={step} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
