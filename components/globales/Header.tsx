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
      className={`fixed left-0 top-0 z-50 w-full px-5 py-5 transition-all duration-300 ${
        isScrolled ? "bg-blue-500 text-white shadow-md" : "bg-transparent text-white"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div>
          <Image src={LogoTeko} alt="Logo TEKO" />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-3">
          <nav className="flex items-center gap-5">
            {/* Agregué 'Precios' para que coincida con tu imagen */}
            <Link href="/servicios" className="hover:text-blue-100 transition-colors">Servicios</Link>
            <Link href="/portafolio" className="hover:text-blue-100 transition-colors">Portafolio</Link>
            <Link href="/nosotros" className="hover:text-blue-100 transition-colors">Nosotros</Link>
            <Link href="/precios" className="hover:text-blue-100 transition-colors">Precios</Link>
            <Link href="/contacto" className="hover:text-blue-100 transition-colors">Contacto</Link>
          </nav>
          {/* Botón un tono más oscuro para que resalte del fondo */}
          <Button className="px-6 py-5 bg-blue-600 text-white hover:bg-blue-700 rounded-full">
            Agenda una llamada
          </Button>
        </div>

        {/* Botón Menú Móvil */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="p-1 focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 top-full w-full bg-blue-500 text-white shadow-lg md:hidden">
          <nav className="flex flex-col items-center gap-5 py-8">
            <Link href="/servicios" onClick={() => setIsMobileMenuOpen(false)}>Servicios</Link>
            <Link href="/portafolio" onClick={() => setIsMobileMenuOpen(false)}>Portafolio</Link>
            <Link href="/nosotros" onClick={() => setIsMobileMenuOpen(false)}>Nosotros</Link>
            <Link href="/precios" onClick={() => setIsMobileMenuOpen(false)}>Precios</Link>
            <Link href="/contacto" onClick={() => setIsMobileMenuOpen(false)}>Contacto</Link>
            <Button className="mt-4 rounded-full bg-blue-600 px-6 py-5 text-white hover:bg-blue-700">
              Agenda una llamada
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}