const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!configuredApiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL no está definida");
}

export const API_URL = configuredApiUrl.replace(/\/$/, "");

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function getToken() {
  return typeof window === "undefined" ? null : sessionStorage.getItem("teko_admin_token");
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) sessionStorage.setItem("teko_admin_token", token);
  else sessionStorage.removeItem("teko_admin_token");
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`, {
      ...options,
      headers: {
        ...(options.body && !(options.body instanceof URLSearchParams) ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(0, "No fue posible conectar con la API de TEKO");
  }
  if (response.status === 401 && !path.startsWith("/auth/login")) {
    setToken(null);
    if (typeof window !== "undefined") window.dispatchEvent(new Event("teko:unauthorized"));
  }
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { detail?: string | Array<{ msg: string }> } | null;
    const detail = Array.isArray(body?.detail) ? body.detail.map((item) => item.msg).join(". ") : body?.detail;
    throw new ApiError(response.status, detail || `No fue posible completar la operación (${response.status})`);
  }
  return response.status === 204 ? undefined as T : response.json() as Promise<T>;
}

export async function login(email: string, password: string) {
  setToken(null);
  const body = new URLSearchParams({ username: email, password });
  const result = await api<{ access_token: string }>("/auth/login", { method: "POST", body });
  setToken(result.access_token);
  try {
    return await api<AdminUser>("/auth/me");
  } catch (error) {
    setToken(null);
    throw error;
  }
}

export interface AdminUser { id: number; email: string; full_name: string; role: string; is_active: boolean }
export interface DashboardStats { contact_requests: number; new_requests: number; qualified_requests: number; active_services: number; active_projects: number; active_faqs: number; active_plans: number }
export interface ContactRequest { id: number; name: string; email: string; company: string | null; phone: string | null; service: string | null; budget: string | null; message: string; status: string; created_at: string }
export interface EmailMessage { id: number; direction: "inbound" | "outbound"; from_email: string; to_email: string; subject: string | null; snippet: string; status: string; is_read: boolean; has_attachments: boolean; created_at: string }
export interface EmailMessageDetail extends EmailMessage { cc: string | null; bcc: string | null; reply_to: string | null; text_body: string | null; html_body: string | null; message_id: string | null; provider_id: string | null; error_message: string | null; updated_at: string }
export interface SocialLink { label: string; url: string }
export interface EmailTemplateInput { name: string; logo_url: string | null; header_background: string; accent_color: string; signature: string | null; footer_text: string | null; social_links: SocialLink[]; is_default: boolean }
export interface EmailTemplate extends EmailTemplateInput { id: number; created_at: string; updated_at: string }
export interface Mailbox { id: number; address: string; display_name: string; signature: string | null; is_active: boolean; planner_user_id: string; planner_user_name: string; planner_user_email: string; created_at: string; updated_at: string; total_messages: number; unread_messages: number }
export interface PlannerUser { id: string; name: string; email: string; role: string; job_title: string | null; mailbox_address: string | null }
export type RecordValue = string | number | boolean | null | Array<{ id?: number; text: string; sort_order: number }>;
export type AdminRecord = { id: number; [key: string]: RecordValue };
