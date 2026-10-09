"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AtSign, Bell, CheckCheck } from "lucide-react";
import { api, type AdminNotification } from "@/lib/admin-api";
import { formatListTime } from "./emails/email-ui";

const POLL_MS = 60_000;

// Avisos compartidos por todos los administradores. Cada admin los marca
// leídos por su cuenta; al tocar uno se abre el módulo al que pertenece.
export function NotificationsBell({ onNavigate, onActivity }: { onNavigate: (module: string) => void; onActivity?: () => void }) {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<AdminNotification[] | null>(null);
  const [error, setError] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const lastUnread = useRef(0);

  const refreshCount = useCallback(() => {
    api<{ unread: number }>("/admin/notifications/unread-count")
      .then((result) => {
        // Llegó algo nuevo: los módulos que dependen de avisos también se refrescan.
        if (result.unread > lastUnread.current) onActivity?.();
        lastUnread.current = result.unread;
        setUnread(result.unread);
      })
      .catch(() => undefined);
  }, [onActivity]);

  useEffect(() => {
    Promise.resolve().then(refreshCount);
    const timer = window.setInterval(refreshCount, POLL_MS);
    return () => window.clearInterval(timer);
  }, [refreshCount]);

  const loadList = useCallback(() => {
    setError("");
    api<AdminNotification[]>("/admin/notifications").then(setItems).catch((e: Error) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!open) return;
    Promise.resolve().then(loadList);
    const onPointer = (event: PointerEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false); };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onPointer); document.removeEventListener("keydown", onKey); };
  }, [open, loadList]);

  const openItem = (item: AdminNotification) => {
    if (!item.is_read) {
      setItems((current) => current?.map((n) => (n.id === item.id ? { ...n, is_read: true } : n)) ?? null);
      setUnread((count) => Math.max(0, count - 1));
      lastUnread.current = Math.max(0, lastUnread.current - 1);
      api(`/admin/notifications/${item.id}/read`, { method: "PATCH" }).catch(() => undefined);
    }
    setOpen(false);
    if (item.module) onNavigate(item.module);
  };

  const readAll = () => {
    setItems((current) => current?.map((n) => ({ ...n, is_read: true })) ?? null);
    setUnread(0);
    lastUnread.current = 0;
    api("/admin/notifications/read-all", { method: "POST" }).catch(() => undefined);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={unread ? `Avisos, ${unread} sin leer` : "Avisos"}
        aria-expanded={open}
        className={`relative grid h-10 w-10 place-items-center rounded-full border transition-colors ${open ? "border-[rgba(30,196,255,0.4)] bg-[rgba(30,196,255,0.08)] text-[#f2f3f5]" : "border-white/[0.08] text-[rgba(242,243,245,0.6)] hover:bg-white/[0.05] hover:text-[#f2f3f5]"}`}
      >
        <Bell size={17} />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#1ec4ff] px-1 text-[10.5px] font-bold tabular-nums text-[#080a0f] ring-2 ring-[#080a0f]">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Avisos"
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-[#0d1017] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] motion-safe:animate-[tk-compose-in_180ms_cubic-bezier(0.23,1,0.32,1)]"
        >
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
            <p className="text-[14px] font-semibold text-[#f2f3f5]">Avisos</p>
            {unread > 0 && (
              <button type="button" onClick={readAll} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[12px] font-medium text-[#1ec4ff] hover:bg-[rgba(30,196,255,0.1)]">
                <CheckCheck size={13} />Marcar todo leído
              </button>
            )}
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {error ? (
              <p className="p-4 text-[13px] text-[#f87171]">{error}</p>
            ) : items === null ? (
              <div className="space-y-2 p-4">{[1, 2, 3].map((key) => <div key={key} className="h-12 animate-pulse rounded-lg bg-white/[0.04]" />)}</div>
            ) : items.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-[14px] font-medium text-[#f2f3f5]">Todo al día</p>
                <p className="mt-1 text-[12.5px] text-[rgba(242,243,245,0.45)]">Aquí verás las solicitudes del equipo.</p>
              </div>
            ) : (
              items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openItem(item)}
                  className="flex w-full items-start gap-3 border-b border-white/[0.04] px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-white/[0.04]"
                >
                  <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ${item.is_read ? "bg-white/[0.05] text-[rgba(242,243,245,0.45)]" : "bg-[rgba(30,196,255,0.14)] text-[#1ec4ff]"}`}>
                    <AtSign size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-[13px] leading-snug ${item.is_read ? "text-[rgba(242,243,245,0.6)]" : "font-medium text-[#f2f3f5]"}`}>{item.title}</span>
                    <span className="mt-0.5 block truncate text-[12px] text-[rgba(242,243,245,0.4)]">
                      {item.body ? `${item.body} · ` : ""}{formatListTime(item.created_at)}
                    </span>
                  </span>
                  {!item.is_read && <span aria-label="Sin leer" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#1ec4ff]" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
