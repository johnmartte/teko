"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { useAuth } from "@/components/portal/auth/auth-context";
import { getUnreadNotificationsCount } from "@/Data/portal/mock-helpers";

const routeLabels: Record<string, string> = {
  "/portal": "Dashboard",
  "/portal/proyectos": "Proyectos",
  "/portal/reuniones": "Reuniones",
  "/portal/archivos": "Archivos",
  "/portal/facturacion": "Facturacion",
  "/portal/mensajes": "Mensajes",
  "/portal/perfil": "Mi Perfil",
};

interface TopbarProps {
  onMobileMenuToggle?: () => void;
}

export default function Topbar({ onMobileMenuToggle }: TopbarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const unreadCount = getUnreadNotificationsCount();

  // Build breadcrumb
  const matchedRoute = Object.keys(routeLabels)
    .sort((a, b) => b.length - a.length)
    .find((route) => pathname?.startsWith(route));
  const pageTitle = matchedRoute ? routeLabels[matchedRoute] : "Portal";

  // Check if we're on a project detail page
  const isProjectDetail = pathname?.match(/\/portal\/proyectos\/.+/);

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#e6eaf2] bg-white/60 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#0c1120]/60 md:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onMobileMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#7a8595] transition-colors hover:bg-[#f4f7ff] md:hidden dark:text-white/40 dark:hover:bg-white/5"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm">
          <Link
            href="/portal"
            className="text-[#7a8595] transition-colors hover:text-[#0047ff] dark:text-white/40 dark:hover:text-white/70"
          >
            Portal
          </Link>
          {pageTitle !== "Dashboard" && (
            <>
              <span className="text-[#d0d5dd] dark:text-white/20">/</span>
              <Link
                href={matchedRoute ?? "/portal"}
                className="text-[#101828] font-medium dark:text-white"
              >
                {pageTitle}
              </Link>
            </>
          )}
          {isProjectDetail && (
            <>
              <span className="text-[#d0d5dd] dark:text-white/20">/</span>
              <span className="text-[#101828] font-medium dark:text-white">Detalle</span>
            </>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <Link
          href="/portal/mensajes"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#7a8595] transition-colors hover:bg-[#f4f7ff] dark:text-white/40 dark:hover:bg-white/5"
        >
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0047ff] px-1 text-[9px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* User avatar */}
        {user && (
          <Link
            href="/portal/perfil"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-[#1ec4ff] to-[#0047ff] text-xs font-bold text-white"
          >
            {user.firstName[0]}
            {user.lastName[0]}
          </Link>
        )}
      </div>
    </header>
  );
}
