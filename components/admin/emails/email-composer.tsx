"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Bold, Italic, List, LoaderCircle, Send, Trash2, X } from "lucide-react";
import { api, type EmailMessageDetail, type EmailTemplate } from "@/lib/admin-api";
import { EMAIL_PATTERN, EmailFrame } from "./email-ui";

export type ComposeMode = "new" | "reply" | "forward";

export interface ComposeDraft {
  mode: ComposeMode;
  to: string[];
  cc: string[];
  bcc: string[];
  showCc: boolean;
  subject: string;
  body: string;
  templateId: number | null;
  replyToId: number | null;
}

export function emptyDraft(templates: EmailTemplate[], patch: Partial<ComposeDraft> = {}): ComposeDraft {
  const fallback = templates.find((item) => item.is_default) ?? null;
  return { mode: "new", to: [], cc: [], bcc: [], showCc: false, subject: "", body: "", templateId: fallback?.id ?? null, replyToId: null, ...patch };
}

export function draftHasContent(draft: ComposeDraft) {
  return draft.to.length > 0 || draft.subject.trim() !== "" || draft.body.trim() !== "";
}

const titles: Record<ComposeMode, string> = { new: "Nuevo correo", reply: "Responder", forward: "Reenviar" };

function RecipientField({ label, values, onChange, autoFocus, trailing }: { label: string; values: string[]; onChange: (next: string[]) => void; autoFocus?: boolean; trailing?: ReactNode }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const commit = (raw: string) => {
    const parts = raw.split(/[\s,;]+/).map((part) => part.trim()).filter(Boolean);
    if (parts.length === 0) { setText(""); setError(""); return; }
    const valid = parts.filter((part) => EMAIL_PATTERN.test(part));
    const invalid = parts.filter((part) => !EMAIL_PATTERN.test(part));
    if (valid.length) onChange([...values, ...valid.filter((item) => !values.includes(item))]);
    setText(invalid.join(" "));
    setError(invalid.length ? `"${invalid[0]}" no parece un correo válido` : "");
  };

  const handleKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if ((event.key === "Enter" || event.key === "," || event.key === ";" || (event.key === "Tab" && text.trim())) && !event.metaKey && !event.ctrlKey) {
      event.preventDefault();
      commit(text);
    } else if (event.key === "Backspace" && text === "" && values.length) {
      onChange(values.slice(0, -1));
    }
  };

  return (
    <div className="border-b border-white/[0.06] px-5 py-2">
      <div className="flex min-h-9 flex-wrap items-center gap-1.5">
        <span className="w-14 shrink-0 text-[13px] text-[rgba(242,243,245,0.45)]">{label}</span>
        {values.map((value) => (
          <span key={value} className="inline-flex items-center gap-1 rounded-full bg-white/[0.07] py-1 pl-2.5 pr-1 text-[13px] text-[#f2f3f5]">
            {value}
            <button type="button" aria-label={`Quitar ${value}`} onClick={() => onChange(values.filter((item) => item !== value))} className="grid h-5 w-5 place-items-center rounded-full text-[rgba(242,243,245,0.5)] hover:bg-white/10 hover:text-[#f2f3f5]">
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          autoFocus={autoFocus}
          value={text}
          onChange={(event) => { const value = event.target.value; if (/[,;\s]$/.test(value) && value.trim()) commit(value); else setText(value); }}
          onKeyDown={handleKey}
          onBlur={() => commit(text)}
          onPaste={(event) => { const pasted = event.clipboardData.getData("text"); if (/[,;\s]/.test(pasted.trim())) { event.preventDefault(); commit(text + pasted); } }}
          placeholder={values.length ? "" : "nombre@empresa.com"}
          aria-label={label}
          className="min-w-[160px] flex-1 bg-transparent py-1 text-[14px] text-[#f2f3f5] outline-none placeholder:text-[rgba(242,243,245,0.3)]"
        />
        {trailing}
      </div>
      {error && <p className="pb-1 pl-14 text-[12px] text-[#f87171]">{error}</p>}
    </div>
  );
}

export function EmailComposer({ draft, onChange, onClose, onDiscard, onSent, templates, variant = "pane" }: {
  draft: ComposeDraft;
  onChange: (draft: ComposeDraft) => void;
  onClose: () => void;
  onDiscard: () => void;
  onSent: (message: EmailMessageDetail) => void;
  templates: EmailTemplate[];
  variant?: "pane" | "inline";
}) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewError, setPreviewError] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const update = (patch: Partial<ComposeDraft>) => onChange({ ...draft, ...patch });

  useEffect(() => {
    const element = bodyRef.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${Math.max(element.scrollHeight, variant === "inline" ? 140 : 260)}px`;
  }, [draft.body, tab, variant]);

  useEffect(() => {
    if (tab !== "preview") return;
    const timer = window.setTimeout(() => {
      api<{ html: string }>("/admin/emails/preview", {
        method: "POST",
        body: JSON.stringify({ subject: draft.subject, body: draft.body || " ", template_id: draft.templateId }),
      })
        .then((result) => { setPreviewHtml(result.html); setPreviewError(""); })
        .catch((e: Error) => setPreviewError(e.message));
    }, 350);
    return () => window.clearTimeout(timer);
  }, [tab, draft.body, draft.subject, draft.templateId]);

  const send = async () => {
    if (sending) return;
    if (draft.to.length === 0) { setError("Agrega al menos un destinatario."); return; }
    if (!draft.subject.trim()) { setError("El correo necesita un asunto."); return; }
    if (!draft.body.trim()) { setError("Escribe el mensaje antes de enviar."); return; }
    setSending(true);
    setError("");
    try {
      const sent = await api<EmailMessageDetail>("/admin/emails", {
        method: "POST",
        body: JSON.stringify({
          to: draft.to,
          cc: draft.cc.length ? draft.cc : null,
          bcc: draft.bcc.length ? draft.bcc : null,
          subject: draft.subject.trim(),
          body: draft.body,
          template_id: draft.templateId,
          reply_to_email_id: draft.replyToId,
        }),
      });
      onSent(sent);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  };

  const wrapSelection = (marker: string) => {
    const element = bodyRef.current;
    if (!element) return;
    const { selectionStart: start, selectionEnd: end, value } = element;
    const selected = value.slice(start, end) || "texto";
    update({ body: value.slice(0, start) + marker + selected + marker + value.slice(end) });
    requestAnimationFrame(() => { element.focus(); element.setSelectionRange(start + marker.length, start + marker.length + selected.length); });
  };

  const bulletize = () => {
    const element = bodyRef.current;
    if (!element) return;
    const { selectionStart: start, selectionEnd: end, value } = element;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const block = value.slice(lineStart, end) || "";
    const listed = (block || "Elemento").split("\n").map((line) => (/^\s*[-•]\s/.test(line) ? line : `- ${line}`)).join("\n");
    update({ body: value.slice(0, lineStart) + listed + value.slice(end) });
    requestAnimationFrame(() => element.focus());
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") { event.preventDefault(); send(); }
    else if (event.key === "Escape") { event.preventDefault(); onClose(); }
    else if ((event.metaKey || event.ctrlKey) && event.target === bodyRef.current && (event.key === "b" || event.key === "i")) {
      event.preventDefault();
      wrapSelection(event.key === "b" ? "**" : "*");
    }
  };

  const ccToggle = !draft.showCc && (
    <button type="button" onClick={() => update({ showCc: true })} className="shrink-0 rounded-md px-2 py-1 text-[12.5px] text-[rgba(242,243,245,0.5)] hover:bg-white/[0.06] hover:text-[#f2f3f5]">
      Cc / Cco
    </button>
  );

  const inline = variant === "inline";

  return (
    <div
      onKeyDown={handleKeyDown}
      className={`flex flex-col motion-safe:animate-[tk-compose-in_220ms_cubic-bezier(0.23,1,0.32,1)] ${inline ? "rounded-2xl border border-white/10 bg-[#0d1017]" : "h-full min-h-0"}`}
    >
      <div className={`flex items-center justify-between gap-3 border-b border-white/[0.06] ${inline ? "px-5 py-3" : "px-5 py-4"}`}>
        <h2 className={`${inline ? "text-[14px]" : "text-[17px]"} font-semibold tracking-[-0.01em] text-[#f2f3f5]`}>{titles[draft.mode]}</h2>
        <div className="flex items-center gap-2">
          <div role="tablist" aria-label="Modo" className="flex rounded-lg bg-white/[0.04] p-0.5">
            {(["write", "preview"] as const).map((key) => (
              <button key={key} role="tab" aria-selected={tab === key} type="button" onClick={() => setTab(key)}
                className={`rounded-md px-3 py-1 text-[12.5px] font-medium transition-colors ${tab === key ? "bg-white/[0.09] text-[#f2f3f5]" : "text-[rgba(242,243,245,0.55)] hover:text-[#f2f3f5]"}`}>
                {key === "write" ? "Escribir" : "Vista previa"}
              </button>
            ))}
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar redactor" title="Cerrar (Esc). El borrador se guarda." className="grid h-8 w-8 place-items-center rounded-lg text-[rgba(242,243,245,0.5)] hover:bg-white/[0.06] hover:text-[#f2f3f5]">
            <X size={16} />
          </button>
        </div>
      </div>

      <RecipientField label="Para" values={draft.to} onChange={(to) => update({ to })} autoFocus={draft.mode !== "reply" && draft.to.length === 0} trailing={ccToggle} />
      {draft.showCc && (
        <>
          <RecipientField label="Cc" values={draft.cc} onChange={(cc) => update({ cc })} />
          <RecipientField label="Cco" values={draft.bcc} onChange={(bcc) => update({ bcc })} />
        </>
      )}
      {!inline && (
        <label className="flex items-center gap-1.5 border-b border-white/[0.06] px-5 py-2">
          <span className="w-14 shrink-0 text-[13px] text-[rgba(242,243,245,0.45)]">Asunto</span>
          <input
            value={draft.subject}
            onChange={(event) => update({ subject: event.target.value })}
            autoFocus={draft.mode === "forward"}
            placeholder="De qué trata el correo"
            className="min-h-9 flex-1 bg-transparent text-[14.5px] font-medium text-[#f2f3f5] outline-none placeholder:font-normal placeholder:text-[rgba(242,243,245,0.3)]"
          />
        </label>
      )}

      <div className={inline ? "" : "min-h-0 flex-1 overflow-y-auto"}>
        {tab === "write" ? (
          <textarea
            ref={bodyRef}
            value={draft.body}
            onChange={(event) => update({ body: event.target.value })}
            autoFocus={draft.mode === "reply"}
            placeholder="Escribe tu mensaje…"
            className="block w-full resize-none bg-transparent px-5 py-4 text-[15px] leading-[1.7] text-[#f2f3f5] outline-none placeholder:text-[rgba(242,243,245,0.3)]"
          />
        ) : (
          <div className="p-4">
            {previewError ? (
              <p className="rounded-xl bg-[rgba(248,113,113,0.12)] p-3 text-[13px] text-[#f87171]">{previewError}</p>
            ) : previewHtml ? (
              <EmailFrame html={previewHtml} title="Vista previa del correo" minHeight={inline ? 260 : 420} />
            ) : (
              <div className="h-[320px] animate-pulse rounded-xl bg-white/[0.04]" />
            )}
          </div>
        )}
      </div>

      {error && <p role="alert" className="mx-5 mb-2 rounded-lg bg-[rgba(248,113,113,0.12)] px-3 py-2 text-[13px] text-[#f87171]">{error}</p>}

      <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.06] px-4 py-3">
        {tab === "write" && (
          <div className="flex items-center gap-0.5">
            {[
              { icon: Bold, label: "Negrita (Ctrl+B)", action: () => wrapSelection("**") },
              { icon: Italic, label: "Cursiva (Ctrl+I)", action: () => wrapSelection("*") },
              { icon: List, label: "Lista", action: bulletize },
            ].map(({ icon: Icon, label, action }) => (
              <button key={label} type="button" onClick={action} title={label} aria-label={label} className="grid h-8 w-8 place-items-center rounded-lg text-[rgba(242,243,245,0.55)] hover:bg-white/[0.06] hover:text-[#f2f3f5]">
                <Icon size={15} />
              </button>
            ))}
          </div>
        )}
        <label className="ml-auto flex items-center gap-2 text-[12.5px] text-[rgba(242,243,245,0.5)]">
          Plantilla
          <select
            value={draft.templateId ?? ""}
            onChange={(event) => update({ templateId: event.target.value ? Number(event.target.value) : null })}
            className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[13px] text-[#f2f3f5] outline-none focus-visible:border-[#1ec4ff]"
          >
            {templates.map((template) => (
              <option key={template.id} value={template.id} style={{ background: "#0d1017" }}>
                {template.name}{template.is_default ? " (predeterminada)" : ""}
              </option>
            ))}
            <option value="" style={{ background: "#0d1017" }}>Sin plantilla</option>
          </select>
        </label>
        <button type="button" onClick={onDiscard} title="Descartar borrador" aria-label="Descartar borrador" className="grid h-9 w-9 place-items-center rounded-lg text-[rgba(242,243,245,0.5)] hover:bg-[rgba(248,113,113,0.12)] hover:text-[#f87171]">
          <Trash2 size={16} />
        </button>
        <button
          type="button"
          onClick={send}
          disabled={sending}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1ec4ff] px-4 text-[13.5px] font-semibold text-[#080a0f] transition-[filter] hover:brightness-110 disabled:opacity-60"
        >
          {sending ? <LoaderCircle size={15} className="animate-spin" /> : <Send size={15} />}
          {sending ? "Enviando" : "Enviar"}
          {!sending && <span className="hidden text-[11px] font-medium text-[#080a0f]/60 sm:inline">Ctrl ↵</span>}
        </button>
      </div>
    </div>
  );
}
