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
    <Card className="flex min-h-[274.8px] w-[312px] shrink-0 flex-col items-center gap-3 overflow-visible rounded-[16px] border-[0.8px] border-[rgba(229,231,235,0.6)] bg-white p-[0.8px_0.8px_24.8px_0.8px] py-0 ring-0 shadow-none">
      <CardHeader className="flex w-full flex-row items-center gap-3 px-6 pb-4 pt-6">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-[14px] bg-current/10",
            accentText,
          )}
        >
          <span className="h-[18px] w-[18px]">{icon}</span>
        </span>
        <span
          className={cn(
            "rounded-[8px] bg-current/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.6px]",
            accentText
          )}
        >
          {badge}
        </span>
      </CardHeader>
      <CardContent className="w-full px-6 pb-6 pt-0">
        <h3 className="mb-3 text-[16.8px] font-bold leading-[25.2px] text-[#101828]">
          {title}
        </h3>
        <div
          className={cn(
            "prose prose-sm max-w-none text-[14px] leading-[22.4px] text-[#6a7282]",
            "[&_p]:m-0 [&_ul]:m-0 [&_ul]:list-none [&_ul]:space-y-[10px] [&_ul]:pl-0",
            "[&_li]:relative [&_li]:pl-4 [&_li]:leading-[22.4px]",
            "[&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[8px] [&_li]:before:h-[6px] [&_li]:before:w-[6px] [&_li]:before:rounded-full [&_li]:before:bg-current [&_li]:before:opacity-50",
            accentText,
          )}
        >
          <ReactMarkdown>{description}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
