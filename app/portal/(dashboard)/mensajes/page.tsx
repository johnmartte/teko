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
import { mockNotifications } from "@/Data/portal/mock-data";
import type { NotificationType } from "@/shared/portal-types";

const iconMap: Record<NotificationType, { icon: typeof CheckCircle2; color: string }> = {
  milestone_completed: { icon: CheckCircle2, color: "text-emerald-500" },
  deliverable_uploaded: { icon: Upload, color: "text-[#0047ff] dark:text-[#7aa3ff]" },
  meeting_scheduled: { icon: CalendarDays, color: "text-violet-500" },
  invoice_issued: { icon: Receipt, color: "text-amber-500" },
  message_received: { icon: MessageSquare, color: "text-rose-500" },
  project_status_changed: { icon: ArrowRightLeft, color: "text-cyan-500" },
};

export default function MensajesPage() {
  const unread = mockNotifications.filter((n) => !n.read);
  const read = mockNotifications.filter((n) => n.read);

  const NotifItem = ({ n }: { n: (typeof mockNotifications)[0] }) => {
    const { icon: Icon, color } = iconMap[n.type];
    return (
      <Link
        href={n.actionUrl ?? "/portal"}
        className="flex items-start gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-[#f4f7ff] dark:hover:bg-white/5"
      >
        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${n.read ? "bg-gray-100 dark:bg-white/5" : "bg-[#0047ff]/10 dark:bg-[#0047ff]/20"}`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-[13px] leading-tight ${n.read ? "text-[#52607a] dark:text-white/50" : "font-medium text-[#101828] dark:text-white"}`}>
            {n.title}
          </p>
          <p className="mt-0.5 text-[12px] text-[#7a8595] dark:text-white/40">
            {n.message}
          </p>
          <p className="mt-1 text-[11px] text-[#99a1af] dark:text-white/25">
            {new Date(n.createdAt).toLocaleDateString("es-DO", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#0047ff]" />}
      </Link>
    );
  };

  return (
    <div className="mx-auto max-w-[700px] space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#101828] dark:text-white">Mensajes</h1>
        <p className="mt-1 text-sm text-[#7a8595] dark:text-white/40">
          Notificaciones y actividad de tus proyectos.
        </p>
      </div>

      {unread.length > 0 && (
        <div className="rounded-2xl border border-[#e6eaf2] bg-white dark:border-white/10 dark:bg-[#0f1525]">
          <div className="border-b border-[#e6eaf2] px-5 py-3 dark:border-white/10">
            <h2 className="text-[12px] font-semibold uppercase tracking-wider text-[#0047ff] dark:text-[#7aa3ff]">
              No leidas ({unread.length})
            </h2>
          </div>
          <div className="divide-y divide-[#e6eaf2] dark:divide-white/10">
            {unread.map((n) => <NotifItem key={n.id} n={n} />)}
          </div>
        </div>
      )}

      {read.length > 0 && (
        <div className="rounded-2xl border border-[#e6eaf2] bg-white dark:border-white/10 dark:bg-[#0f1525]">
          <div className="border-b border-[#e6eaf2] px-5 py-3 dark:border-white/10">
            <h2 className="text-[12px] font-semibold uppercase tracking-wider text-[#7a8595] dark:text-white/40">
              Anteriores
            </h2>
          </div>
          <div className="divide-y divide-[#e6eaf2] dark:divide-white/10">
            {read.map((n) => <NotifItem key={n.id} n={n} />)}
          </div>
        </div>
      )}
    </div>
  );
}
