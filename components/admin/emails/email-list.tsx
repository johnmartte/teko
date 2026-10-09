"use client";

import { useMemo, type ReactNode, type RefObject } from "react";
import { Inbox, Paperclip, RefreshCw, Search, Send } from "lucide-react";
import type { EmailMessage } from "@/lib/admin-api";
import { Avatar, Kbd, Serif, dateGroup, displayName, formatListTime, recipientsLabel, statusMeta } from "./email-ui";

function groupByDate(items: EmailMessage[]) {
  const groups: Array<{ label: string; items: EmailMessage[] }> = [];
  for (const item of items) {
    const label = dateGroup(item.created_at);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(item);
    else groups.push({ label, items: [item] });
  }
  return groups;
}

function Row({ item, selected, onSelect }: { item: EmailMessage; selected: boolean; onSelect: () => void }) {
  const inbound = item.direction === "inbound";
  const unread = inbound && !item.is_read;
  const who = inbound ? displayName(item.from_email) : recipientsLabel(item.to_email);
  const status = statusMeta(item.status);
  const failed = ["bounced", "complained", "failed"].includes(item.status);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected ? "true" : undefined}
      className={`group relative flex w-full gap-3 rounded-xl px-3 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[#1ec4ff] ${selected ? "bg-[rgba(30,196,255,0.09)]" : "hover:bg-white/[0.035]"}`}
    >
      <Avatar label={who} size={34} highlight={unread} />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2">
          {unread && <span aria-label="No leído" className="h-1.5 w-1.5 shrink-0 -translate-y-0.5 rounded-full bg-[#1ec4ff]" />}
          <span className={`min-w-0 flex-1 truncate text-[14px] ${unread ? "font-semibold text-[#f2f3f5]" : "font-medium text-[rgba(242,243,245,0.82)]"}`}>
            {inbound ? who : <><span className="font-normal text-[rgba(242,243,245,0.45)]">Para </span>{who}</>}
          </span>
          <time dateTime={item.created_at} className={`shrink-0 text-[12px] tabular-nums ${unread ? "text-[#f2f3f5]" : "text-[rgba(242,243,245,0.4)]"}`}>
            {formatListTime(item.created_at)}
          </time>
        </span>
        <span className="mt-0.5 flex items-center gap-1.5">
          <span className={`min-w-0 flex-1 truncate text-[13px] ${unread ? "font-medium text-[#f2f3f5]" : "text-[rgba(242,243,245,0.68)]"}`}>{item.subject || "(sin asunto)"}</span>
          {item.has_attachments && <Paperclip size={12} className="shrink-0 text-[rgba(242,243,245,0.4)]" />}
        </span>
        <span className="mt-0.5 flex items-center gap-2">
          <span className="min-w-0 flex-1 truncate text-[12.5px] text-[rgba(242,243,245,0.4)]">{item.snippet || "Sin vista previa"}</span>
          {!inbound && (
            <span className="inline-flex shrink-0 items-center gap-1 text-[11.5px] font-medium" style={{ color: failed ? "#f87171" : "rgba(242,243,245,0.45)" }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: status.color }} />
              {status.label}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}

export function EmailList({ folder, items, selectedId, onSelect, loading, refreshing, search, onSearch, onRefresh, searchRef, folderTabs, hasMore, onLoadMore }: {
  folder: "inbound" | "outbound";
  items: EmailMessage[];
  selectedId: number | null;
  onSelect: (item: EmailMessage) => void;
  loading: boolean;
  refreshing: boolean;
  search: string;
  onSearch: (value: string) => void;
  onRefresh: () => void;
  searchRef: RefObject<HTMLInputElement | null>;
  folderTabs: ReactNode;
  hasMore: boolean;
  onLoadMore: () => void;
}) {
  const groups = useMemo(() => groupByDate(items), [items]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 space-y-3 border-b border-white/[0.06] p-3">
        {folderTabs}
        <div className="flex items-center gap-2">
          <label className="flex h-9 flex-1 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 focus-within:border-[rgba(30,196,255,0.5)]">
            <Search size={15} className="shrink-0 text-[rgba(242,243,245,0.35)]" />
            <input
              ref={searchRef}
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder={folder === "inbound" ? "Buscar en recibidos" : "Buscar en enviados"}
              aria-label="Buscar correos"
              className="min-w-0 flex-1 bg-transparent text-[13.5px] text-[#f2f3f5] outline-none placeholder:text-[rgba(242,243,245,0.35)]"
            />
            {!search && <Kbd>/</Kbd>}
          </label>
          <button type="button" onClick={onRefresh} aria-label="Actualizar" title="Actualizar" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[rgba(242,243,245,0.55)] hover:bg-white/[0.06] hover:text-[#f2f3f5]">
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {loading ? (
          <div className="space-y-1 pt-3" aria-label="Cargando correos">
            {Array.from({ length: 7 }, (_, index) => (
              <div key={index} className="flex gap-3 px-3 py-3">
                <div className="h-[34px] w-[34px] shrink-0 animate-pulse rounded-full bg-white/[0.06]" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 w-2/5 animate-pulse rounded bg-white/[0.07]" />
                  <div className="h-2.5 w-4/5 animate-pulse rounded bg-white/[0.05]" />
                </div>
              </div>
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="flex flex-col items-center px-6 pt-20 text-center">
            {folder === "inbound" ? <Inbox size={22} className="text-[rgba(242,243,245,0.3)]" /> : <Send size={22} className="text-[rgba(242,243,245,0.3)]" />}
            <p className="mt-4 text-[17px] font-semibold tracking-[-0.01em] text-[#f2f3f5]">
              {search ? <>Sin <Serif>resultados</Serif></> : folder === "inbound" ? <>Bandeja <Serif>al día</Serif></> : <>Nada <Serif>enviado</Serif> todavía</>}
            </p>
            <p className="mt-1.5 max-w-[30ch] text-[13px] leading-relaxed text-[rgba(242,243,245,0.45)]">
              {search ? "Prueba con otro nombre, correo o asunto." : folder === "inbound" ? "Los correos que lleguen a tu dominio aparecerán aquí." : "Lo que envíes desde el panel queda guardado en esta carpeta."}
            </p>
          </div>
        ) : (
          <>
            {groups.map((group) => (
              <section key={group.label} aria-label={group.label}>
                <h3 className="sticky top-0 z-10 bg-[#0a0d13] px-3 pb-1.5 pt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[rgba(242,243,245,0.4)]">
                  {group.label}
                </h3>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <Row key={item.id} item={item} selected={item.id === selectedId} onSelect={() => onSelect(item)} />
                  ))}
                </div>
              </section>
            ))}
            {hasMore && !search && (
              <button type="button" onClick={onLoadMore} className="mx-auto mt-3 block rounded-lg px-4 py-2 text-[13px] text-[rgba(242,243,245,0.6)] hover:bg-white/[0.05] hover:text-[#f2f3f5]">
                Cargar correos anteriores
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
