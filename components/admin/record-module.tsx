"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Pencil, Plus, Search, X } from "lucide-react";
import { api, type AdminRecord, type RecordValue } from "@/lib/admin-api";
import type { Field, ModuleConfig } from "./cms-config";

const emptyValue = (field: Field): RecordValue => field.type === "checkbox" ? true : field.type === "number" ? null : field.key === "currency" ? "USD" : field.key === "type" ? "service" : "";

function toForm(record: AdminRecord | null, fields: Field[]) {
  return Object.fromEntries(fields.map((field) => {
    const value = record?.[field.key] ?? emptyValue(field);
    return [field.key, field.key === "features" && Array.isArray(value) ? value.map((item) => item.text).join("\n") : value];
  })) as Record<string, RecordValue>;
}

export function RecordModule({ config }: { config: ModuleConfig }) {
  const [records, setRecords] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState<AdminRecord | null | undefined>();
  const load = useCallback(() => { setLoading(true); setError(""); api<AdminRecord[]>(config.endpoint).then(setRecords).catch((e: Error) => setError(e.message)).finally(() => setLoading(false)); }, [config.endpoint]);
  useEffect(() => { Promise.resolve().then(load); }, [load]);
  const filtered = useMemo(() => records.filter((record) => JSON.stringify(record).toLowerCase().includes(search.toLowerCase())), [records, search]);
  return <section>
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-[var(--brand)]">Contenido</p><h1 className="text-2xl font-bold text-[var(--text-primary)]">{config.label}</h1><p className="text-sm text-[var(--text-tertiary)]">{records.length} Registros guardados</p></div>
      <button onClick={() => setEditing(null)} className="flex items-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-hover)]"><Plus size={16}/>Crear {config.singular}</button></div>
    <div className="mb-4 flex items-center gap-2 rounded-xl border border-[var(--border-input)] bg-[var(--bg-surface)] px-3"><Search size={16} className="text-[var(--text-muted)]"/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar…" className="w-full bg-transparent py-3 text-sm outline-none"/></div>
    {success && <p className="mb-4 rounded-xl bg-[var(--accent-green-bg)] p-3 text-sm text-[var(--accent-green)]">{success}</p>}
    {error && <ErrorBox message={error} retry={load}/>} {loading ? <Skeleton/> : filtered.length === 0 ? <Empty/> : <div className="overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-[0_8px_30px_var(--shadow-color)]"><div className="divide-y divide-[var(--border-subtle)]">{filtered.map((record) => <article key={record.id} className="flex items-center justify-between gap-4 p-4 hover:bg-[var(--bg-hover)]"><div className="min-w-0"><h2 className="truncate font-semibold text-[var(--text-primary)]">{String(record[config.titleKey] ?? `#${record.id}`)}</h2><p className="mt-1 text-xs text-[var(--text-tertiary)]">ID {record.id} · Orden {String(record.sort_order ?? "—")}</p></div><div className="flex items-center gap-3">{typeof record.is_active === "boolean" && <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${record.is_active ? "bg-[var(--accent-green-bg)] text-[var(--accent-green)]" : "bg-[var(--bg-muted)] text-[var(--text-tertiary)]"}`}>{record.is_active ? "Activo" : "Inactivo"}</span>}<button onClick={() => { setSuccess(""); setEditing(record); }} aria-label="Editar" className="rounded-lg border border-[var(--border-default)] p-2 hover:bg-[var(--bg-muted)]"><Pencil size={15}/></button></div></article>)}</div></div>}
    {editing !== undefined && <RecordDialog config={config} record={editing} onClose={() => setEditing(undefined)} onSaved={() => { setEditing(undefined); setSuccess(`${config.singular} guardado correctamente.`); load(); }}/>} </section>;
}

function RecordDialog({ config, record, onClose, onSaved }: { config: ModuleConfig; record: AdminRecord | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState(() => toForm(record, config.fields)); const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  const [relationOptions, setRelationOptions] = useState<Record<string, Array<{ value: string; label: string }>>>({});
  useEffect(() => {
    const relationFields = config.fields.filter((field) => field.relation);
    Promise.all(relationFields.map(async (field) => {
      const relation = field.relation!;
      const rows = await api<AdminRecord[]>(relation.endpoint);
      const options = rows.map((row) => ({ value: String(row.id), label: String(row[relation.labelKey]) }));
      if (relation.emptyLabel) options.unshift({ value: "", label: relation.emptyLabel });
      return [field.key, options] as const;
    })).then((entries) => setRelationOptions(Object.fromEntries(entries))).catch((cause: Error) => setError(cause.message));
  }, [config.fields]);
  const submit = async (event: React.FormEvent) => { event.preventDefault(); if (saving) return; setSaving(true); setError("");
    const payload = Object.fromEntries(config.fields.map((field) => { let value = form[field.key]; if (field.type === "number" || field.relation) value = value === "" || value === null ? null : Number(value); if (field.key === "features") value = String(value).split("\n").map((text) => text.trim()).filter(Boolean).map((text, index) => ({ text, sort_order: index })); return [field.key, value]; }));
    try { await api(record ? `${config.endpoint}/${record.id}` : config.endpoint, { method: record ? "PUT" : "POST", body: JSON.stringify(payload) }); onSaved(); } catch (e) { setError((e as Error).message); } finally { setSaving(false); }
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--shadow-overlay)] p-4" role="dialog" aria-modal="true"><form onSubmit={submit} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-[var(--bg-surface)] p-6 shadow-2xl"><div className="mb-6 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">{record ? "Editar" : "Nuevo registro"}</p><h2 className="text-xl font-bold">{record ? String(record[config.titleKey]) : config.singular}</h2></div><button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-[var(--bg-muted)]"><X/></button></div>{error && <p className="mb-4 rounded-lg bg-[var(--accent-red-bg)] p-3 text-sm text-[var(--accent-red)]">{error}</p>}<div className="grid gap-4 sm:grid-cols-2">{config.fields.map((field) => <FieldInput key={field.key} field={field} value={form[field.key]} options={relationOptions[field.key]} onChange={(value) => setForm((old) => ({ ...old, [field.key]: value }))}/>)}</div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-xl border px-4 py-2.5 text-sm">Cancelar</button><button disabled={saving} className="rounded-xl bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Guardando…" : "Guardar cambios"}</button></div></form></div>;
}

function FieldInput({ field, value, options, onChange }: { field: Field; value: RecordValue; options?: Array<{ value: string; label: string }>; onChange: (value: RecordValue) => void }) { const cls = "mt-1 w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)]"; if (field.type === "checkbox") return <label className="flex items-center gap-3 self-end rounded-xl border p-3 text-sm"><input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)}/><Check size={15}/>{field.label}</label>; const selectOptions = options ?? field.options; return <label className={field.type === "textarea" ? "sm:col-span-2 text-sm font-medium" : "text-sm font-medium"}>{field.label}{field.type === "textarea" ? <textarea required={field.required} rows={4} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={cls}/> : field.type === "select" ? <select required={field.required} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={cls}><option value="" disabled={field.required}>{options ? "Selecciona una categoría" : "Selecciona una opción"}</option>{selectOptions?.map((o) => <option key={o.value || "empty"} value={o.value}>{o.label}</option>)}</select> : <input required={field.required} type={field.type ?? "text"} step={field.type === "number" ? "any" : undefined} value={value === null ? "" : String(value)} onChange={(e) => onChange(e.target.value)} className={cls}/>}</label>; }
function ErrorBox({ message, retry }: { message: string; retry: () => void }) { return <div className="rounded-xl border border-[var(--accent-red-border)] bg-[var(--accent-red-bg)] p-5 text-sm text-[var(--accent-red)]">{message} <button onClick={retry} className="ml-2 underline">Reintentar</button></div>; }
function Skeleton() { return <div className="space-y-3">{[1,2,3].map((n) => <div key={n} className="h-20 animate-pulse rounded-xl bg-[var(--bg-muted)]"/>)}</div>; }
function Empty() { return <div className="rounded-2xl border border-dashed border-[var(--dashed-border)] p-12 text-center text-sm text-[var(--text-tertiary)]">No hay registros que mostrar.</div>; }
