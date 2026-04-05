import { cn } from "@/lib/utils";
import { FiSearch, FiTarget, FiPenTool, FiCode, FiSend } from "react-icons/fi";

const workflowSteps = [
  {
    id: 1,
    title: "Investigación",
    description:
      "Entendemos tu negocio, usuarios y objetivos para definir el alcance del proyecto.",
    icon: FiSearch,
    badgeColor: "bg-[#00d7f2]", // Cyan
    iconColor: "text-[#00d7f2]",
  },
  {
    id: 2,
    title: "Estrategia",
    description:
      "Definimos la arquitectura, roadmap y métricas de éxito del producto digital.",
    icon: FiTarget,
    badgeColor: "bg-[#2563eb]", // Blue
    iconColor: "text-gray-400",
  },
  {
    id: 3,
    title: "Diseño",
    description:
      "Creamos wireframes, prototipos interactivos y el sistema de diseño visual.",
    icon: FiPenTool,
    badgeColor: "bg-[#0047ff]",
    iconColor: "text-[#0047ff]",
  },
  {
    id: 4,
    title: "Desarrollo",
    description:
      "Construimos con código limpio, sprints ágiles y revisiones continuas.",
    icon: FiCode,
    badgeColor: "bg-[#00d7f2]", // Cyan
    iconColor: "text-gray-400",
  },
  {
    id: 5,
    title: "Lanzamiento",
    description:
      "Desplegamos, monitoreamos y optimizamos para un lanzamiento impecable.",
    icon: FiSend, // Paper plane
    badgeColor: "bg-[#00d7f2]", // Cyan
    iconColor: "text-gray-400",
  },
];

const WorkflowStep = ({ step }: { step: (typeof workflowSteps)[0] }) => {
  const IconComponent = step.icon;
  return (
    <div className="flex flex-col items-center group">
      {/* Contenedor del Icono y el Badge */}
      <div className="relative mb-5">
        <div
          className={cn(
            "flex items-center justify-center h-[104px] w-[104px] border border-[#f2f4f7] bg-white rounded-full shadow-[0_8px_22px_-12px_rgba(16,24,40,0.28)] group-hover:shadow-[0_14px_32px_-12px_rgba(16,24,40,0.38)] transition-shadow duration-300",
          )}
        >
          <div
            className={cn(
              "h-16 w-16 flex items-center justify-center rounded-full absolute",
              `${step.badgeColor} opacity-15`,
            )}
          ></div>
          <IconComponent className={`${step.iconColor} h-8 w-8`} />
        </div>
        {/* Badge Numerado */}
        <div
          className={`absolute right-0 top-3 flex h-7 w-7 items-center justify-center rounded-full ${step.badgeColor} translate-x-1/2 -translate-y-1/2 shadow-md`}
        >
          <span className="text-[12px] font-semibold text-white">{step.id}</span>
        </div>
      </div>

      {/* Texto del Paso */}
      <div className="text-center">
        <h3 className="mb-2 text-[18px] font-semibold text-[#101828]">{step.title}</h3>
        <p className="max-w-60 text-[14px] leading-[22px] text-[#99a1af]">
          {step.description}
        </p>
      </div>
    </div>
  );
};

export default function SectionNuestroProcesoTrabajo() {
  return (
    <div className="bg-white">
      <section className="px-4 pb-24 pt-10 md:px-[145px] md:pb-[120px] md:pt-8">
        <div className="mx-auto max-w-[1150px]">
          {/* Encabezado */}
          <div className="mx-auto mb-14 max-w-[840px] text-center">
            <h2 className="mb-4 text-[34px] font-extrabold tracking-[-0.06em] text-[#101828] md:text-[40px] md:leading-[48px]">
              Nuestro proceso de trabajo
            </h2>
            <p className="mx-auto max-w-[752px] text-[14px] font-normal leading-[22px] text-[#99a1af] md:text-[16px] md:leading-[24px]">
              Un método probado en +50 proyectos que reduce la incertidumbre y
              maximiza resultados.
            </p>
          </div>

          {/* Pasos del Flujo de Trabajo */}
          <div className="relative">
            {/* Línea de Conexión (Cyan) */}
            <div className="absolute left-0 right-0 top-[52px] hidden md:block">
              <div className="mx-auto h-[2px] w-full max-w-[calc(100%-110px)] rounded-full bg-[#00d7f2]/20"></div>
            </div>

            {/* Conector vertical — solo móvil */}
            <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-0.5 bg-[#00d7f2]/20 block md:hidden" />

            {/* Cuadrícula de Pasos */}
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
