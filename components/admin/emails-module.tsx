"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Mail, MailOpen, Paperclip, PenSquare, Reply, Search, X } from "lucide-react";
import { api, type EmailMessage, type EmailMessageDetail } from "@/lib/admin-api";

const statusLabels: Record<string, string> = {
  received: "Recibido", queued: "En cola", sent: "Enviado", delivered: "Entregado",
  opened: "Abierto", clicked: "Con clic", delivery_delayed: "Demorado",
  bounced: "Rebotado", complained: "Marcado como spam", failed: "Fallo",
};

const failedStatuses = new Set(["bounced", "complained", "failed"]);

const field = { borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#f2f3f5" };
const muted = "rgba(242,243,245,0.45)";

function formatDate(value: string) {
  return new Date(value).toLocaleString("es", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function EmailsModule({ onUnreadChange }: { onUnreadChange?: () => void }) {
  const [tab, setTab] = useState<"inbound" | "outbound">("inbound");
  const [items, setItems] = useState<EmailMessage[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<EmailMessageDetail | null>(null);
  const [compose, setCompose] = useState<{ to: string; subject: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(() => {
    setError("");
    setLoading(true);
    api<EmailMessage[]>(`/admin/emails?direction=${tab}`)
      .then(setItems)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [tab]);

  useEffect(() => { Promise.resolve().then(load); }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => `${item.from_email} ${item.to_email} ${item.subject ?? ""}`.toLowerCase().includes(term));
  }, [items, search]);

  const open = async (item: EmailMessage) => {
    setError("");
    try {
      const detail = await api<EmailMessageDetail>(`/admin/emails/${item.id}`);
      setSelected(detail);
      if (!item.is_read) {
        await api(`/admin/emails/${item.id}/read`, { method: "PATCH", body: JSON.stringify({ is_read: true }) });
        setItems((current) => current.map((row) => (row.id === item.id ? { ...row, is_read: true } : row)));
        onUnreadChange?.();
      }
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const replyTo = (email: EmailMessageDetail) => {
    const subject = email.subject?.startsWith("Re:") ? email.subject : `Re: ${email.subject ?? ""}`;
    setCompose({ to: email.reply_to || email.from_email, subject });
    setSelected(null);
  };

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Correos</h1>
          <p className="text-sm" style={{ color: "rgba(242,243,245,0.5)" }}>Recibe y responde los correos de TEKO sin salir del panel.</p>
        </div>
        <button
          onClick={() => setCompose({ to: "", subject: "" })}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
          style={{ background: "#1ec4ff", color: "#080a0f" }}
        >
          <PenSquare size={16} />Redactar
        </button>
      </div>

      <div className="my-6 flex flex-wrap gap-3">
        <div className="flex rounded-xl border p-1" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
          {([["inbound", "Recibidos"], ["outbound", "Enviados"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setTab(key); setSearch(""); setSuccess(""); }}
              className="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              style={{
                background: tab === key ? "rgba(30,196,255,0.12)" : "transparent",
                color: tab === key ? "#1ec4ff" : "rgba(242,243,245,0.6)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="flex min-w-64 flex-1 items-center gap-2 rounded-xl border px-3" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}>
          <Search size={16} style={{ color: "rgba(242,243,245,0.35)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Remitente, destinatario o asunto..."
            className="w-full bg-transparent py-3 outline-none"
            style={{ color: "#f2f3f5" }}
          />
        </label>
      </div>

      {error && <p className="mb-4" style={{ color: "#f87171" }}>{error}</p>}
      {success && <p className="mb-4 rounded-xl p-3 text-sm" style={{ background: "rgba(74,222,128,0.12)", color: "#4ade80" }}>{success}</p>}

      {loading ? (
        <div className="h-48 animate-pulse rounded-2xl" style={{ background: "rgba(255,255,255,0.06)" }} />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border p-12 text-center" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
          <Mail className="mx-auto mb-3" size={28} style={{ color: "rgba(242,243,245,0.3)" }} />
          <p style={{ color: "rgba(242,243,245,0.4)" }}>
            {tab === "inbound" ? "Todavia no ha llegado ningun correo." : "No has enviado correos desde el panel."}
          </p>
        </div>
      ) : (
        <div className="divide-y overflow-hidden rounded-2xl border" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", ["--tw-divide-color" as string]: "rgba(255,255,255,0.06)" }}>
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => open(item)}
              className="flex w-full items-center gap-4 p-4 text-left transition-colors"
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ color: item.is_read ? "rgba(242,243,245,0.35)" : "#1ec4ff" }}>
                {item.is_read ? <MailOpen size={18} /> : <Mail size={18} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <b className="truncate" style={{ color: "#f2f3f5", fontWeight: item.is_read ? 500 : 700 }}>
                    {tab === "inbound" ? item.from_email : item.to_email}
                  </b>
                  {item.has_attachments && <Paperclip size={13} className="shrink-0" style={{ color: muted }} />}
                </span>
                <span className="block truncate text-sm" style={{ color: "rgba(242,243,245,0.55)" }}>{item.subject || "(sin asunto)"}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-xs font-medium" style={{ color: failedStatuses.has(item.status) ? "#f87171" : muted }}>
                  {statusLabels[item.status] ?? item.status}
                </span>
                <span className="block text-xs" style={{ color: "rgba(242,243,245,0.35)" }}>{formatDate(item.created_at)}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {selected && <EmailDetail email={selected} onClose={() => setSelected(null)} onReply={replyTo} />}
      {compose && (
        <ComposeDialog
          initial={compose}
          onClose={() => setCompose(null)}
          onSent={() => { setCompose(null); setSuccess("Correo enviado correctamente."); setTab("outbound"); }}
        />
      )}
    </section>
  );
}

function EmailDetail({ email, onClose, onReply }: { email: EmailMessageDetail; onClose: () => void; onReply: (email: EmailMessageDetail) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <article
        onClick={(e) => e.stopPropagation()}
        className="h-full w-full max-w-2xl overflow-y-auto p-7 shadow-2xl"
        style={{ background: "#0d1017", color: "#f2f3f5" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold" style={{ color: "#1ec4ff" }}>
              {email.direction === "inbound" ? "Recibido" : "Enviado"} · {statusLabels[email.status] ?? email.status}
            </p>
            <h2 className="mt-2 text-2xl font-bold">{email.subject || "(sin asunto)"}</h2>
          </div>
          <button onClick={onClose} aria-label="Cerrar" style={{ color: "rgba(242,243,245,0.5)" }}><X /></button>
        </div>

        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt style={{ color: muted }}>De</dt><dd className="break-all">{email.from_email}</dd></div>
          <div><dt style={{ color: muted }}>Para</dt><dd className="break-all">{email.to_email}</dd></div>
          {email.cc && <div><dt style={{ color: muted }}>CC</dt><dd className="break-all">{email.cc}</dd></div>}
          <div><dt style={{ color: muted }}>Fecha</dt><dd>{new Date(email.created_at).toLocaleString("es")}</dd></div>
        </dl>

        {email.error_message && (
          <p className="mt-5 rounded-xl p-3 text-sm" style={{ background: "rgba(248,113,113,0.12)", color: "#f87171" }}>{email.error_message}</p>
        )}

        <div className="mt-6">
          {email.html_body ? (
            // sandbox vacio: el HTML del correo no puede ejecutar scripts ni tocar la sesion del panel.
            <iframe
              sandbox=""
              srcDoc={email.html_body}
              title="Contenido del correo"
              className="h-[460px] w-full rounded-xl border"
              style={{ borderColor: "rgba(255,255,255,0.1)", background: "#ffffff" }}
            />
          ) : email.text_body ? (
            <p className="whitespace-pre-wrap rounded-xl p-5 text-sm" style={{ background: "rgba(255,255,255,0.04)" }}>{email.text_body}</p>
          ) : (
            <p className="rounded-xl p-5 text-sm" style={{ background: "rgba(255,255,255,0.04)", color: muted }}>
              Este correo no tiene contenido disponible.
            </p>
          )}
        </div>

        {email.has_attachments && (
          <p className="mt-4 flex items-center gap-2 text-sm" style={{ color: muted }}>
            <Paperclip size={14} />Este correo trae archivos adjuntos. Abrelo en Resend para descargarlos.
          </p>
        )}

        {email.direction === "inbound" && (
          <button
            onClick={() => onReply(email)}
            className="mt-7 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
            style={{ background: "#1ec4ff", color: "#080a0f" }}
          >
            <Reply size={16} />Responder
          </button>
        )}
      </article>
    </div>
  );
}

function ComposeDialog({ initial, onClose, onSent }: { initial: { to: string; subject: string }; onClose: () => void; onSent: () => void }) {
  const [to, setTo] = useState(initial.to);
  const [subject, setSubject] = useState(initial.subject);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setError("");
    try {
      await api("/admin/emails", {
        method: "POST",
        body: JSON.stringify({
          to: to.split(",").map((item) => item.trim()).filter(Boolean),
          subject,
          text,
        }),
      });
      onSent();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
      <form onSubmit={submit} className="w-full max-w-xl rounded-2xl p-6" style={{ background: "#0d1017", color: "#f2f3f5" }}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Nuevo correo</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar" style={{ color: "rgba(242,243,245,0.5)" }}><X /></button>
        </div>

        {error && <p className="mt-4 rounded-xl p-3 text-sm" style={{ background: "rgba(248,113,113,0.12)", color: "#f87171" }}>{error}</p>}

        <label className="mt-4 block text-sm font-medium">Para
          <input required value={to} onChange={(e) => setTo(e.target.value)} placeholder="cliente@empresa.com, otro@empresa.com" className="mt-1 w-full rounded-xl border px-3 py-2.5" style={field} />
        </label>
        <p className="mt-1 text-xs" style={{ color: muted }}>Separa varios destinatarios con comas.</p>

        <label className="mt-4 block text-sm font-medium">Asunto
          <input required value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2.5" style={field} />
        </label>

        <label className="mt-4 block text-sm font-medium">Mensaje
          <textarea required rows={9} value={text} onChange={(e) => setText(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2.5" style={field} />
        </label>

        <button disabled={sending} className="mt-6 w-full rounded-xl py-3 font-semibold disabled:opacity-60" style={{ background: "#1ec4ff", color: "#080a0f" }}>
          {sending ? "Enviando..." : "Enviar correo"}
        </button>
      </form>
    </div>
  );
}
