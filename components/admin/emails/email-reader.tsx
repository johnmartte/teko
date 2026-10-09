"use client";

import type { ReactNode } from "react";
import { ArrowLeft, Copy, Forward, MailOpen, Paperclip, Reply, TriangleAlert } from "lucide-react";
import type { EmailMessageDetail } from "@/lib/admin-api";
import { Avatar, EmailFrame, Kbd, displayName, formatFullDate, parseAddress, statusMeta } from "./email-ui";

function ToolbarButton({ icon: Icon, label, onClick, shortcut, prominent = false }: { icon: typeof Reply; label: string; onClick: () => void; shortcut?: string; prominent?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={shortcut ? `${label} (${shortcut})` : label}
      className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium text-[rgba(242,243,245,0.72)] transition-colors hover:bg-white/[0.06] hover:text-[#f2f3f5] focus-visible:outline-2 focus-visible:outline-[#1ec4ff]"
    >
      <Icon size={15} />
      <span className={prominent ? "hidden @md:inline" : "hidden @2xl:inline"}>{label}</span>
    </button>
  );
}

export function EmailReader({ email, onBack, onReply, onForward, onMarkUnread, onCopy, replySlot }: {
  email: EmailMessageDetail;
  onBack: () => void;
  onReply: () => void;
  onForward: () => void;
  onMarkUnread: () => void;
  onCopy: (value: string) => void;
  replySlot: ReactNode;
}) {
  const inbound = email.direction === "inbound";
  const sender = parseAddress(email.from_email);
  const counterpart = inbound ? email.from_email : email.to_email.split(",")[0] ?? "";
  const status = statusMeta(email.status);

  return (
    <article className="@container flex h-full min-h-0 flex-col">
      <div className="flex h-14 shrink-0 items-center gap-1 border-b border-white/[0.06] px-3">
        <button type="button" onClick={onBack} aria-label="Volver a la lista" className="grid h-8 w-8 place-items-center rounded-lg text-[rgba(242,243,245,0.6)] hover:bg-white/[0.06] hover:text-[#f2f3f5] lg:hidden">
          <ArrowLeft size={17} />
        </button>
        <div className="ml-auto flex items-center gap-0.5">
          {inbound && <ToolbarButton icon={Reply} label="Responder" onClick={onReply} shortcut="R" prominent />}
          <ToolbarButton icon={Forward} label="Reenviar" onClick={onForward} shortcut="F" />
          {inbound && <ToolbarButton icon={MailOpen} label="Marcar no leído" onClick={onMarkUnread} shortcut="U" />}
          <ToolbarButton icon={Copy} label="Copiar dirección" onClick={() => onCopy(parseAddress(counterpart).email)} />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[820px] px-5 pb-10 pt-7 sm:px-8">
          <h1 className="text-[22px] font-semibold leading-[1.25] tracking-[-0.02em] text-[#f2f3f5]" style={{ textWrap: "balance" }}>
            {email.subject || "(sin asunto)"}
          </h1>

          <div className="mt-5 flex items-start gap-3">
            <Avatar label={displayName(inbound ? email.from_email : email.to_email)} size={40} highlight={inbound} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="min-w-0 truncate text-[14.5px]">
                  <span className="font-semibold text-[#f2f3f5]">{inbound ? sender.name || sender.email : "TEKO"}</span>
                  {inbound && sender.name && <span className="ml-2 text-[rgba(242,243,245,0.5)]">{sender.email}</span>}
                </p>
                <time dateTime={email.created_at} className="shrink-0 text-[12.5px] text-[rgba(242,243,245,0.45)]">{formatFullDate(email.created_at)}</time>
              </div>
              <p className="mt-0.5 break-words text-[12.5px] text-[rgba(242,243,245,0.5)]">
                para {email.to_email}
                {email.cc && <span> · cc {email.cc}</span>}
              </p>
              {!inbound && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-medium" style={{ color: status.color }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: status.color }} />
                  {status.label}
                </p>
              )}
            </div>
          </div>

          {email.error_message && (
            <p className="mt-5 flex items-start gap-2 rounded-xl bg-[rgba(248,113,113,0.1)] px-4 py-3 text-[13px] text-[#fca5a5]">
              <TriangleAlert size={15} className="mt-0.5 shrink-0" />
              {email.error_message}
            </p>
          )}

          <div className="mt-6">
            {email.html_body ? (
              <EmailFrame key={email.id} html={email.html_body} title={email.subject || "Correo"} />
            ) : email.text_body ? (
              <p className="max-w-[68ch] whitespace-pre-wrap text-[15px] leading-[1.7] text-[rgba(242,243,245,0.86)]">{email.text_body}</p>
            ) : (
              <p className="text-[14px] text-[rgba(242,243,245,0.45)]">Este correo llegó sin contenido.</p>
            )}
          </div>

          {email.has_attachments && (
            <p className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2 text-[13px] text-[rgba(242,243,245,0.6)]">
              <Paperclip size={14} />
              Trae archivos adjuntos. Descárgalos desde el panel de Resend.
            </p>
          )}

          {replySlot && <div className="mt-8">{replySlot}</div>}
        </div>
      </div>
    </article>
  );
}

export function ReplyPrompt({ name, onClick }: { name: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-white/10 px-4 py-3.5 text-left text-[14px] text-[rgba(242,243,245,0.5)] transition-colors hover:border-white/[0.16] hover:bg-white/[0.03] hover:text-[rgba(242,243,245,0.72)]"
    >
      <Reply size={16} />
      <span className="flex-1">Responder a {name}</span>
      <Kbd>R</Kbd>
    </button>
  );
}
