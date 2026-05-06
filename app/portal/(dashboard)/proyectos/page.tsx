"use client";

import ProjectCard from "@/components/portal/proyectos/project-card";
import { mockProjects } from "@/Data/portal/mock-data";

export default function ProyectosPage() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#101828] dark:text-white">
          Proyectos
        </h1>
        <p className="mt-1 text-sm text-[#7a8595] dark:text-white/40">
          Todos tus proyectos con TEKO en un solo lugar.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}
