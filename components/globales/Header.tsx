"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import LogoTeko from "@/public/LogoTeko.png";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isInnerRoute = pathname !== "/" && pathname !== null;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock scroll y fuerza compositing layer al abrir el menú móvil
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Backdrop blur cuando el menú móvil está abierto */}
      <div
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
        style={{
          backdropFilter: isMobileMenuOpen ? "blur(20px) saturate(140%)" : "blur(0px)",
          WebkitBackdropFilter: isMobileMenuOpen ? "blur(20px) saturate(140%)" : "blur(0px)",
          transform: "translateZ(0)",
          willChange: "backdrop-filter, opacity",
        }}
        className={`fixed inset-0 z-40 md:hidden bg-black/55 transition-all duration-500 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

    <header
      className={`fixed left-0 top-0 z-50 w-full px-4 py-3 md:px-10 lg:px-16 transition-all duration-500 ${
        isMobileMenuOpen ? "bg-transparent" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Ir al inicio"
          className="relative flex h-[54px] w-[157px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/30 bg-white/20 px-3 shadow-[0_8px_24px_-10px_rgba(11,110,255,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_24px_-10px_rgba(30,196,255,0.35)]"
          style={{ WebkitBackdropFilter: "blur(20px) saturate(140%)" }}
        >
          <Image src={LogoTeko} alt="Logo TEKO" fill className="object-contain p-1 translate-y-[3px]" priority />
        </Link>

        {/* Desktop Nav — pill glass centrado */}
        <nav
          className="hidden md:flex items-center gap-1 rounded-full border border-[#e6eaf2] bg-white/80 backdrop-blur-xl px-2 py-2 shadow-[0_8px_32px_-12px_rgba(16,24,40,0.18)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_32px_-12px_rgba(30,196,255,0.25)]"
          style={{ WebkitBackdropFilter: "blur(20px) saturate(140%)" }}
        >
          {[
            { href: "/", label: "Inicio" },
            { href: "/servicios", label: "Servicios" },
            { href: "/portafolio", label: "Portafolio" },
            { href: "/plataformas", label: "Plataformas" },
            { href: "/nosotros", label: "Nosotros" },
            { href: "/precios", label: "Precios" },
            { href: "/contacto", label: "Contacto" },
          ].map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex h-9 items-center justify-center rounded-full px-4 text-[13px] font-medium transition-[background-color,color,box-shadow] duration-200 ease-out ${
                  isActive
                    ? "bg-gradient-to-b from-[#1ec4ff] via-[#0b6eff] to-[#0047ff] text-white shadow-[0_4px_18px_-4px_rgba(11,110,255,0.6)]"
                    : "text-[#252b37] hover:text-[#0047ff] hover:bg-[#eef4ff] dark:text-white/85 dark:hover:text-white dark:hover:bg-white/10"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side: Portal + Contact + theme toggle */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <ThemeToggle />
          <Link
            href="/portal/login"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/30 bg-white/20 px-5 text-[13px] font-semibold text-white shadow-sm backdrop-blur-md transition-[background-color,transform] duration-200 ease-out hover:bg-white/30 active:scale-[0.97]"
          >
            Portal Cliente
          </Link>
          <Link
            href="/contacto"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-b from-[#1ec4ff] via-[#0b6eff] to-[#0047ff] px-5 text-[13px] font-semibold text-white shadow-[0_8px_24px_-6px_rgba(11,110,255,0.6)] transition-[box-shadow,filter,transform] duration-200 ease-out hover:shadow-[0_10px_30px_-6px_rgba(11,110,255,0.8)] hover:brightness-110 active:scale-[0.97]"
          >
            Contacto
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Botón Menú Móvil */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle className="h-9 w-9" />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menú Desplegable Móvil — glass panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <div className="px-4 py-5 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 backdrop-blur-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.4)]">
          <nav className="flex flex-col gap-1">
            {[
              { href: "/servicios", label: "Servicios" },
              { href: "/portafolio", label: "Portafolio" },
              { href: "/plataformas", label: "Plataformas" },
              { href: "/nosotros", label: "Nosotros" },
              { href: "/precios", label: "Precios" },
              { href: "/contacto", label: "Contacto" },
              { href: "/portal/login", label: "Portal Cliente" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 px-4 py-3 rounded-xl text-base font-medium"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 pt-4 border-t border-white/15">
            <Link
              href="/contacto"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex w-full items-center justify-center rounded-full py-3.5 text-sm font-semibold text-white bg-white/15 border border-white/30 hover:bg-white/25 backdrop-blur-sm transition-all duration-300"
            >
              Agenda una llamada
            </Link>
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
