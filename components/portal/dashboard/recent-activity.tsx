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
  milestone_completed: { icon: CheckCircle2, color: "text-[var(--accent-green)]" },
  deliverable_uploaded: { icon: Upload, color: "text-[var(--brand)]" },
  meeting_scheduled: { icon: CalendarDays, color: "text-[var(--brand-alt)]" },
  invoice_issued: { icon: Receipt, color: "text-[var(--accent-yellow)]" },
  message_received: { icon: MessageSquare, color: "text-[var(--accent-red)]" },
  project_status_changed: { icon: ArrowRightLeft, color: "text-[var(--brand-alt)]" },
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
    <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5">
      <h3 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">
        Actividad reciente
      </h3>
      <div className="space-y-1">
        {notifications.map((n) => {
          const { icon: Icon, color } = iconMap[n.type];
          return (
            <Link
              key={n.id}
              href={n.actionUrl ?? "/portal"}
              className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--bg-hover)]"
            >
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${color}`} />
              <div className="min-w-0 flex-1">
                <p className={`text-[13px] leading-tight ${n.read ? "text-[var(--text-tertiary)]" : "font-medium text-[var(--text-primary)]"}`}>
                  {n.message}
                </p>
                <p className="mt-0.5 text-[11px] text-[var(--text-faint)]">
                  {timeAgo(n.createdAt)}
                </p>
              </div>
              {!n.read && (
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--brand)]" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
