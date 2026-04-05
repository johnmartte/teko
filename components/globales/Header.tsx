"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import LogoTeko from "@/public/LogoTeko.svg";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isServicesRoute = pathname?.startsWith("/servicios");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full px-4 py-0 md:px-20 transition-all duration-500 ${
        isServicesRoute || isScrolled
          ? "bg-[#0b6eff]/95 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" aria-label="Ir al inicio" className="relative h-[54px] w-[157px]">
          <Image src={LogoTeko} alt="Logo TEKO" fill className="object-contain" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-0">
          <nav className="flex items-center">
            <Link href="/servicios" className="flex h-[72px] w-[100px] items-center justify-center text-[14px] font-medium text-white transition-colors hover:text-white/85">Servicios</Link>
            <Link href="/portafolio" className="flex h-[72px] w-[100px] items-center justify-center text-[14px] font-medium text-white transition-colors hover:text-white/85">Portafolio</Link>
            <Link href="/nosotros" className="flex h-[72px] w-[100px] items-center justify-center text-[14px] font-medium text-white transition-colors hover:text-white/85">Nosotros</Link>
            <Link href="/precios" className="flex h-[72px] w-[100px] items-center justify-center text-[14px] font-medium text-white transition-colors hover:text-white/85">Precios</Link>
            <Link href="/contacto" className="flex h-[72px] w-[100px] items-center justify-center text-[14px] font-medium text-white transition-colors hover:text-white/85">Contacto</Link>
          </nav>
          <div className="w-10" aria-hidden="true" />
          <Button className="h-10 w-[154px] rounded-full bg-[rgba(0,71,255,0.5)] px-4 text-[13px] font-medium text-white hover:bg-[rgba(0,71,255,0.6)]">
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
        <div className=" px-6 py-6">
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
