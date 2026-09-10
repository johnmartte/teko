"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/portafolio", label: "Portafolio" },
  { href: "/plataformas", label: "Plataformas" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/precios", label: "Precios" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
      {/* Mobile backdrop */}
      <div
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
      />

      <header className="fixed left-0 top-0 z-50 w-full px-4 py-4 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" aria-label="Ir al inicio" className="shrink-0 flex items-center gap-3">
            <Image
              src="/Isologo-White.svg"
              alt="TEKO"
              width={52}
              height={52}
              priority
            />
            <span
              className="hidden sm:block text-[17px] font-semibold tracking-[-0.02em]"
              style={{ color: "#f2f3f5" }}
            >
              teko
            </span>
          </Link>

          {/* Desktop Nav pill */}
          <nav
            className="hidden md:flex items-center gap-1 rounded-full px-2 py-2"
            style={{
              background: "rgba(14,17,26,0.72)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {NAV_LINKS.map(({ href, label }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname?.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative flex h-9 items-center justify-center rounded-full px-4 text-[13px] font-medium transition-all duration-200"
                  style={{
                    background: isActive
                      ? "rgba(255,255,255,0.08)"
                      : "transparent",
                    color: isActive
                      ? "#f2f3f5"
                      : "rgba(242,243,245,0.7)",
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right side CTAs */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link
              href="/portal"
              className="inline-flex h-10 items-center rounded-full px-5 text-[13px] font-semibold transition-all duration-200"
              style={{
                border: "1px solid rgba(255,255,255,0.18)",
                color: "rgba(242,243,245,0.85)",
                background: "rgba(255,255,255,0.05)",
              }}
            >
              Portal Cliente
            </Link>
            <Link
              href="/contacto"
              className="inline-flex h-10 items-center gap-2 rounded-full px-5 text-[13px] font-semibold text-[#080a0f] transition-all duration-200 hover:brightness-90"
              style={{ background: "#f2f3f5" }}
            >
              Agendar
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2.5 7h9M7.5 3.5 11 7l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl transition-all duration-200"
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.06)",
              color: "#f2f3f5",
            }}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMobileMenuOpen ? "max-h-[520px] opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"
          }`}
        >
          <div
            className="mx-auto max-w-7xl rounded-2xl px-4 py-5"
            style={{
              background: "rgba(14,17,26,0.92)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label }) => {
                const isActive =
                  href === "/" ? pathname === "/" : pathname?.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-base font-medium transition-all duration-200"
                    style={{
                      color: isActive ? "#f2f3f5" : "rgba(242,243,245,0.7)",
                      background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                    }}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
            <div
              className="mt-4 pt-4"
              style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
            >
              <Link
                href="/contacto"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-[#080a0f] transition-all duration-200 hover:brightness-90"
                style={{ background: "#f2f3f5" }}
              >
                Agendar una llamada
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2.5 7h9M7.5 3.5 11 7l-3.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
