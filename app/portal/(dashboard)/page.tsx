"use client";

import { useAuth } from "@/components/portal/auth/auth-context";
import OverviewStats from "@/components/portal/dashboard/overview-stats";
import RecentActivity from "@/components/portal/dashboard/recent-activity";
import ProjectCard from "@/components/portal/proyectos/project-card";
import { mockDashboardSummary, mockProjects, mockNotifications } from "@/Data/portal/mock-data";

export default function DashboardPage() {
  const { user } = useAuth();
  const activeProjects = mockProjects.filter((p) => p.status !== "completado");

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold tracking-[-0.03em] text-[var(--text-primary)]">
          Hola, {user?.firstName} 👋
        </h1>
        <p className="mt-1 text-sm text-[var(--text-faint)]">
          Aqui tienes un resumen de tus proyectos y actividad.
        </p>
      </div>

      {/* Stats */}
      <OverviewStats summary={mockDashboardSummary} />

      {/* Grid: Projects + Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            Proyectos activos
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {activeProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
        <div>
          <RecentActivity notifications={mockNotifications.slice(0, 6)} />
        </div>
      </div>
    </div>
  );
}
