"use client";

import { useEffect, useRef } from "react";
import { FolderKanban, CalendarDays, FileBox, Bell, DollarSign } from "lucide-react";
import type { DashboardSummary } from "@/shared/portal-types";
import { formatCurrency } from "@/Data/portal/mock-helpers";
import gsap from "gsap";

interface OverviewStatsProps {
  summary: DashboardSummary;
}

export default function OverviewStats({ summary }: OverviewStatsProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  const stats = [
    {
      label: "Proyectos activos",
      value: summary.activeProjectsCount,
      icon: FolderKanban,
      color: "text-[var(--brand)]",
      bg: "bg-[var(--brand-light)]",
    },
    {
      label: "Reuniones proximas",
      value: summary.upcomingMeetingsCount,
      icon: CalendarDays,
      color: "text-[var(--accent-green)]",
      bg: "bg-[var(--accent-green-bg)]",
    },
    {
      label: "Entregables pendientes",
      value: summary.pendingDeliverablesCount,
      icon: FileBox,
      color: "text-[var(--accent-yellow)]",
      bg: "bg-[var(--accent-yellow-bg)]",
    },
    {
      label: "Notificaciones",
      value: summary.unreadNotificationsCount,
      icon: Bell,
      color: "text-[var(--accent-red)]",
      bg: "bg-[var(--accent-red-bg)]",
    },
    {
      label: "Balance pendiente",
      value: formatCurrency(summary.outstandingBalance),
      icon: DollarSign,
      color: "text-[var(--brand-alt)]",
      bg: "bg-[var(--brand-badge)]",
      isString: true,
    },
  ];

  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(gridRef.current!.children, {
        y: 24,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.08,
        clearProps: "transform,opacity",
      });
    }, gridRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-4 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 shadow-[0_1px_2px_var(--shadow-color)] transition-all hover:shadow-[0_4px_16px_var(--shadow-color)]"
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}
          >
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {stat.value}
            </p>
            <p className="truncate text-[11px] text-[var(--text-faint)]">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
