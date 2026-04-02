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
    badgeColor: "bg-[#9333ea]", // Purple
    iconColor: "text-gray-400",
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
      <div className="relative mb-6">
        <div
          className={cn(
            "flex items-center justify-center w-24 h-24 p-3 border border-gray-100 bg-white rounded-full shadow-lg group-hover:shadow-xl transition-shadow duration-300",
          )}
        >
          <div
            className={cn(
              "w-full h-full flex items-center justify-center rounded-full absolute m-3",
              `${step.badgeColor} opacity-15 w-20 h-20`,
            )}
          ></div>
          <IconComponent className={`${step.iconColor} w-10 h-10`} />
        </div>
        {/* Badge Numerado */}
        <div
          className={`absolute top-3 right-0 flex items-center justify-center w-8 h-8 rounded-full ${step.badgeColor} transform translate-x-1/2 -translate-y-1/2 shadow-md`}
        >
          <span className="font-semibold text-white text-sm">{step.id}</span>
        </div>
      </div>

      {/* Texto del Paso */}
      <div className="text-center">
        <h3 className="mb-2 text-xl font-bold text-gray-950">{step.title}</h3>
        <p className="max-w-60 text-sm text-gray-500 leading-relaxed">
          {step.description}
        </p>
      </div>
    </div>
  );
};

export default function SectionNuestroProcesoTrabajo() {
  return (
    <div className="bg-white">
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Encabezado */}
          <div className="max-w-4xl mx-auto mb-16 text-center">
            <h2 className="mb-4 text-5xl font-extrabold tracking-tight text-gray-950 md:text-6xl">
              Nuestro proceso de trabajo
            </h2>
            <p className="text-lg font-light text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Un método probado en +50 proyectos que reduce la incertidumbre y
              maximiza resultados.
            </p>
          </div>

          {/* Pasos del Flujo de Trabajo */}
          <div className="relative">
            {/* Línea de Conexión (Cyan) */}
            <div className="absolute top-12 left-0 right-0 hidden md:block">
              <div className="h-0.5 bg-[#00d7f2]/15 rounded-full w-full mx-auto max-w-[calc(100%-120px)]"></div>
            </div>

            {/* Cuadrícula de Pasos */}
            <div className="grid grid-cols-1 gap-y-16 sm:grid-cols-2 md:grid-cols-5 md:gap-x-12 relative z-10">
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
