"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import type { Milestone } from "@/shared/portal-types";
import gsap from "gsap";

export default function MilestoneTimeline({ milestones }: { milestones: Milestone[] }) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(listRef.current!.children, {
        x: -20,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.1,
        clearProps: "transform,opacity",
      });
    }, listRef);
    return () => ctx.revert();
  }, []);

  const sorted = [...milestones].sort((a, b) => a.order - b.order);

  return (
    <div ref={listRef} className="space-y-0">
      {sorted.map((ms, i) => {
        const isLast = i === sorted.length - 1;
        return (
          <div key={ms.id} className="flex gap-4">
            {/* Vertical line + icon */}
            <div className="flex flex-col items-center">
              {ms.status === "completado" ? (
                <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-500" />
              ) : ms.status === "en_progreso" ? (
                <div className="relative">
                  <Loader2 className="h-6 w-6 shrink-0 animate-spin text-[#0047ff] dark:text-[#7aa3ff]" />
                </div>
              ) : (
                <Circle className="h-6 w-6 shrink-0 text-[#d0d5dd] dark:text-white/20" />
              )}
              {!isLast && (
                <div
                  className={`w-0.5 flex-1 min-h-[32px] ${
                    ms.status === "completado"
                      ? "bg-emerald-500/30"
                      : "bg-[#e6eaf2] dark:bg-white/10"
                  }`}
                />
              )}
            </div>

            {/* Content */}
            <div className="pb-6">
              <h4
                className={`text-sm font-semibold ${
                  ms.status === "completado"
                    ? "text-[#101828] dark:text-white"
                    : ms.status === "en_progreso"
                      ? "text-[#0047ff] dark:text-[#7aa3ff]"
                      : "text-[#7a8595] dark:text-white/40"
                }`}
              >
                {ms.title}
              </h4>
              <p className="mt-0.5 text-[12px] text-[#7a8595] dark:text-white/40">
                {ms.description}
              </p>
              <p className="mt-1 text-[11px] text-[#99a1af] dark:text-white/25">
                {ms.completedAt
                  ? `Completado ${new Date(ms.completedAt).toLocaleDateString("es-DO", { month: "short", day: "numeric", year: "numeric" })}`
                  : `Fecha estimada: ${new Date(ms.dueDate).toLocaleDateString("es-DO", { month: "short", day: "numeric", year: "numeric" })}`}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
