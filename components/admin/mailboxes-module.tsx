"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Copy, Hand, LoaderCircle, Pencil, Plus, Search, X } from "lucide-react";
import { api, type Mailbox, type MailboxRequest, type PlannerUser } from "@/lib/admin-api";
import { Avatar, Serif, formatListTime } from "./emails/email-ui";

const inputClass = "h-10 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-[14px] text-[#f2f3f5] outline-none transition-colors placeholder:text-[rgba(242,243,245,0.3)] focus:border-[rgba(30,196,255,0.5)]";

function suggestLocalPart(name: string) {
  const parts = name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  return parts.length > 1 ? `${parts[0]}.${parts[parts.length - 1]}` : parts[0] ?? "";
}

function defaultSignature(user: PlannerUser) {
  return [user.name, user.job_title ? `${user.job_title} · TEKO` : "TEKO"].join("\n");
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="mb-1.5 block text-[12.5px] font-medium text-[rgba(242,243,245,0.72)]">{children}</span>;
}

function CreatePanel({ domain, preselectId, onClose, onCreated }: { domain: string; preselectId?: string | null; onClose: () => void; onCreated: (mailbox: Mailbox) => void }) {
  const [users, setUsers] = useState<PlannerUser[] | null>(null);
  const [usersError, setUsersError] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<PlannerUser | null>(null);
  const [localPart, setLocalPart] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [signature, setSignature] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const choose = (user: PlannerUser) => {
    setSelected(user);
    setLocalPart(suggestLocalPart(user.name));
    setDisplayName(user.name);
    setSignature(defaultSignature(user));
    setError("");
  };

  useEffect(() => {
    api<PlannerUser[]>("/admin/mailboxes/planner-users")
      .then((list) => {
        setUsers(list);
        // Desde una solicitud: el empleado ya viene elegido.
        const requested = preselectId ? list.find((user) => user.id === preselectId && !user.mailbox_address) : null;
        if (requested) choose(requested);
      })
      .catch((e: Error) => setUsersError(e.message));
  }, [preselectId]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (users ?? []).filter((user) => !term || `${user.name} ${user.email} ${user.job_title ?? ""}`.toLowerCase().includes(term));
  }, [users, query]);

  const validLocal = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(localPart);

  const create = async () => {
    if (!selected || saving) return;
    if (!validLocal) { setError("La dirección solo puede tener letras, números, puntos, guiones y guiones bajos."); return; }
    setSaving(true);
    setError("");
    try {
      const mailbox = await api<Mailbox>("/admin/mailboxes", {
        method: "POST",
        body: JSON.stringify({ planner_user_id: selected.id, local_part: localPart, display_name: displayName.trim(), signature: signature.trim() || null }),
      });
      onCreated(mailbox);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section aria-label="Nuevo correo" className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1017] motion-safe:animate-[tk-compose-in_220ms_cubic-bezier(0.23,1,0.32,1)]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
        <div>
          <h2 className="text-[16px] font-semibold tracking-[-0.01em]">Nuevo correo de empleado</h2>
          <p className="mt-0.5 text-[12.5px] text-[rgba(242,243,245,0.5)]">Elige a la persona en el Planner y su dirección. Lo verá en su Bandeja al instante.</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Cerrar" className="grid h-8 w-8 place-items-center rounded-lg text-[rgba(242,243,245,0.5)] hover:bg-white/[0.06] hover:text-[#f2f3f5]"><X size={16} /></button>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="border-white/[0.06] p-5 lg:border-r">
          <Label>1. Empleado del Planner</Label>
          <label className="mb-2 flex h-10 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 focus-within:border-[rgba(30,196,255,0.5)]">
            <Search size={15} className="text-[rgba(242,243,245,0.35)]" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre o correo" className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[rgba(242,243,245,0.3)]" />
          </label>
          <div className="max-h-[300px] space-y-0.5 overflow-y-auto pr-1">
            {usersError ? (
              <p className="rounded-lg bg-[rgba(248,113,113,0.1)] p-3 text-[13px] text-[#fca5a5]">{usersError}</p>
            ) : users === null ? (
              [1, 2, 3].map((key) => <div key={key} className="h-12 animate-pulse rounded-lg bg-white/[0.04]" />)
            ) : visible.length === 0 ? (
              <p className="p-4 text-center text-[13px] text-[rgba(242,243,245,0.45)]">No hay empleados con ese nombre.</p>
            ) : (
              visible.map((user) => {
                const taken = Boolean(user.mailbox_address);
                const active = selected?.id === user.id;
                return (
                  <button
                    key={user.id}
                    type="button"
                    disabled={taken}
                    onClick={() => choose(user)}
                    className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${active ? "bg-[rgba(30,196,255,0.1)]" : "hover:bg-white/[0.04]"}`}
                  >
                    <Avatar label={user.name} size={30} highlight={active} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-medium">{user.name}</span>
                      <span className="block truncate text-[12px] text-[rgba(242,243,245,0.45)]">{taken ? `Ya tiene ${user.mailbox_address}` : user.job_title || user.email}</span>
                    </span>
                    {active && <Check size={16} className="shrink-0 text-[#1ec4ff]" />}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="p-5">
          {!selected ? (
            <div className="grid h-full min-h-[220px] place-items-center text-center">
              <p className="max-w-[28ch] text-[13px] leading-relaxed text-[rgba(242,243,245,0.45)]">Selecciona un empleado para configurar su dirección, nombre y firma.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block">
                <Label>2. Dirección</Label>
                <span className="flex items-center overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.03] focus-within:border-[rgba(30,196,255,0.5)]">
                  <input value={localPart} onChange={(e) => setLocalPart(e.target.value.toLowerCase().trim())} spellCheck={false} aria-label="Parte local de la dirección" className="h-10 min-w-0 flex-1 bg-transparent pl-3 text-[14px] outline-none" />
                  <span className="shrink-0 pr-3 text-[14px] text-[rgba(242,243,245,0.45)]">@{domain || "…"}</span>
                </span>
                {!validLocal && localPart && <span className="mt-1 block text-[12px] text-[#f87171]">Usa letras, números, puntos o guiones, sin espacios ni tildes.</span>}
              </label>
              <label className="block">
                <Label>Nombre que verán al recibir</Label>
                <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={inputClass} />
              </label>
              <label className="block">
                <Label>Firma</Label>
                <textarea rows={3} value={signature} onChange={(e) => setSignature(e.target.value)} className={`${inputClass} h-auto py-2 leading-relaxed`} />
                <span className="mt-1 block text-[11.5px] text-[rgba(242,243,245,0.4)]">Reemplaza la firma de la plantilla en sus correos. El empleado también puede cambiarla.</span>
              </label>
              {error && <p role="alert" className="rounded-lg bg-[rgba(248,113,113,0.12)] px-3 py-2 text-[13px] text-[#f87171]">{error}</p>}
              <div className="flex items-center justify-between gap-3 pt-1">
                <p className="min-w-0 truncate text-[12.5px] text-[rgba(242,243,245,0.5)]">{displayName || selected.name} &lt;{localPart || "…"}@{domain}&gt;</p>
                <button type="button" onClick={create} disabled={saving || !displayName.trim()} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-[#1ec4ff] px-4 text-[13.5px] font-semibold text-[#080a0f] transition-[filter] hover:brightness-110 disabled:opacity-50">
                  {saving && <LoaderCircle size={15} className="animate-spin" />}
                  Crear correo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function MailboxRow({ mailbox, onChanged, onCopy }: { mailbox: Mailbox; onChanged: (mailbox: Mailbox, message: string) => void; onCopy: (value: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [confirmOff, setConfirmOff] = useState(false);
  const [displayName, setDisplayName] = useState(mailbox.display_name);
  const [signature, setSignature] = useState(mailbox.signature ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const patch = async (body: Record<string, unknown>, message: string) => {
    setBusy(true);
    setError("");
    try {
      const updated = await api<Mailbox>(`/admin/mailboxes/${mailbox.id}`, { method: "PATCH", body: JSON.stringify(body) });
      onChanged(updated, updated.is_active ? enabledMessage(updated, message) : message);
      setEditing(false);
      setConfirmOff(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`px-4 py-4 transition-colors sm:px-5 ${mailbox.is_active ? "" : "bg-white/[0.015]"}`}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <Avatar label={mailbox.display_name} size={38} highlight={mailbox.is_active} />
        <div className="min-w-[200px] flex-1">
          <p className={`text-[14.5px] font-semibold ${mailbox.is_active ? "text-[#f2f3f5]" : "text-[rgba(242,243,245,0.5)]"}`}>{mailbox.display_name}</p>
          <button type="button" onClick={() => onCopy(mailbox.address)} title="Copiar dirección" className="group mt-0.5 inline-flex items-center gap-1.5 text-[13px] text-[rgba(242,243,245,0.6)] hover:text-[#f2f3f5]">
            {mailbox.address}
            <Copy size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        </div>
        <div className="w-full min-w-0 text-[12.5px] text-[rgba(242,243,245,0.5)] sm:w-[240px]">
          <p className="truncate text-[rgba(242,243,245,0.72)]">{mailbox.planner_user_name}</p>
          <p className="truncate">Planner · {mailbox.planner_user_email}</p>
        </div>
        <div className="w-[118px] text-[12.5px] tabular-nums text-[rgba(242,243,245,0.5)]">
          <p><span className="text-[rgba(242,243,245,0.85)]">{mailbox.total_messages}</span> correos</p>
          <p className={mailbox.unread_messages ? "text-[#1ec4ff]" : ""}>{mailbox.unread_messages} sin leer</p>
        </div>
        <div className="flex w-[150px] items-center justify-end gap-1.5">
          {confirmOff ? (
            <span className="flex items-center gap-1.5 text-[12.5px] text-[rgba(242,243,245,0.7)]">
              ¿Deshabilitar?
              <button type="button" disabled={busy} onClick={() => patch({ is_active: false }, `${mailbox.address} deshabilitado.`)} className="rounded-lg bg-[rgba(248,113,113,0.14)] px-2.5 py-1.5 font-semibold text-[#f87171]">Sí</button>
              <button type="button" onClick={() => setConfirmOff(false)} className="rounded-lg px-2 py-1.5 hover:bg-white/[0.06]">No</button>
            </span>
          ) : mailbox.is_active ? (
            <button type="button" onClick={() => setConfirmOff(true)} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[rgba(74,222,128,0.1)] px-3 text-[12px] font-semibold text-[#4ade80] hover:bg-[rgba(74,222,128,0.16)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" />Activo
            </button>
          ) : (
            <button type="button" disabled={busy} onClick={() => patch({ is_active: true }, `${mailbox.address} habilitado.`)} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/10 px-3 text-[12px] font-semibold text-[rgba(242,243,245,0.6)] hover:border-[rgba(30,196,255,0.5)] hover:text-[#f2f3f5]">
              Habilitar
            </button>
          )}
          <button type="button" onClick={() => setEditing((value) => !value)} aria-label="Editar" title="Editar nombre y firma" className="grid h-8 w-8 place-items-center rounded-lg text-[rgba(242,243,245,0.5)] hover:bg-white/[0.06] hover:text-[#f2f3f5]">
            <Pencil size={14} />
          </button>
        </div>
      </div>

      {confirmOff && <p className="mt-2 pl-[54px] text-[12px] text-[rgba(242,243,245,0.45)]">Dejará de ver su Bandeja en el Planner. Lo que llegue a esta dirección irá a Correos del CMS.</p>}
      {error && <p className="mt-2 pl-[54px] text-[12.5px] text-[#f87171]">{error}</p>}

      {editing && (
        <div className="mt-4 grid gap-3 pl-0 sm:pl-[54px] md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_auto] md:items-end">
          <label className="block"><Label>Nombre visible</Label><input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={inputClass} /></label>
          <label className="block"><Label>Firma</Label><textarea rows={2} value={signature} onChange={(e) => setSignature(e.target.value)} className={`${inputClass} h-auto py-2`} /></label>
          <button type="button" disabled={busy || !displayName.trim()} onClick={() => patch({ display_name: displayName.trim(), signature: signature.trim() || null }, "Cambios guardados.")} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1ec4ff] px-4 text-[13.5px] font-semibold text-[#080a0f] disabled:opacity-50">
            {busy && <LoaderCircle size={15} className="animate-spin" />}Guardar
          </button>
        </div>
      )}
    </div>
  );
}

/** Complementa el mensaje al habilitar con el resultado del aviso al correo personal. */
function enabledMessage(mailbox: Mailbox, base: string) {
  if (mailbox.notice_sent === true) return `${base} Avisamos a ${mailbox.planner_user_email}.`;
  if (mailbox.notice_sent === false) return `${base} No se pudo enviar el aviso a ${mailbox.planner_user_email}.`;
  return base;
}

function RequestsPanel({ requests, onCreate, onResolved }: { requests: MailboxRequest[]; onCreate: (request: MailboxRequest) => void; onResolved: (message: string) => void }) {
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const run = async (request: MailboxRequest, action: "enable" | "dismiss") => {
    setBusyId(request.id);
    setError("");
    try {
      if (action === "enable" && request.mailbox_id) {
        const updated = await api<Mailbox>(`/admin/mailboxes/${request.mailbox_id}`, { method: "PATCH", body: JSON.stringify({ is_active: true }) });
        onResolved(enabledMessage(updated, `${request.mailbox_address} habilitado para ${request.planner_user_name}.`));
      } else {
        await api(`/admin/mailboxes/requests/${request.id}`, { method: "PATCH", body: JSON.stringify({ status: "dismissed" }) });
        onResolved(`Solicitud de ${request.planner_user_name} descartada.`);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section aria-label="Solicitudes de correo" className="mb-6 overflow-hidden rounded-2xl border border-[rgba(30,196,255,0.28)] bg-[rgba(30,196,255,0.04)]">
      <div className="flex items-center gap-2.5 border-b border-[rgba(30,196,255,0.14)] px-4 py-3 sm:px-5">
        <Hand size={15} className="text-[#1ec4ff]" />
        <h2 className="text-[14px] font-semibold">Solicitudes de correo institucional</h2>
        <span className="rounded-full bg-[#1ec4ff] px-2 py-0.5 text-[11px] font-bold text-[#080a0f]">{requests.length}</span>
      </div>
      {error && <p className="mx-5 mt-3 rounded-lg bg-[rgba(248,113,113,0.12)] px-3 py-2 text-[13px] text-[#f87171]">{error}</p>}
      <div className="divide-y divide-white/[0.06]">
        {requests.map((request) => (
          <div key={request.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3.5 sm:px-5">
            <Avatar label={request.planner_user_name} size={34} highlight />
            <div className="min-w-[200px] flex-1">
              <p className="text-[14px] font-semibold text-[#f2f3f5]">{request.planner_user_name}</p>
              <p className="text-[12.5px] text-[rgba(242,243,245,0.5)]">
                {request.mailbox_address ? `Pide que le rehabiliten ${request.mailbox_address}` : "Pide su correo institucional"}
                {request.planner_user_email && <> · {request.planner_user_email}</>}
              </p>
            </div>
            <time dateTime={request.created_at} className="text-[12px] tabular-nums text-[rgba(242,243,245,0.45)]">{formatListTime(request.created_at)}</time>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={busyId !== null}
                onClick={() => (request.mailbox_id ? run(request, "enable") : onCreate(request))}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#1ec4ff] px-3 text-[12.5px] font-semibold text-[#080a0f] transition-[filter] hover:brightness-110 disabled:opacity-50"
              >
                {busyId === request.id && request.mailbox_id ? <LoaderCircle size={13} className="animate-spin" /> : request.mailbox_id ? <Check size={13} /> : <Plus size={13} />}
                {request.mailbox_id ? "Habilitar" : "Crear correo"}
              </button>
              <button
                type="button"
                disabled={busyId !== null}
                onClick={() => run(request, "dismiss")}
                className="h-8 rounded-lg px-3 text-[12.5px] font-medium text-[rgba(242,243,245,0.55)] hover:bg-white/[0.06] hover:text-[#f2f3f5] disabled:opacity-50"
              >
                Descartar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function MailboxesModule({ onRequestsChange }: { onRequestsChange?: () => void }) {
  const [mailboxes, setMailboxes] = useState<Mailbox[]>([]);
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [preselectId, setPreselectId] = useState<string | null>(null);
  const [requests, setRequests] = useState<MailboxRequest[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(() => {
    Promise.all([api<Mailbox[]>("/admin/mailboxes"), api<{ domain: string }>("/admin/mailboxes/domain"), api<MailboxRequest[]>("/admin/mailboxes/requests")])
      .then(([list, info, pending]) => { setMailboxes(list); setDomain(info.domain); setRequests(pending); setError(""); })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { Promise.resolve().then(load); }, [load]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return mailboxes.filter((item) => !term || `${item.address} ${item.display_name} ${item.planner_user_name}`.toLowerCase().includes(term));
  }, [mailboxes, search]);

  const active = mailboxes.filter((item) => item.is_active).length;

  // Crear o habilitar un buzón atiende la solicitud en el servidor; se recarga para reflejarlo.
  const refreshRequests = () => {
    api<MailboxRequest[]>("/admin/mailboxes/requests").then(setRequests).catch(() => undefined).finally(() => onRequestsChange?.());
  };

  const copy = (value: string) => {
    navigator.clipboard.writeText(value).then(() => setNotice(`Copiado: ${value}`)).catch(() => setNotice("No se pudo copiar."));
  };

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#1ec4ff]">Correo del equipo</p>
          <h1 className="text-2xl font-bold">Administración de correos</h1>
          <p className="mt-1 max-w-[62ch] text-sm text-[rgba(242,243,245,0.5)]">
            Crea direcciones @{domain || "tu dominio"} para los empleados del Planner. Cada uno lee y responde su correo en su Bandeja; desde aquí solo se administra.
          </p>
        </div>
        {!creating && (
          <button type="button" onClick={() => { setPreselectId(null); setCreating(true); }} className="inline-flex items-center gap-2 rounded-xl bg-[#1ec4ff] px-4 py-2.5 text-sm font-semibold text-[#080a0f] transition-[filter] hover:brightness-110">
            <Plus size={16} />Nuevo correo
          </button>
        )}
      </div>

      {requests.length > 0 && (
        <RequestsPanel
          requests={requests}
          onCreate={(request) => { setPreselectId(request.planner_user_id); setCreating(true); }}
          onResolved={(message) => { setNotice(message); load(); onRequestsChange?.(); }}
        />
      )}

      {creating && (
        <CreatePanel
          key={preselectId ?? "new"}
          domain={domain}
          preselectId={preselectId}
          onClose={() => setCreating(false)}
          onCreated={(mailbox) => { setCreating(false); setMailboxes((current) => [mailbox, ...current]); setNotice(enabledMessage(mailbox, `${mailbox.address} creado y habilitado.`)); refreshRequests(); }}
        />
      )}

      {error && <p className="mb-4 rounded-xl bg-[rgba(248,113,113,0.12)] p-3 text-sm text-[#f87171]">{error}</p>}
      {notice && <p role="status" className="mb-4 rounded-xl bg-[rgba(74,222,128,0.12)] p-3 text-sm text-[#4ade80]">{notice}</p>}

      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3 sm:px-5">
          <p className="text-[13px] text-[rgba(242,243,245,0.55)]">
            <span className="font-semibold text-[#f2f3f5]">{active}</span> activos
            {mailboxes.length - active > 0 && <> · {mailboxes.length - active} deshabilitados</>}
          </p>
          {mailboxes.length > 4 && (
            <label className="flex h-9 w-full items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 sm:w-64">
              <Search size={14} className="text-[rgba(242,243,245,0.35)]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar correo o persona" className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[rgba(242,243,245,0.3)]" />
            </label>
          )}
        </div>

        {loading ? (
          <div className="space-y-px">{[1, 2, 3].map((key) => <div key={key} className="h-[72px] animate-pulse bg-white/[0.02]" />)}</div>
        ) : mailboxes.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-[18px] font-semibold tracking-[-0.01em]">El equipo aún no tiene <Serif>correo</Serif></p>
            <p className="mx-auto mt-2 max-w-[44ch] text-[13px] leading-relaxed text-[rgba(242,243,245,0.45)]">Crea el primero con Nuevo correo. La persona lo verá en la Bandeja del Planner con su cuenta de siempre.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {filtered.map((mailbox) => (
              <MailboxRow
                key={`${mailbox.id}-${mailbox.updated_at}`}
                mailbox={mailbox}
                onCopy={copy}
                onChanged={(updated, message) => { setMailboxes((current) => current.map((item) => (item.id === updated.id ? updated : item))); setNotice(message); if (updated.is_active) refreshRequests(); }}
              />
            ))}
            {filtered.length === 0 && <p className="p-8 text-center text-[13px] text-[rgba(242,243,245,0.45)]">Nada coincide con “{search}”.</p>}
          </div>
        )}
      </div>
    </section>
  );
}
