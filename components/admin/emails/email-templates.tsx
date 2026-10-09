"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, LoaderCircle, Plus, Trash2, X } from "lucide-react";
import { api, type EmailTemplate, type EmailTemplateInput } from "@/lib/admin-api";
import { EmailFrame, Serif } from "./email-ui";

const HEX = /^#[0-9a-fA-F]{6}$/;
const URL_OK = /^https?:\/\/[^\s"'<>]+$/;

const SAMPLE_BODY = `Hola Ana,

Gracias por escribirnos. Revisamos tu proyecto y te enviamos la **propuesta** con tiempos y presupuesto.

- Diseño y desarrollo web
- Integración con WhatsApp

Si tienes dudas, responde a este correo y te contestamos el mismo día.`;

export const NEW_TEMPLATE: EmailTemplateInput = {
  name: "Nueva plantilla",
  logo_url: "https://teko.do/LogoTeko.png",
  header_background: "#080a0f",
  accent_color: "#1ec4ff",
  signature: "Un saludo,\nEl equipo de TEKO",
  footer_text: "",
  social_links: [],
  is_default: false,
};

const inputClass = "h-9 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-[13.5px] text-[#f2f3f5] outline-none transition-colors placeholder:text-[rgba(242,243,245,0.3)] focus:border-[rgba(30,196,255,0.5)]";

function toInput(template: EmailTemplate | null): EmailTemplateInput {
  if (!template) return NEW_TEMPLATE;
  const { name, logo_url, header_background, accent_color, signature, footer_text, social_links, is_default } = template;
  return { name, logo_url, header_background, accent_color, signature, footer_text, social_links, is_default };
}

function validate(form: EmailTemplateInput) {
  if (!form.name.trim()) return "La plantilla necesita un nombre.";
  if (form.logo_url && !URL_OK.test(form.logo_url)) return "La URL del logo debe empezar con https://";
  if (!HEX.test(form.header_background) || !HEX.test(form.accent_color)) return "Los colores deben tener el formato #RRGGBB.";
  const badLink = form.social_links.find((link) => !link.label.trim() || !URL_OK.test(link.url));
  if (badLink) return "Cada enlace necesita un nombre y una URL que empiece con https://";
  return "";
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[rgba(242,243,245,0.4)]">{label}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-medium text-[rgba(242,243,245,0.72)]">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11.5px] text-[rgba(242,243,245,0.4)]">{hint}</span>}
    </label>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <Field label={label}>
      <span className="flex items-center gap-2">
        <input type="color" value={HEX.test(value) ? value : "#000000"} onChange={(event) => onChange(event.target.value)} aria-label={`${label}, selector`} className="h-9 w-10 shrink-0 cursor-pointer rounded-lg border border-white/[0.08] bg-transparent p-1" />
        <input value={value} onChange={(event) => onChange(event.target.value)} maxLength={7} spellCheck={false} className={`${inputClass} font-mono uppercase`} />
      </span>
    </Field>
  );
}

export function TemplateList({ templates, selectedId, onSelect, onCreate, loading, folderTabs }: {
  templates: EmailTemplate[];
  selectedId: number | "new" | null;
  onSelect: (template: EmailTemplate) => void;
  onCreate: () => void;
  loading: boolean;
  folderTabs: ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 space-y-3 border-b border-white/[0.06] p-3">
        {folderTabs}
        <button type="button" onClick={onCreate} className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/[0.14] text-[13px] font-medium text-[rgba(242,243,245,0.72)] transition-colors hover:border-[rgba(30,196,255,0.5)] hover:text-[#f2f3f5]">
          <Plus size={15} />Nueva plantilla
        </button>
      </div>
      <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto p-2">
        {loading ? (
          [1, 2].map((key) => <div key={key} className="m-1 h-16 animate-pulse rounded-xl bg-white/[0.04]" />)
        ) : templates.length === 0 ? (
          <p className="px-4 pt-16 text-center text-[13px] leading-relaxed text-[rgba(242,243,245,0.45)]">
            Crea una plantilla con tu logo, firma y redes. Se aplica a cada correo que envíes.
          </p>
        ) : (
          templates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${selectedId === template.id ? "bg-[rgba(30,196,255,0.09)]" : "hover:bg-white/[0.035]"}`}
            >
              <span aria-hidden="true" className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-white/10" style={{ background: template.header_background }}>
                <span className="absolute bottom-1.5 right-1.5 h-2 w-2 rounded-full" style={{ background: template.accent_color }} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-[14px] font-medium text-[#f2f3f5]">{template.name}</span>
                  {template.is_default && <span className="shrink-0 rounded-full bg-[rgba(30,196,255,0.12)] px-2 py-0.5 text-[10.5px] font-semibold text-[#1ec4ff]">Predeterminada</span>}
                </span>
                <span className="mt-0.5 block truncate text-[12.5px] text-[rgba(242,243,245,0.4)]">
                  {template.social_links.length ? template.social_links.map((link) => link.label).join(" · ") : "Sin enlaces"}
                </span>
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export function TemplateEditor({ template, onSaved, onDeleted, onBack }: {
  template: EmailTemplate | null;
  onSaved: (template: EmailTemplate) => void;
  onDeleted: (id: number) => void;
  onBack: () => void;
}) {
  const initial = useMemo(() => toInput(template), [template]);
  const [form, setForm] = useState<EmailTemplateInput>(initial);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const invalid = validate(form);
  const set = (patch: Partial<EmailTemplateInput>) => setForm((current) => ({ ...current, ...patch }));

  useEffect(() => {
    if (invalid) return;
    const timer = window.setTimeout(() => {
      const templateData = {
        name: form.name,
        logo_url: form.logo_url || null,
        header_background: form.header_background,
        accent_color: form.accent_color,
        signature: form.signature,
        footer_text: form.footer_text,
        social_links: form.social_links,
      };
      api<{ html: string }>("/admin/emails/preview", {
        method: "POST",
        body: JSON.stringify({ subject: "Tu propuesta", body: SAMPLE_BODY, template: templateData }),
      }).then((result) => setPreviewHtml(result.html)).catch(() => undefined);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [form, invalid]);

  const save = async () => {
    if (saving) return;
    if (invalid) { setError(invalid); return; }
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, name: form.name.trim(), logo_url: form.logo_url || null, signature: form.signature || null, footer_text: form.footer_text || null };
      const saved = await api<EmailTemplate>(template ? `/admin/email-templates/${template.id}` : "/admin/email-templates", {
        method: template ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      onSaved(saved);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!template) return;
    try {
      await api(`/admin/email-templates/${template.id}`, { method: "DELETE" });
      onDeleted(template.id);
    } catch (e) {
      setError((e as Error).message);
      setConfirmDelete(false);
    }
  };

  const updateLink = (index: number, patch: Partial<{ label: string; url: string }>) =>
    set({ social_links: form.social_links.map((link, i) => (i === index ? { ...link, ...patch } : link)) });

  return (
    <div className="@container flex h-full min-h-0 flex-col">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-white/[0.06] px-3">
        <button type="button" onClick={onBack} aria-label="Volver a plantillas" className="grid h-8 w-8 place-items-center rounded-lg text-[rgba(242,243,245,0.6)] hover:bg-white/[0.06] lg:hidden">
          <ArrowLeft size={17} />
        </button>
        <div className="min-w-0 flex-1 px-1">
          <p className="truncate text-[14.5px] font-semibold text-[#f2f3f5]">{form.name || "Sin nombre"}</p>
          <p className="text-[12px] text-[rgba(242,243,245,0.45)]">{dirty ? "Cambios sin guardar" : template ? "Guardada" : "Plantilla nueva"}</p>
        </div>
        {template && (confirmDelete ? (
          <span className="flex items-center gap-1.5 text-[12.5px] text-[rgba(242,243,245,0.7)]">
            ¿Eliminar?
            <button type="button" onClick={remove} className="rounded-lg bg-[rgba(248,113,113,0.14)] px-2.5 py-1.5 font-semibold text-[#f87171]">Sí, eliminar</button>
            <button type="button" onClick={() => setConfirmDelete(false)} className="rounded-lg px-2 py-1.5 hover:bg-white/[0.06]">No</button>
          </span>
        ) : (
          <button type="button" onClick={() => setConfirmDelete(true)} title="Eliminar plantilla" aria-label="Eliminar plantilla" className="grid h-8 w-8 place-items-center rounded-lg text-[rgba(242,243,245,0.5)] hover:bg-[rgba(248,113,113,0.12)] hover:text-[#f87171]">
            <Trash2 size={15} />
          </button>
        ))}
        <button type="button" onClick={save} disabled={saving || (!dirty && Boolean(template))} className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1ec4ff] px-4 text-[13.5px] font-semibold text-[#080a0f] transition-[filter,opacity] hover:brightness-110 disabled:opacity-40">
          {saving && <LoaderCircle size={15} className="animate-spin" />}
          {template ? "Guardar" : "Crear plantilla"}
        </button>
      </div>

      <div className="grid min-h-0 flex-1 overflow-y-auto @2xl:grid-cols-[minmax(280px,340px)_1fr] @2xl:overflow-hidden">
        <div className="space-y-8 border-white/[0.06] p-5 @2xl:overflow-y-auto @2xl:border-r">
          {error && <p role="alert" className="rounded-lg bg-[rgba(248,113,113,0.12)] px-3 py-2 text-[13px] text-[#f87171]">{error}</p>}

          <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-white/[0.08] p-3.5">
            <span>
              <span className="block text-[13.5px] font-medium text-[#f2f3f5]">Usar en todos los correos nuevos</span>
              <span className="mt-0.5 block text-[12px] text-[rgba(242,243,245,0.45)]">Se selecciona sola al redactar. Puedes cambiarla en cada correo.</span>
            </span>
            <input type="checkbox" checked={form.is_default} onChange={(event) => set({ is_default: event.target.checked })} className="peer sr-only" />
            <span aria-hidden="true" className="relative mt-0.5 h-5 w-9 shrink-0 rounded-full bg-white/[0.12] transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-[#f2f3f5] after:transition-transform peer-checked:bg-[#1ec4ff] peer-checked:after:translate-x-4 peer-focus-visible:outline-2 peer-focus-visible:outline-[#1ec4ff]" />
          </label>

          <Group label="Identidad">
            <Field label="Nombre">
              <input value={form.name} onChange={(event) => set({ name: event.target.value })} className={inputClass} />
            </Field>
            <Field label="Logo" hint="URL pública en PNG o JPG. Los SVG no se ven en Gmail.">
              <span className="flex items-center gap-2">
                <span className="grid h-9 w-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/[0.08]" style={{ background: HEX.test(form.header_background) ? form.header_background : "#080a0f" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {form.logo_url && URL_OK.test(form.logo_url) ? <img src={form.logo_url} alt="" className="max-h-6 max-w-[52px] object-contain" /> : <span className="text-[10px] text-[rgba(242,243,245,0.4)]">Sin logo</span>}
                </span>
                <input value={form.logo_url ?? ""} onChange={(event) => set({ logo_url: event.target.value })} placeholder="https://" spellCheck={false} className={inputClass} />
              </span>
            </Field>
          </Group>

          <Group label="Colores">
            <div className="grid grid-cols-2 gap-3">
              <ColorField label="Encabezado" value={form.header_background} onChange={(header_background) => set({ header_background })} />
              <ColorField label="Acento" value={form.accent_color} onChange={(accent_color) => set({ accent_color })} />
            </div>
            <p className="text-[11.5px] leading-relaxed text-[rgba(242,243,245,0.4)]">El acento se usa en los enlaces. Si es muy claro, se oscurece solo para que se lea sobre blanco.</p>
          </Group>

          <Group label="Firma y pie">
            <Field label="Firma" hint="Va debajo de cada mensaje.">
              <textarea rows={3} value={form.signature ?? ""} onChange={(event) => set({ signature: event.target.value })} className={`${inputClass} h-auto py-2 leading-relaxed`} />
            </Field>
            <Field label="Pie de página" hint="Texto pequeño al final: dirección, aviso legal o eslogan.">
              <textarea rows={2} value={form.footer_text ?? ""} onChange={(event) => set({ footer_text: event.target.value })} className={`${inputClass} h-auto py-2 leading-relaxed`} />
            </Field>
          </Group>

          <Group label="Redes y enlaces">
            {form.social_links.map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <input value={link.label} onChange={(event) => updateLink(index, { label: event.target.value })} placeholder="Instagram" aria-label="Nombre del enlace" className={`${inputClass} w-[38%]`} />
                <input value={link.url} onChange={(event) => updateLink(index, { url: event.target.value })} placeholder="https://" aria-label="URL del enlace" spellCheck={false} className={inputClass} />
                <button type="button" onClick={() => set({ social_links: form.social_links.filter((_, i) => i !== index) })} aria-label="Quitar enlace" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[rgba(242,243,245,0.45)] hover:bg-white/[0.06] hover:text-[#f2f3f5]">
                  <X size={15} />
                </button>
              </div>
            ))}
            {form.social_links.length < 8 && (
              <button type="button" onClick={() => set({ social_links: [...form.social_links, { label: "", url: "https://" }] })} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] font-medium text-[#1ec4ff] hover:bg-[rgba(30,196,255,0.08)]">
                <Plus size={14} />Agregar enlace
              </button>
            )}
          </Group>
        </div>

        <div className="border-t border-white/[0.06] bg-[#0a0d13] p-5 @2xl:overflow-y-auto @2xl:border-t-0">
          <p className="mb-3 text-[13px] text-[rgba(242,243,245,0.5)]">Así lo <Serif>verán</Serif> tus clientes</p>
          {invalid ? (
            <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-[13px] text-[rgba(242,243,245,0.5)]">{invalid}</p>
          ) : previewHtml ? (
            <EmailFrame html={previewHtml} title="Vista previa de la plantilla" minHeight={520} />
          ) : (
            <div className="h-[520px] animate-pulse rounded-xl bg-white/[0.04]" />
          )}
        </div>
      </div>
    </div>
  );
}
