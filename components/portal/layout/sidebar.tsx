"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LogoTeko from "@/public/LogoTeko.png";
import {
  LayoutDashboard,
  FolderKanban,
  CalendarDays,
  FileBox,
  Receipt,
  Bell,
  UserCircle,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import SidebarNavItem from "./sidebar-nav-item";
import { useAuth } from "@/components/portal/auth/auth-context";
import ThemeToggle from "@/components/globales/theme-toggle";

const navItems = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/proyectos", label: "Proyectos", icon: FolderKanban },
  { href: "/portal/reuniones", label: "Reuniones", icon: CalendarDays },
  { href: "/portal/archivos", label: "Archivos", icon: FileBox },
  { href: "/portal/facturacion", label: "Facturacion", icon: Receipt },
  { href: "/portal/mensajes", label: "Mensajes", icon: Bell },
  { href: "/portal/perfil", label: "Mi Perfil", icon: UserCircle },
];

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = "" }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();

  return (
    <aside
      className={`flex h-screen flex-col border-r border-[var(--border-default)] bg-[var(--bg-surface)] transition-all duration-300 ${
        collapsed ? "w-[68px]" : "w-[240px]"
      } ${className}`}
    >
      {/* Logo + collapse toggle */}
      <div className="flex items-center justify-between px-4 py-5">
        {!collapsed && (
          <Link href="/portal" className="relative h-[36px] w-[105px] shrink-0">
            <Image src={LogoTeko} alt="TEKO" fill className="object-contain dark:brightness-0 dark:invert" priority />
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-hover)] cursor-pointer"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {navItems.map((item) => (
          <SidebarNavItem key={item.href} {...item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer: theme + user + logout */}
      <div className="border-t border-[var(--border-subtle)] px-3 py-4">
        <div className={`flex items-center gap-2 ${collapsed ? "justify-center" : "mb-3"}`}>
          <ThemeToggle className="h-8 w-8 border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]" />
        </div>

        {!collapsed && user && (
          <div className="mb-3 rounded-xl bg-[var(--bg-subtle)] px-3 py-2.5">
            <p className="truncate text-[12px] font-semibold text-[var(--text-primary)]">
              {user.firstName} {user.lastName}
            </p>
            <p className="truncate text-[11px] text-[var(--text-faint)]">
              {user.company}
            </p>
          </div>
        )}

        <button
          onClick={logout}
          className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[var(--text-tertiary)] transition-colors hover:bg-[var(--accent-red-bg)] hover:text-[var(--accent-red)] cursor-pointer ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Cerrar sesion</span>}
        </button>
      </div>
    </aside>
  );
}
