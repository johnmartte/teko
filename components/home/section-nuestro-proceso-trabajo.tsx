"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LazyVideo from "@/components/globales/lazy-video";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const PLAYBACK_RATE = 0.7;

const steps = [
  { id: 1, key: "investigacion", seconds: 4, title: "Investigación", desc: "Entendemos tu negocio, usuarios y objetivos para definir el alcance." },
  { id: 2, key: "estrategia", seconds: 4, title: "Estrategia", desc: "Arquitectura, roadmap y métricas de éxito del producto digital." },
  { id: 3, key: "diseno", seconds: 4, title: "Diseño", desc: "Wireframes, prototipos interactivos y el sistema de diseño visual." },
  { id: 4, key: "desarrollo", seconds: 4, title: "Desarrollo", desc: "Código limpio, sprints ágiles y revisiones continuas." },
  { id: 5, key: "lanzamiento", seconds: 6, title: "Lanzamiento", desc: "Desplegamos, monitoreamos y optimizamos para un lanzamiento impecable." },
];

export default function SectionNuestroProcesoTrabajo() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active && inView) {
        video.defaultPlaybackRate = PLAYBACK_RATE;
        video.playbackRate = PLAYBACK_RATE;
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [active, inView]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const items = sectionRef.current?.querySelectorAll("[data-reveal]");
      if (items) {
        items.forEach((el) => {
          const rect = (el as HTMLElement).getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.9) return;
          gsap.set(el, { opacity: 0, y: 18 });
          gsap.to(el, {
            opacity: 1, y: 0, duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} data-reveal="" className="relative z-[2] mx-auto max-w-[1200px] px-6 pt-[120px]" style={{ color: "#f2f3f5" }}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-[620px]">
          <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.08em]" style={{ color: "rgba(242,243,245,0.55)" }}>
            <span className="h-1.5 w-1.5 rounded-full bg-[#1ec4ff]" style={{ boxShadow: "0 0 12px #1ec4ff" }} />
            Proceso de trabajo
          </p>
          <h2 className="mt-[18px] text-[clamp(32px,4vw,54px)] font-semibold leading-[1.02] tracking-[-0.035em]" style={{ textWrap: "balance" }}>
            Un método probado en más de 50 proyectos.
          </h2>
        </div>
        <p className="max-w-[36ch] text-[15px] font-light leading-[1.55]" style={{ color: "rgba(242,243,245,0.6)" }}>
          Reduce la incertidumbre y maximiza resultados. Cinco etapas, siempre en el mismo orden.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-10">
      <div ref={stageRef} data-reveal="" className="relative aspect-video w-full overflow-hidden rounded-[22px] border" style={{ borderColor: "rgba(255,255,255,0.1)", background: "#07080a", boxShadow: "0 60px 120px -50px rgba(0,0,0,0.9)" }}>
        {steps.map((s, i) => (
          <LazyVideo
            key={s.key}
            ref={(el) => { videoRefs.current[i] = el; }}
            src={`/media/proceso/${s.key}.mp4`}
            poster={`/media/proceso/${s.key}.jpg`}
            loop={false}
            autoPlayInView={false}
            onEnded={() => setActive((a) => (a + 1) % steps.length)}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
            style={{ opacity: i === active ? 1 : 0 }}
          />
        ))}
        <div className="pointer-events-none absolute bottom-4 left-4 rounded-full border px-3.5 py-1.5 text-xs font-medium backdrop-blur-md sm:bottom-5 sm:left-5" style={{ borderColor: "rgba(255,255,255,0.14)", background: "rgba(8,10,15,0.6)" }}>
          {String(steps[active].id).padStart(2, "0")} · {steps[active].title}
        </div>
      </div>

      <ol className="flex list-none flex-col gap-2 p-0">
        {steps.map((s, i) => {
          const isActive = i === active;
          return (
            <li key={s.id} data-reveal="">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                className="relative flex w-full items-start gap-4 overflow-hidden rounded-[16px] border p-[16px_18px] text-left transition-colors duration-300"
                style={{
                  borderColor: isActive ? "rgba(30,196,255,0.35)" : "rgba(255,255,255,0.08)",
                  background: isActive ? "rgba(30,196,255,0.06)" : "rgba(255,255,255,0.02)",
                }}
              >
                <span className="inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[12.5px] font-semibold transition-all duration-300" style={{
                  border: isActive ? "1px solid rgba(30,196,255,0.5)" : "1px solid rgba(255,255,255,0.18)",
                  color: isActive ? "#8fe3ff" : "rgba(242,243,245,0.7)",
                  boxShadow: isActive ? "0 0 24px rgba(30,196,255,0.25)" : "none",
                }}>
                  {s.id}
                </span>
                <span className="min-w-0">
                  <span className="block text-[16.5px] font-semibold tracking-[-0.02em] transition-colors duration-300" style={{ color: isActive ? "#f2f3f5" : "rgba(242,243,245,0.6)" }}>{s.title}</span>
                  <span className="mt-1 block text-[13.5px] leading-[1.5]" style={{ color: isActive ? "rgba(242,243,245,0.65)" : "rgba(242,243,245,0.4)" }}>{s.desc}</span>
                </span>
                {isActive && inView && (
                  <span
                    key={`${active}-progress`}
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-[#1ec4ff] motion-reduce:hidden"
                    style={{ animation: `tk-progress ${s.seconds / PLAYBACK_RATE}s linear forwards` }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ol>
      </div>
    </section>
  );
}
