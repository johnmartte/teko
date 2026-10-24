"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LazyVideo from "@/components/globales/lazy-video";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const LIMA = "#c7f169";
const VERDE = "#2d644d";
const OSCURO = "#0f2a1e";

const paradas = [
  { key: "carta", globo: "Pedido tomado", parada: "Carta", titulo: "La carta, en el celular de tu cliente.", desc: "Escanea el QR y pide desde la mesa. El menú es el mismo; tú eliges entre cuatro plantillas." },
  { key: "caja", globo: "Cobrado en caja", parada: "Caja", titulo: "La caja, en el mostrador.", desc: "Agrega los platos, cobra en efectivo o tarjeta y el cambio sale calculado." },
  { key: "pedidos", globo: "En cocina", parada: "Cocina", titulo: "Los pedidos, en vivo.", desc: "Cada orden cae en el tablero y avanza de estado hasta que se entrega." },
  { key: "comision", globo: "Entregado, y sin comisión", parada: "Sin comisión", titulo: "Y de cada venta, 0% para nosotros.", desc: "Pagas tu plan y nada más. Lo que vendes es tuyo." },
];

// Posición de cada parada sobre la calle (fracción del ancho).
const PRIMERA = 0.1;
const PASO = 0.26;
const RECORRIDO = PASO * (paradas.length - 1);

const serif: React.CSSProperties = { fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", fontWeight: 400 };

export default function SectionCasoRapidito() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<HTMLDivElement>(null);
  const riderRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [stage, setStage] = useState(0);
  const [inView, setInView] = useState(false);
  const [mobileStage, setMobileStage] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const els = sectionRef.current?.querySelectorAll("[data-reveal]");
      if (!els) return;
      els.forEach((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) return;
        gsap.set(el, { opacity: 0, y: 18 });
        gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // El repartidor avanza con el scroll; la parada en la que va decide qué se ve en la pantalla.
  useEffect(() => {
    const track = trackRef.current;
    const road = roadRef.current;
    const rider = riderRef.current;
    if (!track || !road || !rider) return;
    const reduced = prefersReducedMotion();

    const paint = (p: number) => {
      const f = PRIMERA + p * RECORRIDO;
      const bob = reduced ? 0 : Math.sin(p * Math.PI * 16) * 6;
      rider.style.transform = `translate3d(${(f * road.clientWidth - rider.offsetWidth / 2).toFixed(1)}px, ${bob.toFixed(1)}px, 0) rotate(${(bob * 0.22).toFixed(2)}deg)`;
      const s = Math.max(0, Math.min(paradas.length - 1, Math.floor((f - PRIMERA) / PASO + 0.12)));
      setStage((prev) => (prev === s ? prev : s));
    };

    const st = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => paint(self.progress),
      onRefresh: (self) => paint(self.progress),
    });
    paint(st.progress);
    return () => st.kill();
  }, []);

  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(screen);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === stage && inView) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [stage, inView]);

  const actual = paradas[stage];

  return (
    <section ref={sectionRef} id="caso" className="relative z-[2] mx-auto max-w-[1200px] px-6 pt-[120px]" style={{ color: "#f2f3f5" }}>

      {/* Móvil: promo compacta + las paradas una debajo de otra */}
      <div className="lg:hidden">
        <div data-reveal="" className="relative overflow-hidden rounded-[22px] border p-6" style={{ borderColor: "rgba(184,240,106,0.22)", background: "radial-gradient(80% 80% at 50% 0%, #1f5c3f 0%, #0f2a1e 60%, #0b1a14 100%)" }}>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{
            backgroundImage: "url('/Rapidito-Patron.png')",
            backgroundSize: "180px",
            maskImage: "radial-gradient(ellipse 80% 80% at 80% 20%, #000, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 80% 20%, #000, transparent 70%)",
          }} />
          <div className="relative flex flex-col items-start gap-4">
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[#b8f06a]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b8f06a]" style={{ boxShadow: "0 0 10px #b8f06a" }} />
              Caso · Producto propio
            </p>
            <div className="relative" style={{ height: "36px", width: "148px" }}>
              <Image src="/Rapidito-Logo.png" alt="Rapidito" fill className="object-contain object-left" />
            </div>
            <h2 className="text-[28px] font-semibold leading-[1.05] tracking-[-0.03em]">
              Sigue un <em style={{ ...serif, color: "#d9f7a8" }}>pedido</em>.
            </h2>
            <p className="max-w-[48ch] text-[14px] font-light leading-[1.55]" style={{ color: "rgba(242,243,245,0.72)" }}>
              Tu carta, tu caja y tus pedidos en un solo lugar. Sin comisión por pedido.
            </p>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-[20px] border" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
          <div className="flex gap-2 overflow-x-auto p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Etapas del pedido">
            {paradas.map((p, i) => {
              const on = i === mobileStage;
              return (
                <button
                  key={p.key}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setMobileStage(i)}
                  className="shrink-0 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors"
                  style={{
                    borderColor: on ? "rgba(184,240,106,0.5)" : "rgba(255,255,255,0.14)",
                    background: on ? "rgba(184,240,106,0.14)" : "transparent",
                    color: on ? "#d9f7a8" : "rgba(242,243,245,0.65)",
                  }}
                >
                  {p.parada}
                </button>
              );
            })}
          </div>
          <div className="relative aspect-video" style={{ background: "#fbfaf8" }}>
            {paradas[mobileStage].key === "comision" ? (
              <ComisionPanel compact />
            ) : (
              <LazyVideo
                key={paradas[mobileStage].key}
                src={`/media/rapidito/${paradas[mobileStage].key}.mp4`}
                poster={`/media/rapidito/${paradas[mobileStage].key}.jpg`}
                loop={false}
                onEnded={() => setMobileStage((m) => (m + 1) % paradas.length)}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
          </div>
          <div key={`m-${mobileStage}`} className="p-5" style={{ animation: "tk-stage-in .45s cubic-bezier(0.23, 1, 0.32, 1) both" }}>
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#b8f06a]">0{mobileStage + 1} · {paradas[mobileStage].globo}</p>
            <h3 className="mt-2 text-[19px] font-semibold tracking-[-0.02em]">{paradas[mobileStage].titulo}</h3>
            <p className="mt-1.5 text-[14px] leading-[1.55]" style={{ color: "rgba(242,243,245,0.65)" }}>{paradas[mobileStage].desc}</p>
          </div>
        </div>
        <Ctas className="mt-5" />
      </div>

      {/* Escritorio: escena fija; el scroll mueve al repartidor por la calle */}
      <div ref={trackRef} className="relative hidden lg:block" style={{ height: "340vh" }}>
        <div className="sticky top-0 flex h-screen items-center pb-6 pt-[84px]">
          <div className="relative flex h-full max-h-[760px] w-full flex-col overflow-hidden rounded-[26px] border" style={{ borderColor: "rgba(184,240,106,0.22)", background: "radial-gradient(90% 90% at 100% 0%, #1f5c3f 0%, #0f2a1e 55%, #0b1a14 100%)" }}>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.1]" style={{
              backgroundImage: "url('/Rapidito-Patron.png')",
              backgroundSize: "240px",
              maskImage: "radial-gradient(60% 70% at 85% 10%, #000, transparent 75%)",
              WebkitMaskImage: "radial-gradient(60% 70% at 85% 10%, #000, transparent 75%)",
            }} />

            <div className="relative grid min-h-0 flex-1 grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-center gap-10 px-12 pt-10">
              {/* Texto */}
              <div className="flex h-full flex-col justify-between py-2">
                <div>
                  <div className="flex items-center gap-4">
                    <div className="relative" style={{ height: "34px", width: "136px" }}>
                      <Image src="/Rapidito-Logo.png" alt="Rapidito" fill className="object-contain object-left" />
                    </div>
                    <span className="rounded-full border px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.08em] text-[#b8f06a]" style={{ borderColor: "rgba(184,240,106,0.3)" }}>
                      Producto propio
                    </span>
                  </div>
                  <h2 className="mt-6 text-[clamp(30px,3vw,42px)] font-semibold leading-[1.04] tracking-[-0.035em]">
                    Sigue un <em style={{ ...serif, color: "#d9f7a8" }}>pedido</em>.
                  </h2>
                </div>

                <div key={stage} style={{ animation: "tk-stage-in .55s cubic-bezier(0.23, 1, 0.32, 1) both" }}>
                  <p className="text-[12px] font-medium tabular-nums" style={{ color: "rgba(242,243,245,0.5)" }}>
                    <span className="text-[#b8f06a]">0{stage + 1}</span> / 0{paradas.length}
                  </p>
                  <h3 className="mt-3 text-[clamp(22px,2.1vw,28px)] font-semibold leading-[1.15] tracking-[-0.025em]">{actual.titulo}</h3>
                  <p className="mt-3 max-w-[40ch] text-[15px] font-light leading-[1.55]" style={{ color: "rgba(242,243,245,0.72)" }}>{actual.desc}</p>
                </div>

                <Ctas />
              </div>

              {/* Pantalla */}
              <div ref={screenRef} className="relative overflow-hidden rounded-[16px] border" style={{ borderColor: "rgba(255,255,255,0.16)", background: "#fbfaf8", boxShadow: "0 50px 100px -40px rgba(0,0,0,0.85)" }}>
                <div className="flex items-center gap-2 border-b px-3.5 py-2.5" style={{ borderColor: "rgba(15,42,30,0.1)", background: "#f1f0ec" }}>
                  <span className="h-[9px] w-[9px] rounded-full bg-[#d5d3cc]" />
                  <span className="h-[9px] w-[9px] rounded-full bg-[#d5d3cc]" />
                  <span className="h-[9px] w-[9px] rounded-full bg-[#d5d3cc]" />
                  <span className="mx-auto rounded-md px-3 py-0.5 text-[11px]" style={{ background: "rgba(15,42,30,0.06)", color: "#5a6b62" }}>panel.rapidito.do</span>
                </div>
                <div className="relative aspect-video">
                  {paradas.slice(0, 3).map((p, i) => (
                    <LazyVideo
                      key={p.key}
                      ref={(el) => { videoRefs.current[i] = el; }}
                      src={`/media/rapidito/${p.key}.mp4`}
                      poster={`/media/rapidito/${p.key}.jpg`}
                      autoPlayInView={false}
                      className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                      style={{ opacity: i === stage ? 1 : 0 }}
                    />
                  ))}
                  <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: stage === 3 ? 1 : 0 }} aria-hidden={stage !== 3}>
                    <ComisionPanel />
                  </div>
                </div>
              </div>
            </div>

            {/* Calle */}
            <div ref={roadRef} className="relative mt-6 h-[150px] shrink-0">
              {paradas.map((p, i) => {
                const pasada = i <= stage;
                return (
                  <div key={p.key} className="absolute bottom-[34px] -translate-x-1/2" style={{ left: `${(PRIMERA + i * PASO) * 100}%` }}>
                    <span className="block whitespace-nowrap text-[11.5px] font-semibold uppercase tracking-[0.08em] transition-colors duration-300" style={{ color: pasada ? LIMA : "rgba(242,243,245,0.3)" }}>
                      {p.parada}
                    </span>
                    <span className="mx-auto mt-2 block h-2.5 w-2.5 rounded-full border-2 transition-colors duration-300" style={{ borderColor: pasada ? LIMA : "rgba(242,243,245,0.3)", background: pasada ? LIMA : "transparent" }} />
                  </div>
                );
              })}

              <div ref={riderRef} className="absolute bottom-[22px] left-0 z-[2] w-[150px] will-change-transform" aria-hidden="true">
                <div className="relative">
                  <div className="absolute -top-[34px] left-1/2 flex h-[30px] -translate-x-1/2 items-center gap-[7px] whitespace-nowrap rounded-full px-3.5 text-[12px] font-semibold" style={{ background: LIMA, color: OSCURO }}>
                    <span className="h-[7px] w-[7px] rounded-full" style={{ background: VERDE }} />
                    {actual.globo}
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/media/rapidito/delivery.svg" alt="" className="block h-auto w-full" style={{ filter: "drop-shadow(0 16px 18px rgba(0,0,0,0.45))" }} />
                </div>
              </div>

              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[22px]" style={{
                background: `repeating-linear-gradient(90deg, ${LIMA} 0 44px, transparent 44px 88px) 0 9px / 100% 3px repeat-x, ${VERDE}`,
                animation: "tk-road .5s linear infinite",
              }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComisionPanel({ compact }: { compact?: boolean }) {
  return (
    <div className={`flex h-full items-center gap-6 ${compact ? "aspect-video px-7" : "px-12"}`} style={{ background: LIMA, color: OSCURO }}>
      <span className={`font-bold leading-none tracking-[-0.06em] ${compact ? "text-[110px]" : "text-[clamp(140px,14vw,210px)]"}`} style={{ color: VERDE }}>0</span>
      <div>
        <p className={`font-semibold leading-[1.05] tracking-[-0.03em] ${compact ? "text-[24px]" : "text-[clamp(28px,2.8vw,40px)]"}`}>comisión<br />por pedido.</p>
        <p className="mt-2 text-[14px] font-medium" style={{ color: "rgba(15,42,30,0.7)" }}>Pagas tu plan y nada más.</p>
      </div>
    </div>
  );
}

function Ctas({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a href="https://rapidito.do" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 rounded-full bg-[#b8f06a] px-[22px] py-[13px] text-sm font-semibold text-[#0f2a1e] transition-colors hover:bg-[#cdf58f]">
        Publicar mi carta
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 10L10 2M4 2h6v6" /></svg>
      </a>
      <a href="https://rapidito.do" target="_blank" rel="noopener noreferrer" className="rounded-full border px-[22px] py-3 text-sm font-medium transition-colors hover:bg-white/[0.08]" style={{ borderColor: "rgba(255,255,255,0.22)", color: "#f2f3f5" }}>
        Ver una carta real
      </a>
    </div>
  );
}
