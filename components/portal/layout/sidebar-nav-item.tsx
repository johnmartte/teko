"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

interface SidebarNavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  collapsed?: boolean;
}

export default function SidebarNavItem({
  href,
  label,
  icon: Icon,
  collapsed = false,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive =
    href === "/portal"
      ? pathname === "/portal"
      : pathname?.startsWith(href);

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
        isActive
          ? "bg-gradient-to-r from-[#0b6eff]/20 to-[#1ec4ff]/10 text-[#0047ff] shadow-[inset_0_0_0_1px_rgba(11,110,255,0.2)] dark:from-[#0b6eff]/15 dark:to-[#1ec4ff]/10 dark:text-[#7aa3ff]"
          : "text-[#52607a] hover:bg-[#f4f7ff] hover:text-[#0047ff] dark:text-white/50 dark:hover:bg-white/5 dark:hover:text-white/80"
      } ${collapsed ? "justify-center px-2.5" : ""}`}
    >
      <Icon
        className={`h-[18px] w-[18px] shrink-0 ${
          isActive
            ? "text-[#0047ff] dark:text-[#7aa3ff]"
            : "text-[#7a8595] dark:text-white/40"
        }`}
      />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
