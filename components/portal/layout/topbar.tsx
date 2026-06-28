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
    <header className="flex h-16 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onMobileMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-hover)] md:hidden cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm">
          <Link
            href="/portal"
            className="text-[var(--text-tertiary)] transition-colors hover:text-[var(--brand)]"
          >
            Portal
          </Link>
          {pageTitle !== "Dashboard" && (
            <>
              <span className="text-[var(--text-ghost)]">/</span>
              <Link
                href={matchedRoute ?? "/portal"}
                className="text-[var(--text-primary)] font-medium"
              >
                {pageTitle}
              </Link>
            </>
          )}
          {isProjectDetail && (
            <>
              <span className="text-[var(--text-ghost)]">/</span>
              <span className="text-[var(--text-primary)] font-medium">Detalle</span>
            </>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <Link
          href="/portal/mensajes"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-hover)]"
        >
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent-red)] px-1 text-[9px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* User avatar */}
        {user && (
          <Link
            href="/portal/perfil"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-[var(--brand-alt)] to-[var(--brand)] text-xs font-bold text-white"
          >
            {user.firstName[0]}
            {user.lastName[0]}
          </Link>
        )}
      </div>
    </header>
  );
}
