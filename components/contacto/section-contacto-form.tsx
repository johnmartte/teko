"use client";

import CustomSelect, { type SelectOption } from "./custom-select";
import { useEffect, useRef, useState } from "react";
import { Mail, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ApiErrorToast from "@/components/ui/api-error-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL no está definida");
}

gsap.registerPlugin(ScrollTrigger);

export default function SectionContactoForm() {
  const [serviceOptions, setServiceOptions] = useState<SelectOption[]>([]);
  const [budgetOptions, setBudgetOptions] = useState<SelectOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    service_id: "",
    budget_range_id: "",
    message: "",
  });

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-info", {
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: ".contact-info",
          start: "top 90%",
          once: true,
        },
      });
      gsap.from(".contact-form", {
        x: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: ".contact-form",
          start: "top 90%",
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    async function loadOptions() {
      try {
        const [servicesRes, budgetsRes] = await Promise.all([
          fetch(`${API_URL}/services`),
          fetch(`${API_URL}/budget-ranges`),
        ]);

        const services = await servicesRes.json();
        const budgets = await budgetsRes.json();

        setServiceOptions(
          services.map((service: { id: number; title: string }) => ({
            value: String(service.id),
            label: service.title,
          })),
        );

        setBudgetOptions(
          budgets.map((budget: { id: number; label: string }) => ({
            value: String(budget.id),
            label: budget.label,
          })),
        );
      } finally {
        setLoadingOptions(false);
      }
    }

    loadOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      email: form.email,
      company: form.company || null,
      phone: null,
      service_id: Number(form.service_id),
      budget_range_id: form.budget_range_id ? Number(form.budget_range_id) : null,
      message: form.message,
    };

    const res = await fetch(`${API_URL}/contact-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setSubmitError(true);
      return;
    }

    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setForm({
      name: "",
      email: "",
      company: "",
      service_id: "",
      budget_range_id: "",
      message: "",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="px-6 py-14 md:px-[100px] md:py-20"
      style={{ color: "#f2f3f5" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[380px_1fr] lg:gap-16">
          {/* Info lateral */}
          <aside className="contact-info">
            <div
              className="rounded-[20px] border p-6 md:p-8"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
              }}
            >
              <h2 className="mb-6 text-[24px] font-bold">Hablemos directo</h2>

              <div className="mb-8 flex flex-col gap-5">
                <a
                  href="mailto:john.marte@unicaribe.edu.do"
                  className="flex items-start gap-3 transition-opacity hover:opacity-80"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full" style={{ background: "rgba(30,196,255,0.15)" }}>
                    <Mail className="h-4 w-4" style={{ color: "#1ec4ff" }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "rgba(242,243,245,0.5)" }}>
                      Email
                    </p>
                    <p className="break-all text-[13px] font-medium md:text-[14px]">
                      ayuda-cliente@teko.do
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full" style={{ background: "rgba(30,196,255,0.15)" }}>
                    <MapPin className="h-4 w-4" style={{ color: "#1ec4ff" }} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "rgba(242,243,245,0.5)" }}>
                      Ubicación
                    </p>
                    <p className="text-[14px] font-medium">
                      US + LATAM
                      <br />
                      <span style={{ color: "rgba(242,243,245,0.55)" }}>Remote first</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full" style={{ background: "rgba(30,196,255,0.15)" }}>
                    <Clock className="h-4 w-4" style={{ color: "#1ec4ff" }} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "rgba(242,243,245,0.5)" }}>
                      Respuesta
                    </p>
                    <p className="text-[14px] font-medium">
                      &lt; 24 horas laborales
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border p-5" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
                <p className="text-[13px] leading-[20px]" style={{ color: "rgba(242,243,245,0.7)" }}>
                  ¿Prefieres una llamada?{" "}
                  <a
                    href="mailto:john.marte@unicaribe.edu.do?subject=Agenda%20una%20llamada"
                    className="font-semibold underline"
                    style={{ color: "#1ec4ff" }}
                  >
                    Agenda 30 min
                  </a>{" "}
                  — sin compromiso.
                </p>
              </div>
            </div>
          </aside>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="contact-form rounded-[20px] border p-6 md:p-8"
            style={{
              borderColor: "rgba(255,255,255,0.1)",
              background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
            }}
          >
            {sent ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                <CheckCircle2 className="mb-4 h-16 w-16" style={{ color: "#1ec4ff" }} strokeWidth={1.5} />
                <h3 className="mb-2 text-[24px] font-bold">
                  Mensaje enviado
                </h3>
                <p className="max-w-[360px] text-[14px]" style={{ color: "rgba(242,243,245,0.55)" }}>
                  Gracias por escribirnos. Te contactamos en menos de 24 horas
                  laborales.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Nombre *" htmlFor="name">
                  <input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="tk-input"
                    placeholder="John Doe"
                  />
                </Field>

                <Field label="Email *" htmlFor="email">
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="tk-input"
                    placeholder="tu@empresa.com"
                  />
                </Field>

                <Field label="Empresa" htmlFor="company" full>
                  <input
                    id="company"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="tk-input"
                    placeholder="Nombre de tu negocio o startup"
                  />
                </Field>

                <Field label="¿Qué necesitas? *" htmlFor="service">
                  <CustomSelect
                    id="service"
                    required
                    value={form.service_id}
                    onChange={(v) => setForm({ ...form, service_id: v })}
                    options={serviceOptions}
                    placeholder={loadingOptions ? "Cargando..." : "Selecciona..."}
                  />
                </Field>

                <Field label="Presupuesto" htmlFor="budget">
                  <CustomSelect
                    id="budget"
                    value={form.budget_range_id}
                    onChange={(v) => setForm({ ...form, budget_range_id: v })}
                    options={budgetOptions}
                    placeholder={loadingOptions ? "Cargando..." : "Selecciona..."}
                  />
                </Field>

                <Field label="Cuéntanos sobre el proyecto *" htmlFor="message" full>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="tk-input resize-none"
                    style={{ height: "auto", paddingTop: "12px", paddingBottom: "12px" }}
                    placeholder="Objetivos, timeline, referencias... lo que nos ayude a entender mejor."
                  />
                </Field>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-8 text-[14px] font-semibold transition-colors md:w-auto"
                    style={{ background: "#1ec4ff", color: "#080a0f" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#4dd4ff"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#1ec4ff"; }}
                  >
                    Enviar mensaje
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {submitError && (
        <ApiErrorToast
          message="No se pudo enviar el mensaje. Intenta de nuevo."
          onDismiss={() => setSubmitError(false)}
        />
      )}

      <style jsx>{`
        .tk-input {
          height: 48px;
          width: 100%;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          background-color: rgba(255,255,255,0.04);
          padding: 0 16px;
          font-size: 14px;
          color: #f2f3f5;
          transition: all 0.2s;
        }
        .tk-input::placeholder {
          color: rgba(242,243,245,0.35);
        }
        .tk-input:focus {
          outline: none;
          border-color: rgba(30,196,255,0.5);
          background-color: rgba(255,255,255,0.06);
          box-shadow: 0 0 0 3px rgba(30,196,255,0.1);
        }
      `}</style>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
  full = false,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-2 ${full ? "md:col-span-2" : ""}`}>
      <label
        htmlFor={htmlFor}
        className="text-[13px] font-semibold"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
