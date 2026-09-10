"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";
import ApiErrorToast from "@/components/ui/api-error-toast";

gsap.registerPlugin(ScrollTrigger);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL no está definida");
}

type PortfolioCategory = { id: number; name: string; slug: string };

type Project = {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  metric: string | null;
  image_light_url: string | null;
  image_dark_url: string | null;
  client_name: string | null;
  category: PortfolioCategory;
};

/* ── Illustration pool ─────────────────────────────────────────
   Each project gets an illustration by its index (mod pool size).
   Illustrations are self-contained within 100% of their container. */

function IllBrowser() {
  return (
    <div className="mx-auto w-[85%] rounded-[12px] border p-3" style={{ borderColor: "rgba(255,255,255,0.1)", background: "#0c0f18", boxShadow: "0 24px 48px -16px rgba(0,0,0,0.6)" }}>
      <div className="flex gap-1.5">
        <span className="h-2 w-2 rounded-full" style={{ background: "#2a2f3a" }} />
        <span className="h-2 w-2 rounded-full" style={{ background: "#2a2f3a" }} />
        <span className="h-2 w-2 rounded-full" style={{ background: "#2a2f3a" }} />
      </div>
      <div className="mt-3 h-1.5 w-1/3 rounded" style={{ background: "rgba(255,255,255,0.12)" }} />
      <div className="mt-3 grid grid-cols-3 gap-2">
        <span className="h-[38px] rounded-lg" style={{ background: "rgba(30,196,255,0.1)" }} />
        <span className="h-[38px] rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }} />
        <span className="h-[38px] rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }} />
      </div>
      <div className="mt-3 h-1.5 w-1/2 rounded" style={{ background: "rgba(255,255,255,0.08)" }} />
      <div className="mt-1.5 h-1.5 w-[60%] rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
    </div>
  );
}

function IllPhone() {
  return (
    <div className="mx-auto w-[42%] rounded-[24px] border p-2" style={{ borderColor: "rgba(255,255,255,0.12)", background: "#0c0f18", boxShadow: "0 24px 48px -16px rgba(0,0,0,0.6)" }}>
      <div className="flex flex-col rounded-[18px] py-3" style={{ background: "#131720" }}>
        <div className="mx-auto h-1 w-2/5 rounded bg-white/15" />
        <div className="mt-3 px-3"><div className="h-1.5 w-1/2 rounded" style={{ background: "rgba(255,255,255,0.12)" }} /></div>
        <div className="mt-2 px-3"><div className="h-1 w-3/4 rounded" style={{ background: "rgba(255,255,255,0.06)" }} /></div>
        <div className="mt-3 px-3"><div className="h-[28px] rounded-lg" style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.2)" }} /></div>
        <div className="mt-2 px-3 flex gap-1.5">
          <span className="h-6 flex-1 rounded-md" style={{ background: "rgba(255,255,255,0.03)" }} />
          <span className="h-6 flex-1 rounded-md" style={{ background: "rgba(255,255,255,0.03)" }} />
        </div>
        <div className="mt-3 mx-3 h-6 rounded-lg" style={{ background: "rgba(167,139,250,0.1)" }} />
      </div>
    </div>
  );
}

function IllDashboard() {
  return (
    <div className="mx-auto w-[88%] rounded-[12px] border" style={{ borderColor: "rgba(255,255,255,0.1)", background: "#0c0f18", boxShadow: "0 24px 48px -16px rgba(0,0,0,0.6)" }}>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-[28%] border-r p-2.5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="h-1.5 w-3/4 rounded" style={{ background: "rgba(255,255,255,0.1)" }} />
          <div className="mt-3 space-y-2">
            <div className="h-1 w-full rounded" style={{ background: "rgba(30,196,255,0.15)" }} />
            <div className="h-1 w-4/5 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
            <div className="h-1 w-3/5 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>
        </div>
        {/* Main */}
        <div className="flex-1 p-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="h-[30px] rounded-lg" style={{ background: "rgba(94,224,138,0.08)", border: "1px solid rgba(94,224,138,0.12)" }} />
            <div className="h-[30px] rounded-lg" style={{ background: "rgba(30,196,255,0.08)", border: "1px solid rgba(30,196,255,0.12)" }} />
            <div className="h-[30px] rounded-lg" style={{ background: "rgba(255,212,122,0.08)", border: "1px solid rgba(255,212,122,0.12)" }} />
          </div>
          <div className="mt-2.5 h-1.5 w-2/3 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="mt-1.5 h-1.5 w-1/2 rounded" style={{ background: "rgba(255,255,255,0.03)" }} />
        </div>
      </div>
    </div>
  );
}

function IllPalette() {
  return (
    <div className="mx-auto flex w-[75%] flex-col items-center gap-4">
      <div className="flex gap-3">
        {["#60a5fa", "#a78bfa", "#f472b6", "#fbbf24", "#22d3ee"].map((c) => (
          <div key={c} className="h-9 w-9 rounded-xl" style={{ background: c, opacity: 0.6 }} />
        ))}
      </div>
      <div className="self-start">
        <div className="h-1.5 w-20 rounded" style={{ background: "rgba(255,255,255,0.1)" }} />
        <div className="mt-2 h-1 w-14 rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
      </div>
    </div>
  );
}

function IllEvents() {
  return (
    <div className="mx-auto flex w-[80%] flex-col gap-2">
      {[
        { color: "#5ee08a", w: "w-[85%]" },
        { color: "#8fe3ff", w: "w-full" },
        { color: "#ffd47a", w: "w-[70%]" },
      ].map((e) => (
        <div key={e.color} className={`flex items-center gap-2.5 rounded-[10px] border px-3 py-2.5 ${e.w}`} style={{ borderColor: "rgba(255,255,255,0.08)", background: "#0c0f18" }}>
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: e.color }} />
          <span className="h-1.5 flex-1 rounded" style={{ background: "rgba(255,255,255,0.07)" }} />
        </div>
      ))}
    </div>
  );
}

function IllTypography() {
  return (
    <div className="flex items-center justify-center">
      <span className="select-none text-[140px] leading-none" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", color: "rgba(255,255,255,0.045)" }}>Aa</span>
    </div>
  );
}

function IllGrid() {
  return (
    <div className="mx-auto grid w-[75%] grid-cols-3 gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="aspect-square rounded-lg" style={{ background: i % 3 === 0 ? "rgba(30,196,255,0.08)" : "rgba(255,255,255,0.025)", border: i % 3 === 0 ? "1px solid rgba(30,196,255,0.12)" : "1px solid rgba(255,255,255,0.06)" }} />
      ))}
    </div>
  );
}

function IllConnections() {
  return (
    <div className="mx-auto flex w-[80%] items-center justify-center gap-3">
      {["CRM", "API", "ERP"].map((label, i) => (
        <div key={label} className="flex h-[46px] w-[70px] items-center justify-center rounded-xl" style={{
          background: i === 1 ? "rgba(30,196,255,0.08)" : "rgba(255,255,255,0.025)",
          border: i === 1 ? "1px solid rgba(30,196,255,0.15)" : "1px solid rgba(255,255,255,0.08)",
        }}>
          <span className="text-[10px] font-medium" style={{ color: i === 1 ? "rgba(30,196,255,0.6)" : "rgba(255,255,255,0.25)" }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

const illustrationPool = [
  IllBrowser,
  IllPhone,
  IllDashboard,
  IllPalette,
  IllEvents,
  IllTypography,
  IllGrid,
  IllConnections,
];

function ProjectSkeleton() {
  return (
    <div className="flex min-h-[360px] flex-col rounded-[22px] border p-8" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.025)" }}>
      <div className="mb-auto flex gap-2">
        <div className="h-6 w-20 animate-pulse rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>
      <div>
        <div className="mb-2 h-5 w-2/3 animate-pulse rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="h-3 w-full animate-pulse rounded" style={{ background: "rgba(255,255,255,0.03)" }} />
      </div>
    </div>
  );
}

export default function SectionPortafolioGrid() {
  const [filter, setFilter] = useState("Todos");
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filterOptions = ["Todos", ...categories.map((cat) => cat.name)];

  const filtered =
    filter === "Todos"
      ? projects
      : projects.filter((p) => p.category.name === filter);

  const loadPortfolio = useCallback(async () => {
    setError(false);
    setLoading(true);
    try {
      const [categoriesRes, projectsRes] = await Promise.all([
        fetch(`${API_URL}/portfolio/categories`),
        fetch(`${API_URL}/portfolio`),
      ]);
      if (!categoriesRes.ok || !projectsRes.ok) throw new Error("fetch failed");
      setCategories(await categoriesRes.json());
      setProjects(await projectsRes.json());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPortfolio(); }, [loadPortfolio]);

  useEffect(() => {
    if (loading || projects.length === 0 || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll("[data-reveal]");
      if (cards && cards.length) {
        cards.forEach((el) => {
          const rect = (el as HTMLElement).getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.9) return;
          gsap.set(el, { opacity: 0, y: 18 });
          gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [filter, projects, loading]);

  return (
    <section
      ref={sectionRef}
      className="px-6 pb-16 pt-10 md:px-[100px] md:pb-28"
      style={{ color: "#f2f3f5" }}
    >
    <div className="mx-auto max-w-[1200px]">
      {/* Filters — left-aligned with hero text */}
      {!loading && categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {filterOptions.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="h-9 rounded-full px-4 text-[13px] font-medium transition-all duration-200"
              style={
                filter === cat
                  ? { background: "#f2f3f5", color: "#080a0f" }
                  : { background: "transparent", color: "rgba(242,243,245,0.6)", border: "1px solid rgba(255,255,255,0.1)" }
              }
              onMouseEnter={(e) => { if (filter !== cat) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={(e) => { if (filter !== cat) e.currentTarget.style.background = "transparent"; }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* 2-col grid — large cards */}
      <div ref={gridRef} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {loading
          ? [1, 2, 3, 4].map((i) => <ProjectSkeleton key={i} />)
          : filtered.map((p, i) => {
              const Ill = illustrationPool[i % illustrationPool.length];
              return (
                <article
                  key={p.id}
                  data-reveal=""
                  className="group relative flex min-h-[360px] flex-col overflow-hidden rounded-[22px] border transition-all duration-400 hover:border-[rgba(255,255,255,0.16)]"
                  style={{
                    borderColor: "rgba(255,255,255,0.1)",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                  }}
                >
                  {/* Illustration area — centered, contained */}
                  <div className="flex flex-1 items-center justify-center px-6 pt-8 pb-4">
                    <Ill />
                  </div>

                  {/* Info — bottom */}
                  <div className="px-8 pb-7">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border px-3 py-1.5 text-[11px] font-medium" style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(242,243,245,0.65)" }}>
                        {p.category.name}
                      </span>
                      {p.metric && (
                        <span className="text-[11px]" style={{ color: "rgba(242,243,245,0.35)" }}>
                          {p.metric}
                        </span>
                      )}
                    </div>
                    <h3 className="text-[clamp(20px,2vw,26px)] font-semibold tracking-[-0.02em]">
                      {p.title}
                    </h3>
                    {p.short_description && (
                      <p className="mt-2 max-w-[42ch] text-[14px] leading-[1.55]" style={{ color: "rgba(242,243,245,0.55)" }}>
                        {p.short_description}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
      </div>

      {!loading && filtered.length === 0 && (
        <p className="py-12 text-center text-[15px]" style={{ color: "rgba(242,243,245,0.45)" }}>
          No hay proyectos en esta categoría todavía.
        </p>
      )}

      {error && (
        <ApiErrorToast
          message="No pudimos cargar el portafolio."
          onRetry={loadPortfolio}
          onDismiss={() => setError(false)}
        />
      )}
    </div>
    </section>
  );
}
