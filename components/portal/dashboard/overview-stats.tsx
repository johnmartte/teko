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
      color: "text-[#0047ff] dark:text-[#7aa3ff]",
      bg: "bg-[#0047ff]/10 dark:bg-[#0047ff]/20",
    },
    {
      label: "Reuniones proximas",
      value: summary.upcomingMeetingsCount,
      icon: CalendarDays,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    },
    {
      label: "Entregables pendientes",
      value: summary.pendingDeliverablesCount,
      icon: FileBox,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10 dark:bg-amber-500/20",
    },
    {
      label: "Notificaciones",
      value: summary.unreadNotificationsCount,
      icon: Bell,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10 dark:bg-rose-500/20",
    },
    {
      label: "Balance pendiente",
      value: formatCurrency(summary.outstandingBalance),
      icon: DollarSign,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-500/10 dark:bg-violet-500/20",
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
          className="flex items-center gap-4 rounded-2xl border border-[#e6eaf2] bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-white/10 dark:bg-[#0f1525]"
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}
          >
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-bold text-[#101828] dark:text-white">
              {stat.value}
            </p>
            <p className="truncate text-[11px] text-[#7a8595] dark:text-white/40">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
