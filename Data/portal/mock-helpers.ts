import {
  mockProjects,
  mockMeetings,
  mockFiles,
  mockNotifications,
  mockInvoices,
} from "./mock-data";

export function getProjectById(id: string) {
  return mockProjects.find((p) => p.id === id) ?? null;
}

export function getMeetingsForProject(projectId: string) {
  return mockMeetings.filter((m) => m.projectId === projectId);
}

export function getDeliverablesForProject(projectId: string) {
  const project = getProjectById(projectId);
  return project?.deliverables ?? [];
}

export function getFilesForProject(projectId: string) {
  return mockFiles.filter((f) => f.projectId === projectId);
}

export function getInvoicesForProject(projectId: string) {
  return mockInvoices.filter((i) => i.projectId === projectId);
}

export function getUnreadNotificationsCount() {
  return mockNotifications.filter((n) => !n.read).length;
}

export function getUpcomingMeetings() {
  return mockMeetings
    .filter((m) => m.status === "programada")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getPastMeetings() {
  return mockMeetings
    .filter((m) => m.status !== "programada")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Formatea bytes a string legible (KB, MB, GB) */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

/** Formatea moneda */
export function formatCurrency(amount: number, currency: "USD" | "DOP" = "USD"): string {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}
