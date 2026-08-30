"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ApiErrorToast from "@/components/ui/api-error-toast";

gsap.registerPlugin(ScrollTrigger);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL no está definida");
}

type PortfolioCategory = {
  id: number;
  name: string;
  slug: string;
};

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

function ProjectSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[24px] border border-[#e6eaf2] bg-white dark:border-white/10 dark:bg-[#0f1525]">
      <div className="skeleton aspect-[16/10] w-full rounded-none" />
      <div className="flex items-end justify-between gap-4 p-5">
        <div className="flex-1">
          <div className="skeleton mb-2 h-3 w-16" />
          <div className="skeleton h-5 w-36" />
        </div>
        <div className="skeleton h-7 w-20 rounded-full" />
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

      const categoriesData = await categoriesRes.json();
      const projectsData = await projectsRes.json();

      setCategories(categoriesData);
      setProjects(projectsData);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPortfolio();
  }, [loadPortfolio]);

  useEffect(() => {
    if (loading || projects.length === 0) return;
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll(".project-card");
      if (cards && cards.length) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.08,
            clearProps: "transform,opacity",
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [filter, projects, loading]);

  return (
    <section
      ref={sectionRef}
      className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-10 sm:px-6 md:px-[80px] md:pb-28 md:pt-14"
    >
      {!loading && (
        <div className="mb-10 flex flex-wrap gap-3">
          {filterOptions.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`h-10 rounded-full px-5 text-[13px] font-semibold transition-all ${
                filter === cat
                  ? "bg-[#101828] dark:bg-white text-white dark:text-[#0a0e1a]"
                  : "border border-[#d5d7da] dark:border-white/10 bg-white dark:bg-[#141a2b] text-[#252b37] dark:text-white hover:bg-[#f4f7ff] dark:hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {loading
          ? [1, 2, 3, 4, 5, 6].map((i) => <ProjectSkeleton key={i} />)
          : filtered.map((p) => (
              <article
                key={p.id}
                className="project-card group relative flex flex-col overflow-hidden rounded-[24px] border border-[#e6eaf2] bg-white shadow-[0_10px_30px_-14px_rgba(16,24,40,0.15)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_48px_-16px_rgba(11,110,255,0.3)] dark:border-white/10 dark:bg-[#0f1525] dark:shadow-[0_10px_30px_-14px_rgba(0,0,0,0.55)] dark:hover:shadow-[0_18px_48px_-16px_rgba(11,110,255,0.5)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {p.image_light_url && (
                    <Image
                      src={p.image_light_url}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04] dark:hidden"
                    />
                  )}

                  {p.image_dark_url && (
                    <Image
                      src={p.image_dark_url}
                      alt={p.title}
                      fill
                      className="hidden object-cover transition-transform duration-700 group-hover:scale-[1.04] dark:block"
                    />
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white ring-1 ring-white/20 backdrop-blur-md">
                    {p.category.name}
                  </span>

                  <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white ring-1 ring-white/20 backdrop-blur-md transition-all duration-300 group-hover:rotate-45 group-hover:bg-black/65">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                <div className="flex flex-1 items-end justify-between gap-4 p-5">
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a8595] dark:text-[#7aa3ff]">
                      {p.client_name || "TEKO"}
                    </p>
                    <h3 className="text-[18px] font-bold leading-[22px] tracking-[-0.01em] text-[#101828] dark:text-white">
                      {p.title}
                    </h3>
                  </div>

                  <span className="shrink-0 inline-flex items-center rounded-full bg-[#101828] px-3.5 py-1.5 text-[11px] font-semibold text-white transition-all duration-300 group-hover:bg-[#0047ff] dark:bg-white dark:text-[#0a0e1a] dark:group-hover:bg-[#7aa3ff] dark:group-hover:text-white">
                    {p.metric || "Proyecto"}
                  </span>
                </div>
              </article>
            ))}
      </div>

      {!loading && filtered.length === 0 && (
        <p className="py-12 text-center text-[#99a1af] dark:text-[#a1a8b3]">
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
    </section>
  );
}
