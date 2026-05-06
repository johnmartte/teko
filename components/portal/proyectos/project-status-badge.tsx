import type { ProjectStatus } from "@/shared/portal-types";

const config: Record<ProjectStatus, { label: string; classes: string }> = {
  en_progreso: {
    label: "En Progreso",
    classes: "bg-[#0047ff]/10 text-[#0047ff] dark:bg-[#0047ff]/20 dark:text-[#7aa3ff]",
  },
  en_revision: {
    label: "En Revision",
    classes: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  },
  completado: {
    label: "Completado",
    classes: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
  },
  pausado: {
    label: "Pausado",
    classes: "bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400",
  },
  cancelado: {
    label: "Cancelado",
    classes: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
  },
};

export default function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const { label, classes } = config[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${classes}`}
    >
      {label}
    </span>
  );
}
