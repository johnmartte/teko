"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Project } from "@/shared/portal-types";
import ProjectStatusBadge from "./project-status-badge";

export default function ProjectCard({ project }: { project: Project }) {
  const nextMilestone = project.milestones.find(
    (m) => m.status === "en_progreso" || m.status === "pendiente",
  );

  return (
    <Link
      href={`/portal/proyectos/${project.id}`}
      className="group flex flex-col rounded-2xl border border-[#e6eaf2] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-[#0f1525] dark:hover:shadow-[0_12px_32px_-8px_rgba(11,110,255,0.25)]"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a8595] dark:text-white/40">
            {project.category}
          </p>
          <h3 className="text-base font-bold text-[#101828] dark:text-white">
            {project.name}
          </h3>
        </div>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f4f7ff] text-[#7a8595] transition-all group-hover:bg-[#0047ff] group-hover:text-white dark:bg-white/5 dark:text-white/40">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <ProjectStatusBadge status={project.status} />

      <div className="mt-4 space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#7a8595] dark:text-white/40">Progreso</span>
          <span className="font-semibold text-[#101828] dark:text-white">
            {project.progress}%
          </span>
        </div>
        <Progress value={project.progress} className="h-1.5" />
      </div>

      {nextMilestone && (
        <div className="mt-4 rounded-xl bg-[#f4f7ff] px-3 py-2 dark:bg-white/5">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7a8595] dark:text-white/40">
            Proximo hito
          </p>
          <p className="mt-0.5 text-[12px] font-medium text-[#101828] dark:text-white/80">
            {nextMilestone.title}
          </p>
        </div>
      )}
    </Link>
  );
}
