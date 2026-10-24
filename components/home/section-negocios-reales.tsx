"use client";

import { useEffect, useRef, useState } from "react";
import LazyVideo from "@/components/globales/lazy-video";
import { prefersReducedMotion } from "@/lib/motion";

const oficios = [
  { key: "barberia", oficio: "Barbería", titulo: "Citas sin llamadas", desc: "Tus clientes reservan solos y reciben un recordatorio antes de la cita. Tú solo te ocupas del corte." },
  { key: "salon", oficio: "Salón", titulo: "Reservas desde el celular", desc: "La agenda se llena mientras atiendes. Cada reserva llega con el servicio, la hora y quién la tomó." },
  { key: "colmado", oficio: "Colmado", titulo: "Inventario al día", desc: "Sabes qué se está acabando antes de que un cliente lo pida, y cuánto tienes de cada producto." },
  { key: "consultorio", oficio: "Consultorio", titulo: "Agenda e historial", desc: "Citas, recetas e historial de cada paciente en un mismo lugar, sin carpetas ni libretas." },
  { key: "restaurante", oficio: "Restaurante", titulo: "Pedidos directo a cocina", desc: "Del pedido al plato sin papelitos: la cocina ve cada orden y el salón sabe cuándo está lista." },
  { key: "taller", oficio: "Taller", titulo: "Órdenes de trabajo", desc: "Cada vehículo con su orden y sus pasos, y un aviso al cliente cuando ya puede pasar a buscarlo." },
  { key: "delivery", oficio: "Delivery", titulo: "Rutas y entregas", desc: "Rutas claras para tus repartidores y una hora de llegada que tu cliente puede ver." },
];

const serif: React.CSSProperties = { fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", fontWeight: 400, color: "#bfe9ff" };

export default function SectionNegociosReales() {
  const [active, setActive] = useState(0);
  const [mobileActive, setMobileActive] = useState(0);
  const [inView, setInView] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    blockRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active && inView) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [active, inView]);

  return (
    <section className="relative z-[2] mx-auto max-w-[1200px] px-6 pt-[120px]" style={{ color: "#f2f3f5" }}>
      <div className="max-w-[720px]">
        <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.08em]" style={{ color: "rgba(242,243,245,0.55)" }}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#1ec4ff]" style={{ boxShadow: "0 0 12px #1ec4ff" }} />
          Para negocios reales
        </p>
        <h2 className="mt-[18px] text-[clamp(32px,4vw,54px)] font-semibold leading-[1.02] tracking-[-0.035em]" style={{ textWrap: "balance" }}>
          Tu día a día ya es un <em style={serif}>proceso</em>.
        </h2>
        <p className="mt-5 max-w-[58ch] text-base font-light leading-[1.55]" style={{ color: "rgba(242,243,245,0.65)" }}>
          Agendar, cobrar, anotar, despachar. Todo negocio repite tareas cada día. Nosotros las convertimos en un sistema que trabaja contigo.
        </p>
        <p className="mt-3 text-xs" style={{ color: "rgba(242,243,245,0.4)" }}>
          Escenas ilustrativas con interfaces de ejemplo.
        </p>
      </div>

      {/* Móvil: un solo video con selector de oficio */}
      <div className="mt-8 lg:hidden">
        <div className="-mx-6 flex snap-x gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Oficios">
          {oficios.map((o, i) => {
            const on = i === mobileActive;
            return (
              <button
                key={o.key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setMobileActive(i)}
                className="shrink-0 snap-start rounded-full border px-4 py-2 text-[13px] font-medium transition-colors"
                style={{
                  borderColor: on ? "rgba(30,196,255,0.45)" : "rgba(255,255,255,0.14)",
                  background: on ? "rgba(30,196,255,0.12)" : "rgba(255,255,255,0.03)",
                  color: on ? "#bfe9ff" : "rgba(242,243,245,0.65)",
                }}
              >
                {o.oficio}
              </button>
            );
          })}
        </div>
        <div className="mt-5 grid grid-cols-[40%_minmax(0,1fr)] items-center gap-4">
          <div className="relative aspect-[9/16] overflow-hidden rounded-[18px] border" style={{ borderColor: "rgba(255,255,255,0.12)", background: "#0d1017" }}>
            <LazyVideo
              key={oficios[mobileActive].key}
              src={`/media/oficios/${oficios[mobileActive].key}.mp4`}
              poster={`/media/oficios/${oficios[mobileActive].key}.jpg`}
              loop={false}
              onEnded={() => setMobileActive((m) => (m + 1) % oficios.length)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div key={`t-${mobileActive}`} style={{ animation: "tk-stage-in .45s cubic-bezier(0.23, 1, 0.32, 1) both" }}>
            <p className="text-[11px] font-medium uppercase tracking-[0.08em]" style={{ color: "rgba(242,243,245,0.45)" }}>
              {String(mobileActive + 1).padStart(2, "0")} / {String(oficios.length).padStart(2, "0")} · {oficios[mobileActive].oficio}
            </p>
            <h3 className="mt-2 text-[21px] font-semibold leading-[1.1] tracking-[-0.025em]">{oficios[mobileActive].titulo}</h3>
            <p className="mt-2.5 text-[13.5px] font-light leading-[1.55]" style={{ color: "rgba(242,243,245,0.65)" }}>{oficios[mobileActive].desc}</p>
          </div>
        </div>
      </div>

      <div className="mt-14 hidden grid-cols-1 gap-10 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        {/* Escenario fijo (escritorio) */}
        <div className="hidden lg:block">
          <div ref={stageRef} className="sticky top-[11vh] flex h-[78vh] items-center justify-center">
            <div aria-hidden="true" className="absolute inset-x-[8%] bottom-[6%] h-[40%] rounded-full blur-[70px]" style={{ background: "rgba(30,120,255,0.22)" }} />
            <div className="relative aspect-[9/16] h-full max-h-[720px] overflow-hidden rounded-[28px] border" style={{ borderColor: "rgba(255,255,255,0.12)", background: "#0d1017", boxShadow: "0 60px 120px -40px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
              {oficios.map((o, i) => (
                <LazyVideo
                  key={o.key}
                  ref={(el) => { videoRefs.current[i] = el; }}
                  src={`/media/oficios/${o.key}.mp4`}
                  poster={`/media/oficios/${o.key}.jpg`}
                  autoPlayInView={false}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                  style={{ opacity: i === active ? 1 : 0, transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                />
              ))}
            </div>
            <div className="absolute -right-2 top-1/2 flex -translate-y-1/2 flex-col gap-2" aria-hidden="true">
              {oficios.map((o, i) => (
                <span key={o.key} className="w-[3px] rounded-full transition-all duration-500" style={{ height: i === active ? 28 : 10, background: i === active ? "#1ec4ff" : "rgba(255,255,255,0.18)" }} />
              ))}
            </div>
          </div>
        </div>

        {/* Historias */}
        <div>
          {oficios.map((o, i) => (
            <div
              key={o.key}
              ref={(el) => { blockRefs.current[i] = el; }}
              data-index={i}
              className="flex min-h-[78vh] flex-col justify-center transition-opacity duration-500"
              style={{ opacity: i === active ? 1 : 0.32 }}
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.08em]" style={{ color: "rgba(242,243,245,0.45)" }}>
                {String(i + 1).padStart(2, "0")} · {o.oficio}
              </p>
              <h3 className="mt-3 text-[clamp(28px,3vw,42px)] font-semibold leading-[1.05] tracking-[-0.03em]">{o.titulo}</h3>
              <p className="mt-4 max-w-[44ch] text-[16px] font-light leading-[1.6]" style={{ color: "rgba(242,243,245,0.65)" }}>{o.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
