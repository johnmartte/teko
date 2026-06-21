"use client";

import { Download, FileText, Pen, Archive, Image as ImageIcon } from "lucide-react";
import type { Deliverable } from "@/shared/portal-types";
import { formatFileSize } from "@/Data/portal/mock-helpers";

const fileIcons: Record<string, typeof FileText> = {
  pdf: FileText,
  figma: Pen,
  zip: Archive,
  psd: ImageIcon,
  png: ImageIcon,
};

const statusConfig: Record<string, { label: string; classes: string }> = {
  aprobado: { label: "Aprobado", classes: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  entregado: { label: "Entregado", classes: "bg-[#0047ff]/10 text-[#0047ff] dark:text-[#7aa3ff]" },
  en_revision: { label: "En Revision", classes: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  pendiente: { label: "Pendiente", classes: "bg-gray-500/10 text-gray-500" },
};

export default function DeliverableList({ deliverables }: { deliverables: Deliverable[] }) {
  return (
    <div className="space-y-2">
      {deliverables.map((d) => {
        const Icon = fileIcons[d.fileType] ?? FileText;
        const status = statusConfig[d.status];
        return (
          <div
            key={d.id}
            className="flex items-center gap-3 rounded-xl border border-[#e6eaf2] bg-white px-4 py-3 dark:border-white/10 dark:bg-[#0f1525]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f4f7ff] dark:bg-white/5">
              <Icon className="h-4 w-4 text-[#7a8595] dark:text-white/40" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-[#101828] dark:text-white">
                {d.name}
              </p>
              <p className="text-[11px] text-[#99a1af] dark:text-white/30">
                {formatFileSize(d.fileSizeBytes ?? 0)}
                {d.uploadedAt &&
                  ` · ${new Date(d.uploadedAt).toLocaleDateString("es-DO", { month: "short", day: "numeric" })}`}
              </p>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${status.classes}`}>
              {status.label}
            </span>
            <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#7a8595] transition-colors hover:bg-[#f4f7ff] dark:text-white/40 dark:hover:bg-white/5">
              <Download className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
