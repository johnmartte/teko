"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Upload,
  CalendarDays,
  Receipt,
  MessageSquare,
  ArrowRightLeft,
} from "lucide-react";
import type { Notification, NotificationType } from "@/shared/portal-types";

const iconMap: Record<NotificationType, { icon: typeof CheckCircle2; color: string }> = {
  milestone_completed: { icon: CheckCircle2, color: "text-emerald-500" },
  deliverable_uploaded: { icon: Upload, color: "text-[#0047ff] dark:text-[#7aa3ff]" },
  meeting_scheduled: { icon: CalendarDays, color: "text-violet-500" },
  invoice_issued: { icon: Receipt, color: "text-amber-500" },
  message_received: { icon: MessageSquare, color: "text-rose-500" },
  project_status_changed: { icon: ArrowRightLeft, color: "text-cyan-500" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `hace ${days}d`;
  return new Date(dateStr).toLocaleDateString("es-DO", { month: "short", day: "numeric" });
}

interface RecentActivityProps {
  notifications: Notification[];
}

export default function RecentActivity({ notifications }: RecentActivityProps) {
  return (
    <div className="rounded-2xl border border-[#e6eaf2] bg-white p-5 dark:border-white/10 dark:bg-[#0f1525]">
      <h3 className="mb-4 text-sm font-semibold text-[#101828] dark:text-white">
        Actividad reciente
      </h3>
      <div className="space-y-1">
        {notifications.map((n) => {
          const { icon: Icon, color } = iconMap[n.type];
          return (
            <Link
              key={n.id}
              href={n.actionUrl ?? "/portal"}
              className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[#f4f7ff] dark:hover:bg-white/5"
            >
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${color}`} />
              <div className="min-w-0 flex-1">
                <p className={`text-[13px] leading-tight ${n.read ? "text-[#52607a] dark:text-white/50" : "font-medium text-[#101828] dark:text-white"}`}>
                  {n.message}
                </p>
                <p className="mt-0.5 text-[11px] text-[#99a1af] dark:text-white/30">
                  {timeAgo(n.createdAt)}
                </p>
              </div>
              {!n.read && (
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#0047ff]" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
