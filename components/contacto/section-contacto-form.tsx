"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CustomSelect from "./custom-select";

gsap.registerPlugin(ScrollTrigger);

const presupuestos = [
  "< US$1,000",
  "US$1,000 - 5,000",
  "US$5,000 - 15,000",
  "US$15,000+",
  "Aún no sé",
];

const servicios = [
  "Landing / Sitio web",
  "App móvil",
  "E-commerce",
  "Sistema a medida",
  "Branding / Identidad",
  "Microservicio",
  "Otro",
];

export default function SectionContactoForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    budget: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la integración con el backend (mailer, API, etc.)
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setForm({
      name: "",
      email: "",
      company: "",
      service: "",
      budget: "",
      message: "",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="mx-auto w-full max-w-[1240px] px-6 py-14 md:px-[80px] md:py-20"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[380px_1fr] lg:gap-16">
        {/* Info lateral */}
        <aside className="contact-info">
          <div className="rounded-[24px] bg-[#101828] p-6 text-white md:p-8">
            <h2 className="mb-6 text-[24px] font-bold">Hablemos directo</h2>

            <div className="mb-8 flex flex-col gap-5">
              <a
                href="mailto:john.marte@unicaribe.edu.do"
                className="flex items-start gap-3 transition-opacity hover:opacity-80"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#0047ff]/30">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
                    Email
                  </p>
                  <p className="break-all text-[13px] font-medium md:text-[14px]">
                    john.marte@unicaribe.edu.do
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#0047ff]/30">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
                    Ubicación
                  </p>
                  <p className="text-[14px] font-medium">
                    US + LATAM
                    <br />
                    <span className="text-white/70">Remote first</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#0047ff]/30">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
                    Respuesta
                  </p>
                  <p className="text-[14px] font-medium">
                    &lt; 24 horas laborales
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-[13px] leading-[20px] text-white/80">
                ¿Prefieres una llamada?{" "}
                <a
                  href="mailto:john.marte@unicaribe.edu.do?subject=Agenda%20una%20llamada"
                  className="font-semibold text-[#00d7f2] underline"
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
          className="contact-form rounded-[24px] border border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-[#141a2b] p-6 md:p-8"
        >
          {sent ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
              <CheckCircle2 className="mb-4 h-16 w-16 text-[#0047ff]" strokeWidth={1.5} />
              <h3 className="mb-2 text-[24px] font-bold text-[#101828] dark:text-white">
                Mensaje enviado
              </h3>
              <p className="max-w-[360px] text-[14px] text-[#7a8595] dark:text-[#a1a8b3]">
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
                  className="input-base"
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
                  className="input-base"
                  placeholder="tu@empresa.com"
                />
              </Field>

              <Field label="Empresa" htmlFor="company" full>
                <input
                  id="company"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="input-base"
                  placeholder="Nombre de tu negocio o startup"
                />
              </Field>

              <Field label="¿Qué necesitas? *" htmlFor="service">
                <CustomSelect
                  id="service"
                  required
                  value={form.service}
                  onChange={(v) => setForm({ ...form, service: v })}
                  options={servicios}
                />
              </Field>

              <Field label="Presupuesto" htmlFor="budget">
                <CustomSelect
                  id="budget"
                  value={form.budget}
                  onChange={(v) => setForm({ ...form, budget: v })}
                  options={presupuestos}
                />
              </Field>

              <Field label="Cuéntanos sobre el proyecto *" htmlFor="message" full>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input-base resize-none"
                  placeholder="Objetivos, timeline, referencias... lo que nos ayude a entender mejor."
                />
              </Field>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#101828] px-8 text-[14px] font-semibold text-white transition-colors hover:bg-[#252b37] md:w-auto"
                >
                  Enviar mensaje
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <style jsx>{`
        .input-base {
          height: 48px;
          width: 100%;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background-color: #f9fafb;
          padding: 0 16px;
          font-size: 14px;
          color: #101828;
          transition: all 0.2s;
        }
        .input-base:focus {
          outline: none;
          border-color: #0047ff;
          background-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(0, 71, 255, 0.1);
        }
        textarea.input-base {
          height: auto;
          padding-top: 12px;
          padding-bottom: 12px;
        }
        :global(.dark) .input-base {
          background-color: #141a2b;
          border-color: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }
        :global(.dark) .input-base::placeholder {
          color: #a1a8b3;
        }
        :global(.dark) .input-base:focus {
          background-color: #1a2138;
          border-color: #0047ff;
          box-shadow: 0 0 0 3px rgba(0, 71, 255, 0.25);
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
        className="text-[13px] font-semibold text-[#252b37] dark:text-white"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
