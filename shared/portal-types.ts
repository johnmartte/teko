// ============================================================
// AUTH
// ============================================================
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  phone?: string;
  avatarUrl?: string;
  role: "client" | "admin";
  createdAt: string; // ISO 8601
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string; // ISO 8601
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

// ============================================================
// PROJECTS
// ============================================================
export type ProjectStatus =
  | "en_progreso"
  | "en_revision"
  | "completado"
  | "pausado"
  | "cancelado";

export type MilestoneStatus = "completado" | "en_progreso" | "pendiente";

export type DeliverableStatus =
  | "entregado"
  | "en_revision"
  | "aprobado"
  | "pendiente";

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  dueDate: string;
  completedAt?: string;
  order: number;
}

export interface Deliverable {
  id: string;
  name: string;
  description?: string;
  fileUrl?: string;
  fileType: string; // "pdf" | "figma" | "zip" | "psd" | "png" etc.
  fileSizeBytes?: number;
  status: DeliverableStatus;
  milestoneId: string;
  uploadedAt?: string;
  approvedAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string; // "Disenador UI/UX", "Desarrollador Frontend", etc.
  avatarUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number; // 0-100
  thumbnailUrl?: string;
  category: string; // "Web App", "Branding", "Mobile App", etc.
  startDate: string;
  estimatedEndDate: string;
  completedAt?: string;
  milestones: Milestone[];
  deliverables: Deliverable[];
  team: TeamMember[];
  clientId: string;
}

// ============================================================
// MEETINGS
// ============================================================
export type MeetingStatus = "programada" | "completada" | "cancelada";

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO 8601
  durationMinutes: number;
  platform: "zoom" | "google_meet" | "teams" | "presencial";
  meetingUrl?: string;
  status: MeetingStatus;
  projectId: string;
  projectName: string;
  attendees: { name: string; role: string; avatarUrl?: string }[];
}

// ============================================================
// INVOICES
// ============================================================
export type InvoiceStatus = "pagada" | "pendiente" | "vencida" | "cancelada";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  projectId: string;
  projectName: string;
  issuedAt: string;
  dueDate: string;
  paidAt?: string;
  amount: number;
  currency: "USD" | "DOP";
  status: InvoiceStatus;
  pdfUrl?: string;
  items: { description: string; quantity: number; unitPrice: number }[];
}

// ============================================================
// NOTIFICATIONS
// ============================================================
export type NotificationType =
  | "milestone_completed"
  | "deliverable_uploaded"
  | "meeting_scheduled"
  | "invoice_issued"
  | "message_received"
  | "project_status_changed";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  projectId?: string;
  actionUrl?: string;
}

// ============================================================
// FILES
// ============================================================
export interface SharedFile {
  id: string;
  name: string;
  fileType: string;
  fileSizeBytes: number;
  url: string;
  projectId: string;
  projectName: string;
  uploadedAt: string;
  uploadedBy: string;
  // Dirección del espejo con el Planner: "cliente" = lo subió el cliente y
  // el equipo lo ve en el Planner; "equipo" = entregable subido por el equipo.
  origin?: "cliente" | "equipo";
}

// ============================================================
// API RESPONSE WRAPPERS
// ============================================================
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================
// DASHBOARD SUMMARY
// ============================================================
export interface DashboardSummary {
  activeProjectsCount: number;
  upcomingMeetingsCount: number;
  pendingDeliverablesCount: number;
  unreadNotificationsCount: number;
  outstandingBalance: number;
  recentActivity: Notification[];
}
