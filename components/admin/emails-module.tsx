"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Inbox, LayoutTemplate, Mail, PenSquare, Send } from "lucide-react";
import { api, type EmailMessage, type EmailMessageDetail, type EmailTemplate } from "@/lib/admin-api";
import { EmailComposer, draftHasContent, emptyDraft, type ComposeDraft } from "./emails/email-composer";
import { EmailList } from "./emails/email-list";
import { EmailReader, ReplyPrompt } from "./emails/email-reader";
import { TemplateEditor, TemplateList } from "./emails/email-templates";
import { Kbd, Serif, displayName, formatFullDate, isTypingTarget, parseAddress, type Folder } from "./emails/email-ui";

const PAGE_SIZE = 100;
const POLL_MS = 30_000;

type Toast = { id: number; message: string; action?: { label: string; run: () => void } };

const folders: Array<{ key: Folder; label: string; icon: typeof Inbox }> = [
  { key: "inbound", label: "Recibidos", icon: Inbox },
  { key: "outbound", label: "Enviados", icon: Send },
  { key: "templates", label: "Plantillas", icon: LayoutTemplate },
];

function htmlToText(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("style,script,head").forEach((node) => node.remove());
  return (doc.body.textContent ?? "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

function prefixSubject(prefix: "Re" | "Fwd", subject: string | null) {
  const clean = subject?.trim() || "(sin asunto)";
  return new RegExp(`^${prefix}:`, "i").test(clean) ? clean : `${prefix}: ${clean}`;
}

export function EmailsModule({ onUnreadChange }: { onUnreadChange?: () => void }) {
  const [folder, setFolder] = useState<Folder>("inbound");
  const [items, setItems] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<EmailMessageDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [view, setView] = useState<"reader" | "composer">("reader");
  const [draft, setDraft] = useState<ComposeDraft | null>(null);
  const [inlineOpen, setInlineOpen] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<number | "new" | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const openRequest = useRef(0);

  const notify = useCallback((message: string, action?: Toast["action"]) => setToast({ id: Date.now(), message, action }), []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), toast.action ? 6000 : 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const loadList = useCallback(async (mode: "initial" | "silent" | "more" = "initial", count = PAGE_SIZE) => {
    if (folder === "templates") return;
    if (mode === "silent") setRefreshing(true);
    try {
      const offset = mode === "more" ? count : 0;
      const limit = mode === "silent" ? Math.min(Math.max(count, PAGE_SIZE), 200) : PAGE_SIZE;
      const page = await api<EmailMessage[]>(`/admin/emails?direction=${folder}&limit=${limit}&offset=${offset}`);
      setItems((current) => (mode === "more" ? [...current, ...page] : page));
      setHasMore(page.length === limit);
    } catch (e) {
      notify((e as Error).message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [folder, notify]);

  const loadTemplates = useCallback(async () => {
    try {
      setTemplates(await api<EmailTemplate[]>("/admin/email-templates"));
    } catch (e) {
      notify((e as Error).message);
    } finally {
      setTemplatesLoading(false);
    }
  }, [notify]);

  useEffect(() => { Promise.resolve().then(() => loadList()); }, [loadList]);
  useEffect(() => { Promise.resolve().then(loadTemplates); }, [loadTemplates]);

  const itemCount = items.length;
  useEffect(() => {
    if (folder === "templates") return;
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      loadList("silent", itemCount);
      onUnreadChange?.();
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [folder, itemCount, loadList, onUnreadChange]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => `${item.from_email} ${item.to_email} ${item.subject ?? ""} ${item.snippet}`.toLowerCase().includes(term));
  }, [items, search]);

  const unread = useMemo(() => items.filter((item) => item.direction === "inbound" && !item.is_read).length, [items]);
  const defaultTemplate = templates.find((template) => template.is_default) ?? null;

  const changeFolder = (next: Folder) => {
    if (next === folder) return;
    setFolder(next);
    setSearch("");
    setSelectedId(null);
    setDetail(null);
    setView("reader");
    setSelectedTemplate(null);
    if (next !== "templates") { setItems([]); setLoading(true); }
  };

  const openEmail = async (item: EmailMessage) => {
    const request = ++openRequest.current;
    setSelectedId(item.id);
    setView("reader");
    setInlineOpen(false);
    setDetailLoading(true);
    try {
      const loaded = await api<EmailMessageDetail>(`/admin/emails/${item.id}`);
      if (request !== openRequest.current) return;
      setDetail(loaded);
      if (item.direction === "inbound" && !item.is_read) {
        await api(`/admin/emails/${item.id}/read`, { method: "PATCH", body: JSON.stringify({ is_read: true }) });
        setItems((current) => current.map((row) => (row.id === item.id ? { ...row, is_read: true } : row)));
        onUnreadChange?.();
      }
    } catch (e) {
      notify((e as Error).message);
    } finally {
      if (request === openRequest.current) setDetailLoading(false);
    }
  };

  const replaceDraft = (next: ComposeDraft) => {
    const previous = draft;
    setDraft(next);
    if (previous && draftHasContent(previous) && previous.replyToId !== next.replyToId) {
      notify("Se reemplazó el borrador anterior.", { label: "Deshacer", run: () => setDraft(previous) });
    }
  };

  const startCompose = () => {
    if (folder === "templates") changeFolder("inbound");
    if (draft && draft.mode !== "reply") { setView("composer"); return; }
    replaceDraft(emptyDraft(templates));
    setView("composer");
  };

  const startReply = (email: EmailMessageDetail) => {
    if (!(draft && draft.mode === "reply" && draft.replyToId === email.id)) {
      replaceDraft(emptyDraft(templates, {
        mode: "reply",
        to: [parseAddress(email.reply_to || email.from_email).email],
        subject: prefixSubject("Re", email.subject),
        replyToId: email.id,
      }));
    }
    setInlineOpen(true);
  };

  const startForward = (email: EmailMessageDetail) => {
    const original = email.text_body || (email.html_body ? htmlToText(email.html_body) : "");
    const header = [
      "---------- Mensaje reenviado ----------",
      `De: ${email.from_email}`,
      `Fecha: ${formatFullDate(email.created_at)}`,
      `Asunto: ${email.subject ?? ""}`,
      `Para: ${email.to_email}`,
    ].join("\n");
    replaceDraft(emptyDraft(templates, { mode: "forward", subject: prefixSubject("Fwd", email.subject), body: `\n\n${header}\n\n${original}` }));
    setView("composer");
  };

  const markUnread = async (email: EmailMessageDetail) => {
    try {
      await api(`/admin/emails/${email.id}/read`, { method: "PATCH", body: JSON.stringify({ is_read: false }) });
      setItems((current) => current.map((row) => (row.id === email.id ? { ...row, is_read: false } : row)));
      setSelectedId(null);
      setDetail(null);
      onUnreadChange?.();
      notify("Marcado como no leído.");
    } catch (e) {
      notify((e as Error).message);
    }
  };

  const discardDraft = () => {
    const previous = draft;
    setDraft(null);
    setInlineOpen(false);
    if (view === "composer") setView("reader");
    if (previous && draftHasContent(previous)) notify("Borrador descartado.", { label: "Deshacer", run: () => setDraft(previous) });
  };

  const handleSent = (sent: EmailMessageDetail) => {
    const wasReply = draft?.mode === "reply";
    setDraft(null);
    setInlineOpen(false);
    if (wasReply) {
      notify("Respuesta enviada.");
      if (folder === "outbound") loadList("silent", itemCount);
      return;
    }
    notify("Correo enviado.");
    setView("reader");
    setSearch("");
    setSelectedId(sent.id);
    setDetail(sent);
    if (folder === "outbound") loadList("silent", itemCount);
    else { setFolder("outbound"); setItems([]); setLoading(true); }
  };

  const copy = (value: string) => {
    navigator.clipboard.writeText(value).then(() => notify(`Copiado: ${value}`)).catch(() => notify("No se pudo copiar."));
  };

  const step = (direction: 1 | -1) => {
    if (folder === "templates" || filtered.length === 0) return;
    const index = filtered.findIndex((item) => item.id === selectedId);
    const next = filtered[index === -1 ? 0 : Math.min(filtered.length - 1, Math.max(0, index + direction))];
    if (next && next.id !== selectedId) openEmail(next);
  };

  const shortcuts = useRef<(event: KeyboardEvent) => void>(() => undefined);
  useEffect(() => {
    shortcuts.current = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;
      const key = event.key.toLowerCase();
      if (key === "c") { event.preventDefault(); startCompose(); }
      else if (key === "/") { event.preventDefault(); searchRef.current?.focus(); }
      else if (key === "j" || event.key === "ArrowDown") { event.preventDefault(); step(1); }
      else if (key === "k" || event.key === "ArrowUp") { event.preventDefault(); step(-1); }
      else if (key === "r" && detail?.direction === "inbound" && view === "reader") { event.preventDefault(); startReply(detail); }
      else if (key === "f" && detail && view === "reader") { event.preventDefault(); startForward(detail); }
      else if (key === "u" && detail?.direction === "inbound" && view === "reader") { event.preventDefault(); markUnread(detail); }
      else if (event.key === "Escape" && view === "reader" && selectedId !== null) { setSelectedId(null); setDetail(null); }
    };
  });
  useEffect(() => {
    const listener = (event: KeyboardEvent) => shortcuts.current(event);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  const detailOpen = folder === "templates" ? selectedTemplate !== null : view === "composer" || selectedId !== null;
  const canContinueDraft = Boolean(draft && draft.mode !== "reply" && draftHasContent(draft));

  const folderTabs = (
    <div className="flex items-center gap-2 xl:hidden">
      <div role="tablist" aria-label="Carpetas" className="flex flex-1 rounded-lg bg-white/[0.04] p-0.5">
        {folders.map((item) => (
          <button key={item.key} role="tab" aria-selected={folder === item.key} type="button" onClick={() => changeFolder(item.key)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-[12.5px] font-medium transition-colors ${folder === item.key ? "bg-white/[0.09] text-[#f2f3f5]" : "text-[rgba(242,243,245,0.55)]"}`}>
            {item.label}
            {item.key === "inbound" && unread > 0 && <span className="text-[11px] text-[#1ec4ff]">{unread}</span>}
          </button>
        ))}
      </div>
      <button type="button" onClick={startCompose} aria-label="Redactar" title="Redactar (C)" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#1ec4ff] text-[#080a0f]">
        <PenSquare size={15} />
      </button>
    </div>
  );

  const replyTarget = detail && detail.direction === "inbound" ? detail : null;
  const replyDraft = draft && draft.mode === "reply" && replyTarget && draft.replyToId === replyTarget.id ? draft : null;

  let rightPane;
  if (folder === "templates") {
    rightPane = selectedTemplate === null ? (
      <EmptyPane title={<>Tu marca en <Serif>cada</Serif> correo</>} hint="Elige una plantilla para editarla o crea una nueva. La predeterminada se aplica sola al redactar." />
    ) : (
      <TemplateEditor
        key={selectedTemplate}
        template={selectedTemplate === "new" ? null : templates.find((item) => item.id === selectedTemplate) ?? null}
        onBack={() => setSelectedTemplate(null)}
        onSaved={(saved) => { loadTemplates(); setSelectedTemplate(saved.id); notify("Plantilla guardada."); }}
        onDeleted={() => { loadTemplates(); setSelectedTemplate(null); notify("Plantilla eliminada."); }}
      />
    );
  } else if (view === "composer" && draft) {
    rightPane = (
      <EmailComposer draft={draft} onChange={setDraft} templates={templates} onClose={() => setView("reader")} onDiscard={discardDraft} onSent={handleSent} />
    );
  } else if (selectedId !== null && (detailLoading || !detail)) {
    rightPane = <ReaderSkeleton />;
  } else if (detail) {
    rightPane = (
      <EmailReader
        email={detail}
        onBack={() => { setSelectedId(null); setDetail(null); }}
        onReply={() => startReply(detail)}
        onForward={() => startForward(detail)}
        onMarkUnread={() => markUnread(detail)}
        onCopy={copy}
        replySlot={replyTarget ? (
          replyDraft && inlineOpen ? (
            <EmailComposer variant="inline" draft={replyDraft} onChange={setDraft} templates={templates} onClose={() => setInlineOpen(false)} onDiscard={discardDraft} onSent={handleSent} />
          ) : (
            <ReplyPrompt name={replyDraft ? "tu borrador" : displayName(replyTarget.from_email)} onClick={() => startReply(replyTarget)} />
          )
        ) : null}
      />
    );
  } else {
    rightPane = (
      <EmptyPane
        title={folder === "inbound" ? <>Elige un <Serif>correo</Serif></> : <>Revisa lo que <Serif>enviaste</Serif></>}
        hint={<span className="inline-flex flex-wrap items-center justify-center gap-1.5"><Kbd>J</Kbd><Kbd>K</Kbd> para moverte · <Kbd>C</Kbd> para redactar · <Kbd>/</Kbd> para buscar</span>}
      />
    );
  }

  return (
    <section aria-label="Correos" className="relative flex h-[calc(100dvh-7rem)] min-h-[540px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0d13] text-[#f2f3f5] lg:h-[calc(100dvh-9rem)]">
      <aside className="hidden w-[212px] shrink-0 flex-col border-r border-white/[0.06] p-3 xl:flex">
        <p className="px-2 pb-4 pt-1 text-[15px] font-semibold tracking-[-0.01em]">Correos</p>
        <button type="button" onClick={startCompose} className="flex h-10 items-center gap-2 rounded-xl bg-[#1ec4ff] px-3.5 text-[13.5px] font-semibold text-[#080a0f] transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1ec4ff]">
          <PenSquare size={16} />
          <span className="flex-1 text-left">{canContinueDraft ? "Ver borrador" : "Redactar"}</span>
          <span className="rounded-[5px] bg-[#080a0f]/15 px-1.5 text-[10.5px] font-semibold">C</span>
        </button>
        <nav aria-label="Carpetas" className="mt-5 space-y-0.5">
          {folders.map((item) => (
            <button key={item.key} type="button" onClick={() => changeFolder(item.key)} aria-current={folder === item.key ? "page" : undefined}
              className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition-colors ${folder === item.key ? "bg-[rgba(30,196,255,0.1)] text-[#1ec4ff]" : "text-[rgba(242,243,245,0.65)] hover:bg-white/[0.04] hover:text-[#f2f3f5]"}`}>
              <item.icon size={16} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.key === "inbound" && unread > 0 && <span className="text-[12px] font-semibold tabular-nums">{unread}</span>}
            </button>
          ))}
        </nav>
        <button type="button" onClick={() => changeFolder("templates")} className="mt-auto rounded-xl border border-white/[0.06] p-3 text-left transition-colors hover:border-white/[0.12]">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[rgba(242,243,245,0.4)]">Plantilla activa</span>
          <span className="mt-1.5 flex items-center gap-2 text-[13px] text-[rgba(242,243,245,0.8)]">
            <span aria-hidden="true" className="h-3 w-3 rounded-[4px] border border-white/15" style={{ background: defaultTemplate?.header_background ?? "transparent" }} />
            {defaultTemplate?.name ?? "Ninguna"}
          </span>
        </button>
      </aside>

      <div className={`${detailOpen ? "hidden lg:flex" : "flex"} w-full shrink-0 flex-col border-r border-white/[0.06] ${folder === "templates" ? "lg:w-[260px] 2xl:w-[290px]" : "lg:w-[320px] 2xl:w-[360px]"}`}>
        {folder === "templates" ? (
          <TemplateList templates={templates} selectedId={selectedTemplate} loading={templatesLoading} folderTabs={folderTabs}
            onSelect={(template) => setSelectedTemplate(template.id)} onCreate={() => setSelectedTemplate("new")} />
        ) : (
          <EmailList
            folder={folder}
            items={filtered}
            selectedId={view === "reader" ? selectedId : null}
            onSelect={openEmail}
            loading={loading}
            refreshing={refreshing}
            search={search}
            onSearch={setSearch}
            onRefresh={() => { loadList("silent", itemCount); onUnreadChange?.(); }}
            searchRef={searchRef}
            folderTabs={folderTabs}
            hasMore={hasMore}
            onLoadMore={() => loadList("more", itemCount)}
          />
        )}
      </div>

      <div className={`${detailOpen ? "flex" : "hidden lg:flex"} min-w-0 flex-1 flex-col bg-[#080a0f]`}>{rightPane}</div>

      {toast && (
        <div role="status" key={toast.id} className="pointer-events-auto absolute bottom-4 right-4 z-30 flex max-w-[calc(100%-2rem)] items-center gap-4 rounded-xl border border-white/10 bg-[#161a22] py-2.5 pl-4 pr-2.5 text-[13.5px] text-[#f2f3f5] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)] motion-safe:animate-[tk-compose-in_220ms_cubic-bezier(0.23,1,0.32,1)]">
          <span>{toast.message}</span>
          {toast.action && (
            <button type="button" onClick={() => { toast.action?.run(); setToast(null); }} className="rounded-lg px-2.5 py-1 text-[13px] font-semibold text-[#1ec4ff] hover:bg-[rgba(30,196,255,0.1)]">
              {toast.action.label}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

function EmptyPane({ title, hint }: { title: React.ReactNode; hint: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <Mail size={22} className="text-[rgba(242,243,245,0.25)]" />
      <p className="mt-4 text-[19px] font-semibold tracking-[-0.02em]">{title}</p>
      <div className="mt-2 max-w-[46ch] text-[13px] leading-relaxed text-[rgba(242,243,245,0.45)]">{hint}</div>
    </div>
  );
}

function ReaderSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[820px] px-8 pt-20" aria-label="Cargando correo">
      <div className="h-6 w-3/5 animate-pulse rounded bg-white/[0.07]" />
      <div className="mt-6 flex gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-white/[0.06]" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3 w-1/3 animate-pulse rounded bg-white/[0.07]" />
          <div className="h-2.5 w-1/4 animate-pulse rounded bg-white/[0.05]" />
        </div>
      </div>
      <div className="mt-8 h-72 animate-pulse rounded-xl bg-white/[0.04]" />
    </div>
  );
}
