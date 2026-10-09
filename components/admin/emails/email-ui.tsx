"use client";

import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";

export type Folder = "inbound" | "outbound" | "templates";

export function parseAddress(raw: string) {
  const match = raw.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
  if (match && match[1].trim()) return { name: match[1].trim(), email: match[2].trim() };
  const email = (match ? match[2] : raw).trim();
  return { name: "", email };
}

export function displayName(raw: string) {
  const { name, email } = parseAddress(raw);
  return name || email;
}

export function recipientsLabel(raw: string) {
  const list = raw.split(",").map((item) => item.trim()).filter(Boolean);
  if (list.length === 0) return "Sin destinatario";
  const first = displayName(list[0]);
  return list.length > 1 ? `${first} +${list.length - 1}` : first;
}

export function initials(label: string) {
  const clean = label.replace(/@.*/, "").replace(/[^\p{L}\s]/gu, " ").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function formatListTime(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  if (startOfDay(date) === startOfDay(now)) return date.toLocaleTimeString("es-DO", { hour: "numeric", minute: "2-digit", hour12: true });
  if (date.getFullYear() === now.getFullYear()) return date.toLocaleDateString("es-DO", { day: "numeric", month: "short" });
  return date.toLocaleDateString("es-DO", { day: "numeric", month: "short", year: "numeric" });
}

export function formatFullDate(iso: string) {
  return new Date(iso).toLocaleString("es-DO", { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
}

export function dateGroup(iso: string) {
  const days = Math.round((startOfDay(new Date()) - startOfDay(new Date(iso))) / 86_400_000);
  if (days <= 0) return "Hoy";
  if (days === 1) return "Ayer";
  if (days < 7) return "Esta semana";
  if (days < 31) return "Este mes";
  return "Anteriores";
}

const statusMap: Record<string, { label: string; color: string }> = {
  received: { label: "Recibido", color: "rgba(242,243,245,0.4)" },
  queued: { label: "En cola", color: "rgba(242,243,245,0.4)" },
  sent: { label: "Enviado", color: "rgba(242,243,245,0.4)" },
  delivery_delayed: { label: "Demorado", color: "#fbbf24" },
  delivered: { label: "Entregado", color: "#4ade80" },
  opened: { label: "Abierto", color: "#1ec4ff" },
  clicked: { label: "Abrió un enlace", color: "#1ec4ff" },
  bounced: { label: "Rebotado", color: "#f87171" },
  complained: { label: "Marcado como spam", color: "#f87171" },
  failed: { label: "No se envió", color: "#f87171" },
};

export function statusMeta(status: string) {
  return statusMap[status] ?? { label: status, color: "rgba(242,243,245,0.4)" };
}

export function isTypingTarget(target: EventTarget | null) {
  const element = target as HTMLElement | null;
  if (!element) return false;
  return element.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName);
}

export const EMAIL_PATTERN = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]{2,}$/;

export function Avatar({ label, size = 36, highlight = false }: { label: string; size?: number; highlight?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="grid shrink-0 place-items-center rounded-full font-semibold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: highlight ? "rgba(30,196,255,0.14)" : "rgba(255,255,255,0.06)",
        color: highlight ? "#bfe9ff" : "rgba(242,243,245,0.78)",
      }}
    >
      {initials(label)}
    </span>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="hidden rounded-[5px] border sm:inline border-white/10 px-1.5 py-px font-sans text-[10.5px] font-medium leading-4 text-[rgba(242,243,245,0.55)]">
      {children}
    </kbd>
  );
}

export function Serif({ children }: { children: ReactNode }) {
  return <em className="font-normal not-italic" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif", fontStyle: "italic", color: "#bfe9ff" }}>{children}</em>;
}

function withBaseTarget(html: string) {
  const base = '<base target="_blank">';
  if (/<head[^>]*>/i.test(html)) return html.replace(/<head[^>]*>/i, (tag) => tag + base);
  return `<head>${base}</head>${html}`;
}

// Sin allow-scripts el HTML del correo no ejecuta código; allow-same-origin solo deja medir su alto.
const FRAME_SANDBOX = "allow-same-origin allow-popups allow-popups-to-escape-sandbox";

export function EmailFrame({ html, title, autoSize = true, minHeight = 220 }: { html: string; title: string; autoSize?: boolean; minHeight?: number }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(minHeight);
  const frameDoc = useMemo(() => withBaseTarget(html), [html]);

  const measure = useCallback(() => {
    const doc = ref.current?.contentDocument;
    if (!doc?.documentElement) return;
    setHeight(Math.max(minHeight, doc.documentElement.scrollHeight, doc.body?.scrollHeight ?? 0));
  }, [minHeight]);

  const handleLoad = () => {
    if (!autoSize) return;
    measure();
    ref.current?.contentDocument?.querySelectorAll("img").forEach((image) => image.addEventListener("load", measure, { once: true }));
    window.setTimeout(measure, 700);
  };

  return (
    <iframe
      ref={ref}
      title={title}
      sandbox={FRAME_SANDBOX}
      srcDoc={frameDoc}
      onLoad={handleLoad}
      className="block w-full rounded-xl bg-white"
      style={autoSize ? { height } : { height: "100%" }}
    />
  );
}
