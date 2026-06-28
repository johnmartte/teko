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
      className="group flex flex-col rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 shadow-[0_1px_2px_var(--shadow-color)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_var(--shadow-color)]"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-faint)]">
            {project.category}
          </p>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            {project.name}
          </h3>
        </div>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-light)] text-[var(--brand)] transition-all group-hover:bg-[var(--brand)] group-hover:text-white">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <ProjectStatusBadge status={project.status} />

      <div className="mt-4 space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[var(--text-faint)]">Progreso</span>
          <span className="font-semibold text-[var(--text-primary)]">
            {project.progress}%
          </span>
        </div>
        <Progress value={project.progress} className="h-1.5" />
      </div>

      {nextMilestone && (
        <div className="mt-4 rounded-xl bg-[var(--bg-subtle)] px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--text-faint)]">
            Proximo hito
          </p>
          <p className="mt-0.5 text-[12px] font-medium text-[var(--text-secondary)]">
            {nextMilestone.title}
          </p>
        </div>
      )}
    </Link>
  );
}
