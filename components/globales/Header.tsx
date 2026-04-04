"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import LogoTeko from "@/public/LogoTeko.svg";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full px-5 py-4 transition-all duration-500 ${
        isScrolled
          ? "bg-blue-500 backdrop-blur-xl border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.15)]"
          : "bg-white/0 backdrop-blur-sx "
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div>
          <Image src={LogoTeko} alt="Logo TEKO" />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          <nav className="flex items-center gap-6">
            <Link href="/servicios" className="text-white/90 hover:text-white transition-colors text-sm font-medium">Servicios</Link>
            <Link href="/portafolio" className="text-white/90 hover:text-white transition-colors text-sm font-medium">Portafolio</Link>
            <Link href="/nosotros" className="text-white/90 hover:text-white transition-colors text-sm font-medium">Nosotros</Link>
            <Link href="/precios" className="text-white/90 hover:text-white transition-colors text-sm font-medium">Precios</Link>
            <Link href="/contacto" className="text-white/90 hover:text-white transition-colors text-sm font-medium">Contacto</Link>
          </nav>
          <Button className="px-6 py-5 rounded-full text-sm font-semibold text-white bg-white/15 border border-white/30 hover:bg-white/25 backdrop-blur-sm transition-all duration-300 shadow-[0_2px_12px_rgba(255,255,255,0.1)]">
            Agenda una llamada
          </Button>
        </div>

        {/* Botón Menú Móvil */}
        <div className="md:hidden">
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
        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] px-6 py-6">
          <nav className="flex flex-col gap-1">
            {[
              { href: "/servicios", label: "Servicios" },
              { href: "/portafolio", label: "Portafolio" },
              { href: "/nosotros", label: "Nosotros" },
              { href: "/precios", label: "Precios" },
              { href: "/contacto", label: "Contacto" },
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
            <Button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full rounded-full py-5 text-sm font-semibold text-white bg-white/15 border border-white/30 hover:bg-white/25 backdrop-blur-sm transition-all duration-300"
            >
              Agenda una llamada
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
