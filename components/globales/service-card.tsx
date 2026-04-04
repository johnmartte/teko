"use client";

import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ServiceCard } from "@/shared/types";

export function ServiceCard({
  icon,
  badge,
  title,
  description,
  accentText = "text-primary",
}: ServiceCard) {
  return (
    <Card className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
      <CardHeader className="flex flex-row items-center gap-3 p-0 pb-4">
        <span className={cn("shrink-0", accentText)}>{icon}</span>
        <span
          className={cn(
            "rounded-full bg-current/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest",
            accentText
          )}
        >
          {badge}
        </span>
      </CardHeader>
      <CardContent className="p-0">
        <h3 className="mb-3 text-base font-bold text-foreground">{title}</h3>
        <div className="prose prose-sm text-muted-foreground [&_ul]:list-none [&_ul]:pl-0 [&_li]:flex [&_li]:items-start [&_li]:gap-2 [&_li]:before:mt-2 [&_li]:before:h-1.5 [&_li]:before:w-1.5 [&_li]:before:shrink-0 [&_li]:before:rounded-full [&_li]:before:bg-current">
          <ReactMarkdown>{description}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
