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
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
      />

      <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4" style={{ pointerEvents: "none" }}>
        {/* Single centered pill — matches design */}
        <div
          className="flex items-center gap-1.5 rounded-full"
          style={{
            pointerEvents: "auto",
            padding: "6px 6px 6px 14px",
            background: "rgba(14,17,26,0.72)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(18px) saturate(140%)",
            WebkitBackdropFilter: "blur(18px) saturate(140%)",
            boxShadow: "0 20px 60px -20px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)",
            maxWidth: "100%",
          }}
        >
          {/* Logo */}
          <Link href="/" aria-label="TEKO" className="mr-2 flex items-center">
            <Image src="/Isologo-White.svg" alt="TEKO" width={100} height={26} className="block" style={{ height: "26px", width: "auto" }} priority />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden items-center gap-0.5 text-[13px] font-medium md:flex">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = href === "/" ? pathname === "/" : pathname?.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="rounded-full px-3 py-2 transition-colors duration-200"
                  style={{
                    color: isActive ? "#fff" : "rgba(242,243,245,0.7)",
                    background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Portal Cliente — desktop only */}
          <Link
            href="/portal"
            className="hidden rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 hover:bg-white/[0.06] md:inline-flex"
            style={{
              marginLeft: "6px",
              color: "rgba(242,243,245,0.85)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            Portal Cliente
          </Link>

          {/* Agendar CTA */}
          <Link
            href="/contacto"
            className="hidden items-center gap-2 rounded-full px-4 py-[9px] text-[13px] font-semibold transition-colors duration-200 hover:bg-[#e8ecf5] md:inline-flex"
            style={{ background: "#fff", color: "#080a0f", whiteSpace: "nowrap" }}
          >
            Agendar
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" /></svg>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="ml-1 rounded-full p-2 transition-colors duration-200 md:hidden"
            style={{ color: "#f2f3f5", background: "rgba(255,255,255,0.06)" }}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile dropdown — below the pill */}
      <div
        className={`fixed inset-x-0 top-[72px] z-50 px-4 md:hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div
          className="mx-auto max-w-md rounded-2xl px-4 py-5"
          style={{
            background: "rgba(14,17,26,0.92)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 20px 60px -20px rgba(0,0,0,0.8)",
          }}
        >
          <nav className="flex flex-col gap-1">
            {[...NAV_LINKS, { href: "/portal", label: "Portal Cliente" }].map(({ href, label }) => {
              const isActive = href === "/" ? pathname === "/" : pathname?.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium transition-all duration-200"
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
          <div className="mt-4 border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <Link
              href="/contacto"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-colors duration-200 hover:bg-[#e8ecf5]"
              style={{ background: "#f2f3f5", color: "#080a0f" }}
            >
              Agendar una cita
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" /></svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
