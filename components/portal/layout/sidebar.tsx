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
      className={`flex h-screen flex-col border-r border-[#e6eaf2] bg-white/80 backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-[#0c1120]/80 ${
        collapsed ? "w-[68px]" : "w-[240px]"
      } ${className}`}
      style={{ WebkitBackdropFilter: "blur(20px) saturate(140%)" }}
    >
      {/* Logo + collapse toggle */}
      <div className="flex items-center justify-between px-4 py-5">
        {!collapsed && (
          <Link href="/portal" className="relative h-[36px] w-[105px] shrink-0">
            <Image src={LogoTeko} alt="TEKO" fill className="object-contain brightness-75 contrast-125 dark:brightness-100 dark:contrast-100" priority />
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7a8595] transition-colors hover:bg-[#f4f7ff] dark:text-white/40 dark:hover:bg-white/5"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {navItems.map((item) => (
          <SidebarNavItem key={item.href} {...item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer: theme + user + logout */}
      <div className="border-t border-[#e6eaf2] px-3 py-4 dark:border-white/10">
        <div className={`flex items-center gap-2 ${collapsed ? "justify-center" : "mb-3"}`}>
          <ThemeToggle className="h-8 w-8 border-[#d5d7da] bg-white/80 text-[#252b37] hover:bg-[#f4f7ff] dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20" />
        </div>

        {!collapsed && user && (
          <div className="mb-3 rounded-xl bg-[#f4f7ff] px-3 py-2.5 dark:bg-white/5">
            <p className="truncate text-[12px] font-semibold text-[#101828] dark:text-white">
              {user.firstName} {user.lastName}
            </p>
            <p className="truncate text-[11px] text-[#7a8595] dark:text-white/40">
              {user.company}
            </p>
          </div>
        )}

        <button
          onClick={logout}
          className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#7a8595] transition-colors hover:bg-red-50 hover:text-red-600 dark:text-white/40 dark:hover:bg-red-500/10 dark:hover:text-red-400 ${
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
