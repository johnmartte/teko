"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getProjectById, getMeetingsForProject } from "@/Data/portal/mock-helpers";
import ProjectStatusBadge from "@/components/portal/proyectos/project-status-badge";
import MilestoneTimeline from "@/components/portal/proyectos/milestone-timeline";
import DeliverableList from "@/components/portal/proyectos/deliverable-list";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const project = getProjectById(projectId);
  const meetings = getMeetingsForProject(projectId);

  if (!project) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-[#7a8595] dark:text-white/40">Proyecto no encontrado.</p>
      </div>
    );
  }

  const upcomingMeetings = meetings.filter((m) => m.status === "programada");

  return (
    <div className="mx-auto max-w-[1000px] space-y-8">
      {/* Back link */}
      <Link
        href="/portal/proyectos"
        className="inline-flex items-center gap-1.5 text-sm text-[#7a8595] transition-colors hover:text-[#0047ff] dark:text-white/40 dark:hover:text-white/70"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a proyectos
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-[#e6eaf2] bg-white p-6 dark:border-white/10 dark:bg-[#0f1525]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a8595] dark:text-white/40">
              {project.category}
            </p>
            <h1 className="text-xl font-bold text-[#101828] dark:text-white sm:text-2xl">
              {project.name}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-[#52607a] dark:text-white/50">
              {project.description}
            </p>
          </div>
          <ProjectStatusBadge status={project.status} />
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[#7a8595] dark:text-white/40">Progreso general</span>
            <span className="font-semibold text-[#101828] dark:text-white">
              {project.progress}%
            </span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-[12px] text-[#7a8595] dark:text-white/40">
          <span>
            Inicio:{" "}
            <strong className="text-[#101828] dark:text-white">
              {new Date(project.startDate).toLocaleDateString("es-DO", { month: "long", day: "numeric", year: "numeric" })}
            </strong>
          </span>
          <span>
            Entrega est.:{" "}
            <strong className="text-[#101828] dark:text-white">
              {new Date(project.estimatedEndDate).toLocaleDateString("es-DO", { month: "long", day: "numeric", year: "numeric" })}
            </strong>
          </span>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Timeline */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-sm font-semibold text-[#101828] dark:text-white">Hitos</h2>
          <div className="rounded-2xl border border-[#e6eaf2] bg-white p-5 dark:border-white/10 dark:bg-[#0f1525]">
            <MilestoneTimeline milestones={project.milestones} />
          </div>
        </div>

        {/* Sidebar info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Team */}
          <h2 className="text-sm font-semibold text-[#101828] dark:text-white">Equipo TEKO</h2>
          <div className="rounded-2xl border border-[#e6eaf2] bg-white p-4 dark:border-white/10 dark:bg-[#0f1525]">
            <div className="space-y-2">
              {project.team.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-[#1ec4ff]/20 to-[#0047ff]/20 text-[11px] font-bold text-[#0047ff] dark:text-[#7aa3ff]">
                    {member.name.split(" ").map((w) => w[0]).join("")}
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-[#101828] dark:text-white">
                      {member.name}
                    </p>
                    <p className="text-[11px] text-[#7a8595] dark:text-white/40">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming meetings */}
          {upcomingMeetings.length > 0 && (
            <>
              <h2 className="text-sm font-semibold text-[#101828] dark:text-white">
                Proximas reuniones
              </h2>
              <div className="space-y-2">
                {upcomingMeetings.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-xl border border-[#e6eaf2] bg-white px-4 py-3 dark:border-white/10 dark:bg-[#0f1525]"
                  >
                    <p className="text-[13px] font-medium text-[#101828] dark:text-white">
                      {m.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#7a8595] dark:text-white/40">
                      {new Date(m.date).toLocaleDateString("es-DO", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" · "}{m.platform}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Deliverables */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-[#101828] dark:text-white">
          Entregables ({project.deliverables.length})
        </h2>
        <DeliverableList deliverables={project.deliverables} />
      </div>
    </div>
  );
}
