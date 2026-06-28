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
      className={`flex items-center gap-2.5 rounded-[9px] px-3 py-2.5 text-[13px] transition-colors ${
        isActive
          ? "bg-[var(--brand-light)] font-semibold text-[var(--brand)]"
          : "font-medium text-[var(--text-tertiary)] hover:bg-[var(--bg-hover)]"
      } ${collapsed ? "justify-center px-2.5" : ""}`}
    >
      <Icon
        className={`h-[18px] w-[18px] shrink-0 ${
          isActive ? "text-[var(--brand)]" : "text-[var(--text-muted)]"
        }`}
      />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
