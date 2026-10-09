"use client";

import { Fragment, useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, LoaderCircle, Plus, Trash2, X } from "lucide-react";
import { api, type EmailTemplate, type EmailTemplateInput, type SignatureCard, type SignatureStyle } from "@/lib/admin-api";
import { EmailFrame, Serif } from "./email-ui";

const HEX = /^#[0-9a-fA-F]{6}$/;
const URL_OK = /^https?:\/\/[^\s"'<>]+$/;
const EMAIL_OK = /^[^\s@"'<>]+@[^\s@"'<>]+\.[^\s@"'<>]{2,}$/;

const SAMPLE_BODY = `Hola Ana,

Gracias por escribirnos. Revisamos tu proyecto y te enviamos la **propuesta** con tiempos y presupuesto.

- Diseño y desarrollo web
- Integración con WhatsApp

Si tienes dudas, responde a este correo y te contestamos el mismo día.`;

const EMPTY_CARD: SignatureCard = { name: "", title: null, phone: null, email: null, website: null, address: null, tagline: null };

const TEKO_CARD: SignatureCard = {
  name: "Equipo TEKO",
  title: "Software que transforma negocios",
  phone: null,
  email: "ayuda-cliente@teko.do",
  website: "https://teko.do",
  address: "Santo Domingo, República Dominicana",
  tagline: "Software que *transforma*",
};

const TEKO_FOOTER = "Software que transforma negocios. Diseñamos, desarrollamos e implementamos soluciones digitales a medida.\nRecibes este correo por tu relación de servicio con TEKO.";

const TEKO_LINKS = [
  { label: "Servicios", url: "https://teko.do/servicios" },
  { label: "Portafolio", url: "https://teko.do/portafolio" },
  { label: "Instagram", url: "https://www.instagram.com/teko.dr/" },
];

export const NEW_TEMPLATE: EmailTemplateInput = {
  name: "Nueva plantilla",
  logo_url: "https://teko.do/email/teko-logo-white.png",
  header_background: "#0a0e1a",
  accent_color: "#0047ff",
  occasion: null,
  kicker: null,
  headline: null,
  button_label: null,
  button_url: null,
  signature: "Equipo TEKO\nSanto Domingo, República Dominicana",
  signature_style: "texto",
  signature_card: TEKO_CARD,
  footer_text: TEKO_FOOTER,
  social_links: TEKO_LINKS,
  is_default: false,
};

function occasionPreset(patch: Partial<EmailTemplateInput>): EmailTemplateInput {
  return { ...NEW_TEMPLATE, ...patch };
}

// Las mismas ocasiones que crea la migración; sirven de punto de partida.
const PRESETS: { key: string; label: string; template: EmailTemplateInput }[] = [
  { key: "bienvenida", label: "Bienvenida", template: occasionPreset({ name: "Bienvenida", occasion: "Bienvenida", kicker: "Nuevo cliente", headline: "Hoy empieza la *transformación* de tu negocio.", button_label: "Conoce al equipo", button_url: "https://teko.do/nosotros" }) },
  { key: "propuesta", label: "Propuesta", template: occasionPreset({ name: "Propuesta comercial", occasion: "Propuesta comercial", kicker: "Propuesta", headline: "Tu propuesta está *lista*.", button_label: "Agendar una llamada", button_url: "https://teko.do/contacto", signature_style: "completa" }) },
  { key: "reunion", label: "Reunión", template: occasionPreset({ name: "Reunión confirmada", occasion: "Reunión confirmada", kicker: "Sesión de descubrimiento", headline: "Nos vemos *pronto*.", signature_style: "compacta" }) },
  { key: "factura", label: "Factura", template: occasionPreset({ name: "Factura", occasion: "Factura", kicker: "Facturación", headline: "Tu factura está *disponible*." }) },
  { key: "entrega", label: "Entrega", template: occasionPreset({ name: "Proyecto entregado", occasion: "Lanzamiento", kicker: "Proyecto entregado", headline: "Tu proyecto ya está *en línea*.", button_label: "Ver nuestro portafolio", button_url: "https://teko.do/portafolio" }) },
  { key: "novedades", label: "Novedades", template: occasionPreset({ name: "Novedades", occasion: "Novedades", kicker: "Lo nuevo en TEKO", headline: "Lo que estamos *construyendo* este mes.", button_label: "Agenda una llamada", button_url: "https://teko.do/contacto", signature_style: "oscura", footer_text: "Software que transforma negocios. Diseñamos, desarrollamos e implementamos soluciones digitales a medida.\nRecibes este correo porque te suscribiste a las novedades de TEKO." }) },
];

const SIGNATURE_STYLES: { key: SignatureStyle; label: string; hint: string }[] = [
  { key: "texto", label: "Texto", hint: "Despedida simple con el isotipo" },
  { key: "completa", label: "Completa", hint: "Logo, datos y franja con frase" },
  { key: "oscura", label: "Oscura", hint: "Tarjeta azul noche" },
  { key: "compacta", label: "Compacta", hint: "Una línea, ideal para respuestas" },
];

const STYLE_LABEL: Record<SignatureStyle, string> = { texto: "Firma de texto", completa: "Firma completa", oscura: "Firma oscura", compacta: "Firma compacta" };

const inputClass = "h-9 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-[13.5px] text-[#f2f3f5] outline-none transition-colors placeholder:text-[rgba(242,243,245,0.3)] focus:border-[rgba(30,196,255,0.5)]";

function toInput(template: EmailTemplate | null): EmailTemplateInput {
  if (!template) return NEW_TEMPLATE;
  const { name, logo_url, header_background, accent_color, occasion, kicker, headline, button_label, button_url, signature, signature_style, signature_card, footer_text, social_links, is_default } = template;
  return {
    name, logo_url, header_background, accent_color,
    occasion: occasion ?? null, kicker: kicker ?? null, headline: headline ?? null,
    button_label: button_label ?? null, button_url: button_url ?? null,
    signature, signature_style: signature_style ?? "texto", signature_card: signature_card ?? null,
    footer_text, social_links, is_default,
  };
}

const clean = (value: string | null | undefined) => (value ?? "").trim() || null;

function cleanCard(card: SignatureCard | null): SignatureCard | null {
  if (!card) return null;
  const result: SignatureCard = {
    name: card.name.trim(),
    title: clean(card.title), phone: clean(card.phone), email: clean(card.email),
    website: clean(card.website), address: clean(card.address), tagline: clean(card.tagline),
  };
  return Object.values(result).some(Boolean) ? result : null;
}

function toPayload(form: EmailTemplateInput) {
  return {
    ...form,
    name: form.name.trim(),
    logo_url: clean(form.logo_url),
    occasion: clean(form.occasion),
    kicker: clean(form.kicker),
    headline: clean(form.headline),
    button_label: clean(form.button_label),
    button_url: clean(form.button_url),
    signature: clean(form.signature),
    signature_card: cleanCard(form.signature_card),
    footer_text: clean(form.footer_text),
  };
}

function validate(form: EmailTemplateInput) {
  if (!form.name.trim()) return "La plantilla necesita un nombre.";
  if (form.logo_url && !URL_OK.test(form.logo_url)) return "La URL del logo debe empezar con https://";
  if (!HEX.test(form.header_background) || !HEX.test(form.accent_color)) return "Los colores deben tener el formato #RRGGBB.";
  const label = clean(form.button_label);
  const url = clean(form.button_url);
  if (Boolean(label) !== Boolean(url)) return "El botón necesita texto y URL, o ninguno de los dos.";
  if (url && !URL_OK.test(url)) return "La URL del botón debe empezar con https://";
  if (form.signature_style !== "texto") {
    const card = cleanCard(form.signature_card);
    if (!card?.name) return "La firma necesita al menos un nombre.";
    if (card.email && !EMAIL_OK.test(card.email)) return "El correo de la firma no es válido.";
    if (card.website && !URL_OK.test(card.website)) return "La web de la firma debe empezar con https://";
  }
  const badLink = form.social_links.find((link) => !link.label.trim() || !URL_OK.test(link.url));
  if (badLink) return "Cada enlace necesita un nombre y una URL que empiece con https://";
  return "";
}

/** Muestra el titular como se verá: lo que va entre *asteriscos* en itálica serif. */
function HeadlinePreview({ text }: { text: string }) {
  const parts = text.split(/(\*[^*\s](?:[^*]*[^*\s])?\*)/g);
  return (
    <>
      {parts.map((part, index) => (part.startsWith("*") && part.endsWith("*") && part.length > 2
        ? <Serif key={index}>{part.slice(1, -1)}</Serif>
        : <Fragment key={index}>{part}</Fragment>))}
    </>
  );
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[rgba(242,243,245,0.4)]">{label}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-medium text-[rgba(242,243,245,0.72)]">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11.5px] leading-relaxed text-[rgba(242,243,245,0.4)]">{hint}</span>}
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

/** Miniatura de cada estilo de firma, dibujada con bloques planos. */
function SignatureThumb({ style }: { style: SignatureStyle }) {
  const line = "block h-[3px] rounded-full";
  if (style === "oscura") {
    return (
      <span className="flex h-full flex-col justify-center gap-1 rounded-md bg-[#0a0e1a] px-2 ring-1 ring-white/10">
        <span className="flex items-center justify-between"><span className={`${line} w-8 bg-white/80`} /><span className="h-1.5 w-3 rounded-sm bg-[#1ec4ff]/70" /></span>
        <span className={`${line} w-6 bg-[#bfe9ff]/60`} />
        <span className="my-0.5 block h-px bg-white/10" />
        <span className={`${line} w-10 bg-white/25`} />
      </span>
    );
  }
  if (style === "completa") {
    return (
      <span className="flex h-full flex-col justify-center gap-1 rounded-md bg-[#f4f6fa] px-2">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-5 rounded-sm bg-[#1ec4ff]/80" />
          <span className="h-5 w-px bg-[#d6dbe3]" />
          <span className="flex flex-col gap-0.5"><span className={`${line} w-7 bg-[#101828]/70`} /><span className={`${line} w-5 bg-[#0047ff]/60`} /><span className={`${line} w-8 bg-[#101828]/20`} /></span>
        </span>
        <span className="block h-1.5 rounded-sm bg-[#0a0e1a]" />
      </span>
    );
  }
  if (style === "compacta") {
    return (
      <span className="flex h-full items-center gap-1.5 rounded-md bg-[#f4f6fa] px-2">
        <span className="h-3 w-3 rounded-full bg-[#1ec4ff]/80" />
        <span className="flex flex-col gap-0.5 border-l-2 border-[#1ec4ff] pl-1.5"><span className={`${line} w-9 bg-[#101828]/70`} /><span className={`${line} w-12 bg-[#101828]/20`} /></span>
      </span>
    );
  }
  return (
    <span className="flex h-full flex-col justify-center gap-1 rounded-md bg-[#f4f6fa] px-2">
      <span className={`${line} w-8 bg-[#101828]/25`} />
      <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-[#1ec4ff]/80" /><span className="flex flex-col gap-0.5"><span className={`${line} w-7 bg-[#101828]/70`} /><span className={`${line} w-9 bg-[#101828]/20`} /></span></span>
    </span>
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
            Crea una plantilla para cada <Serif>ocasión</Serif>: bienvenida, propuesta, factura… Se aplica a los correos que envíes.
          </p>
        ) : (
          templates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${selectedId === template.id ? "bg-[rgba(30,196,255,0.09)]" : "hover:bg-white/[0.035]"}`}
            >
              <span aria-hidden="true" className="relative flex h-9 w-9 shrink-0 flex-col overflow-hidden rounded-lg border border-white/10 bg-white">
                <span className="relative h-[55%]" style={{ background: template.header_background }}>
                  <span className="absolute bottom-1 left-1.5 h-[3px] w-4 rounded-full" style={{ background: template.accent_color }} />
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-[14px] font-medium text-[#f2f3f5]">{template.name}</span>
                  {template.is_default && <span className="shrink-0 rounded-full bg-[rgba(30,196,255,0.12)] px-2 py-0.5 text-[10.5px] font-semibold text-[#1ec4ff]">Predeterminada</span>}
                </span>
                <span className="mt-0.5 block truncate text-[12.5px] text-[rgba(242,243,245,0.4)]">
                  {[template.occasion, STYLE_LABEL[template.signature_style ?? "texto"]].filter(Boolean).join(" · ")}
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
  const [preset, setPreset] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const invalid = validate(form);
  const set = (patch: Partial<EmailTemplateInput>) => setForm((current) => ({ ...current, ...patch }));
  const card = form.signature_card ?? EMPTY_CARD;
  const setCard = (patch: Partial<SignatureCard>) => set({ signature_card: { ...card, ...patch } });

  useEffect(() => {
    if (invalid) return;
    const timer = window.setTimeout(() => {
      api<{ html: string }>("/admin/emails/preview", {
        method: "POST",
        body: JSON.stringify({ subject: form.headline?.replace(/\*/g, "") || "Tu propuesta", body: SAMPLE_BODY, template: toPayload(form) }),
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
      const saved = await api<EmailTemplate>(template ? `/admin/email-templates/${template.id}` : "/admin/email-templates", {
        method: template ? "PUT" : "POST",
        body: JSON.stringify(toPayload(form)),
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

  const applyPreset = (key: string) => {
    const found = PRESETS.find((item) => item.key === key);
    if (!found) return;
    setPreset(key);
    setForm({ ...found.template, is_default: form.is_default });
  };

  const updateLink = (index: number, patch: Partial<{ label: string; url: string }>) =>
    set({ social_links: form.social_links.map((link, i) => (i === index ? { ...link, ...patch } : link)) });

  const style = form.signature_style;

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

      <div className="grid min-h-0 flex-1 overflow-y-auto @2xl:grid-cols-[minmax(300px,360px)_1fr] @2xl:overflow-hidden">
        <div className="space-y-8 border-white/[0.06] p-5 @2xl:overflow-y-auto @2xl:border-r">
          {error && <p role="alert" className="rounded-xl bg-[rgba(248,113,113,0.12)] px-3 py-2 text-[13px] text-[#f87171]">{error}</p>}

          {!template && (
            <div>
              <p className="mb-2.5 text-[12.5px] text-[rgba(242,243,245,0.6)]">Empieza desde una <Serif>ocasión</Serif></p>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => applyPreset(item.key)}
                    aria-pressed={preset === item.key}
                    className={`rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors ${preset === item.key ? "border-[#1ec4ff] bg-[rgba(30,196,255,0.1)] text-[#f2f3f5]" : "border-white/[0.1] text-[rgba(242,243,245,0.7)] hover:border-white/[0.2] hover:text-[#f2f3f5]"}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-white/[0.08] p-3.5">
            <span>
              <span className="block text-[13.5px] font-medium text-[#f2f3f5]">Usar en todos los correos nuevos</span>
              <span className="mt-0.5 block text-[12px] text-[rgba(242,243,245,0.45)]">Se selecciona sola al redactar. Puedes cambiarla en cada correo.</span>
            </span>
            <input type="checkbox" checked={form.is_default} onChange={(event) => set({ is_default: event.target.checked })} className="peer sr-only" />
            <span aria-hidden="true" className="relative mt-0.5 h-5 w-9 shrink-0 rounded-full bg-white/[0.12] transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-[#f2f3f5] after:transition-transform peer-checked:bg-[#1ec4ff] peer-checked:after:translate-x-4 peer-focus-visible:outline-2 peer-focus-visible:outline-[#1ec4ff]" />
          </label>

          <Group label="Identidad">
            <Field label="Nombre" hint="Solo lo ves tú, al elegir la plantilla.">
              <input value={form.name} onChange={(event) => set({ name: event.target.value })} className={inputClass} />
            </Field>
            <Field label="Logo" hint="URL pública en PNG o JPG. Los SVG no se ven en Gmail. Sobre cabecera oscura usa el logo blanco.">
              <span className="flex items-center gap-2">
                <span className="grid h-9 w-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/[0.08]" style={{ background: HEX.test(form.header_background) ? form.header_background : "#080a0f" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {form.logo_url && URL_OK.test(form.logo_url) ? <img src={form.logo_url} alt="" className="max-h-6 max-w-[52px] object-contain" /> : <span className="text-[10px] text-[rgba(242,243,245,0.4)]">Sin logo</span>}
                </span>
                <input value={form.logo_url ?? ""} onChange={(event) => set({ logo_url: event.target.value })} placeholder="https://" spellCheck={false} className={inputClass} />
              </span>
            </Field>
          </Group>

          <Group label="Cabecera">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Ocasión" hint="Arriba a la derecha.">
                <input value={form.occasion ?? ""} onChange={(event) => set({ occasion: event.target.value })} placeholder="Bienvenida" maxLength={40} className={inputClass} />
              </Field>
              <Field label="Antetítulo" hint="Sobre el titular.">
                <input value={form.kicker ?? ""} onChange={(event) => set({ kicker: event.target.value })} placeholder="Nuevo cliente" maxLength={80} className={inputClass} />
              </Field>
            </div>
            <Field
              label="Titular"
              hint={form.headline?.includes("*")
                ? <>Se verá: <span className="text-[rgba(242,243,245,0.75)]"><HeadlinePreview text={form.headline} /></span></>
                : <>Pon una palabra entre *asteriscos* para mostrarla en <Serif>itálica</Serif>. Solo una por titular.</>}
            >
              <input value={form.headline ?? ""} onChange={(event) => set({ headline: event.target.value })} placeholder="Hoy empieza la *transformación* de tu negocio." maxLength={160} className={inputClass} />
            </Field>
            <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-2">
              <Field label="Botón">
                <input value={form.button_label ?? ""} onChange={(event) => set({ button_label: event.target.value })} placeholder="Ver propuesta" maxLength={40} className={inputClass} />
              </Field>
              <Field label="Enlace del botón">
                <input value={form.button_url ?? ""} onChange={(event) => set({ button_url: event.target.value })} placeholder="https://" spellCheck={false} className={inputClass} />
              </Field>
            </div>
            <p className="text-[11.5px] leading-relaxed text-[rgba(242,243,245,0.4)]">Deja vacío lo que no uses: sin titular ni botón, la cabecera muestra solo el logo.</p>
          </Group>

          <Group label="Colores">
            <div className="grid grid-cols-2 gap-3">
              <ColorField label="Cabecera" value={form.header_background} onChange={(header_background) => set({ header_background })} />
              <ColorField label="Acento" value={form.accent_color} onChange={(accent_color) => set({ accent_color })} />
            </div>
            <p className="text-[11.5px] leading-relaxed text-[rgba(242,243,245,0.4)]">El acento se usa en enlaces y detalles. Si es muy claro, se oscurece solo para que se lea sobre blanco.</p>
          </Group>

          <Group label="Firma">
            <div role="radiogroup" aria-label="Estilo de firma" className="grid grid-cols-2 gap-2">
              {SIGNATURE_STYLES.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  role="radio"
                  aria-checked={style === item.key}
                  onClick={() => set({ signature_style: item.key, signature_card: item.key !== "texto" && !cleanCard(form.signature_card) ? TEKO_CARD : form.signature_card })}
                  className={`rounded-xl border p-2 text-left transition-colors ${style === item.key ? "border-[#1ec4ff] bg-[rgba(30,196,255,0.06)]" : "border-white/[0.08] hover:border-white/[0.16]"}`}
                >
                  <span className="block h-11"><SignatureThumb style={item.key} /></span>
                  <span className="mt-2 block text-[12.5px] font-medium text-[#f2f3f5]">{item.label}</span>
                  <span className="block text-[11px] leading-snug text-[rgba(242,243,245,0.45)]">{item.hint}</span>
                </button>
              ))}
            </div>

            {style === "texto" ? (
              <Field label="Texto de la firma" hint="La primera línea va en negrita junto al isotipo. Si empieza con una despedida como «Un saludo,», va encima.">
                <textarea rows={3} value={form.signature ?? ""} onChange={(event) => set({ signature: event.target.value })} className={`${inputClass} h-auto py-2 leading-relaxed`} />
              </Field>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Nombre">
                    <input value={card.name} onChange={(event) => setCard({ name: event.target.value })} placeholder="John Marte" maxLength={80} className={inputClass} />
                  </Field>
                  <Field label="Cargo">
                    <input value={card.title ?? ""} onChange={(event) => setCard({ title: event.target.value })} placeholder="Fundador" maxLength={80} className={inputClass} />
                  </Field>
                  <Field label="Correo">
                    <input value={card.email ?? ""} onChange={(event) => setCard({ email: event.target.value })} placeholder="nombre@teko.do" type="email" spellCheck={false} className={inputClass} />
                  </Field>
                  <Field label="Teléfono">
                    <input value={card.phone ?? ""} onChange={(event) => setCard({ phone: event.target.value })} placeholder="+1 (809) 000-0000" maxLength={40} className={inputClass} />
                  </Field>
                </div>
                <Field label="Web">
                  <input value={card.website ?? ""} onChange={(event) => setCard({ website: event.target.value })} placeholder="https://teko.do" spellCheck={false} className={inputClass} />
                </Field>
                {style === "completa" && (
                  <>
                    <Field label="Dirección">
                      <input value={card.address ?? ""} onChange={(event) => setCard({ address: event.target.value })} placeholder="Santo Domingo, República Dominicana" maxLength={160} className={inputClass} />
                    </Field>
                    <Field label="Frase de la franja" hint="Usa *asteriscos* para la palabra en itálica. Las redes se muestran a la derecha.">
                      <input value={card.tagline ?? ""} onChange={(event) => setCard({ tagline: event.target.value })} placeholder="Software que *transforma*" maxLength={80} className={inputClass} />
                    </Field>
                  </>
                )}
                <p className="text-[11.5px] leading-relaxed text-[rgba(242,243,245,0.4)]">Cuando envía un buzón del Planner con firma propia, se usa su firma de texto en lugar de esta tarjeta.</p>
              </div>
            )}
          </Group>

          <Group label="Pie y enlaces">
            <Field label="Pie de página" hint="Texto pequeño al final: descripción, dirección o aviso legal. Cada línea va aparte.">
              <textarea rows={3} value={form.footer_text ?? ""} onChange={(event) => set({ footer_text: event.target.value })} className={`${inputClass} h-auto py-2 leading-relaxed`} />
            </Field>
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
          <div className="mx-auto max-w-[680px]">
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
    </div>
  );
}
