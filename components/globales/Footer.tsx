'use client'

import { Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import LogoTeko from "@/public/LogoTeko.png";
import Isologo from "@/public/Isologo.svg";

import { FiGithub } from "react-icons/fi";
import { FaLinkedinIn } from "react-icons/fa6";
import { FaInstagram} from "react-icons/fa";

export default function Footer() {
  const footerLinks = [
    {
      title: "PRODUCTOS",
      links: [
        { label: "Plataformas Web", href: "/plataformas", type:"page"},
        { label: "Apps Móviles", href: "/portafolio", type: "page"},
        { label: "Sistemas", href: "/servicios", type: "page"},
        { label: "API & Backend", href: "/servicios", type: "page"},
        { label: "Integraciones", href: "/servicios", type: "page"},
      ],
    },
    {
      title: "EMPRESA",
      links: [ 
        { label: "CRM", href: "/portafolio", type: "page"},
        { label: "Pagos",href: "/precios", type: "page"},
        { label: "Funciones", href: "/", type: "page"},
        { label: "Características", href: "/servicios", type: "page"},
        { label: "Blog", href: "/", type: "page"},
      ],
    },
    {
      title: "RECURSOS",
      links: [
        { label: "Centro de Ayuda", href: "/contacto", type: "page"},
        { label: "Demo", href: "/", type: "page" },
        { label: "Estado del Servidor", href: "/", type: "page"},
        { label: "Partners", href: "/", type: "page"},
      ],
    },
    {
      title: "NOSOTROS",
      links: [
        { label: "Sobre TEKO", href: "/nosotros", type: "page"},
        { label: "Contacto", href: "/contacto", type: "page"},
        { label: "Carreras", href: "/nosotros", type: "page"},
        { label: "Prensa", href: "/", type: "page"},
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#f3f4f6] pt-16 pb-8 text-[#101828] border-t border-[#e5e7eb] dark:bg-[#0b1226] dark:text-white dark:border-white/10">
      {/* Resplandor superior: la luz de marca entra por arriba */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0b6eff]/30 to-transparent dark:via-[#0b6eff]/70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[640px] -translate-x-1/2 rounded-full bg-[#0b6eff]/5 blur-3xl dark:bg-[#0b6eff]/15"
      />
      <div className="relative mx-auto w-full px-6 md:px-12">
        {/* Sección Superior: Grid principal */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-6 lg:gap-8">
          {/* Columna Izquierda (Brand & Descripción) - Ocupa 2 columnas en desktop */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="mb-6 flex items-center gap-2">
              <div className="relative h-8 w-28">
                <Image src={Isologo} alt="Logo TEKO" fill className="object-contain object-left dark:hidden" />
                <Image src={LogoTeko} alt="Logo TEKO" fill className="hidden object-contain object-left dark:block" />
              </div>
            </div>

            {/* Descripción */}
            <p className="mb-8 max-w-sm text-sm leading-relaxed text-[#7a8595] dark:text-white/80">
              Software que transforma negocios. Diseñamos, desarrollamos e
              implementamos soluciones digitales a medida.
            </p>

            {/* Redes Sociales */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/teko.dr/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d5d7da] text-[#7a8595] transition-colors hover:bg-[#e5e7eb] hover:text-[#101828] dark:border-white/20 dark:text-white dark:hover:bg-white/20"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d5d7da] text-[#7a8595] transition-colors hover:bg-[#e5e7eb] hover:text-[#101828] dark:border-white/20 dark:text-white dark:hover:bg-white/20"
              >
                <FaLinkedinIn className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d5d7da] text-[#7a8595] transition-colors hover:bg-[#e5e7eb] hover:text-[#101828] dark:border-white/20 dark:text-white dark:hover:bg-white/20"
              >
                <FiGithub className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d5d7da] text-[#7a8595] transition-colors hover:bg-[#e5e7eb] hover:text-[#101828] dark:border-white/20 dark:text-white dark:hover:bg-white/20"
              >
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Columnas de Enlaces */}
          {footerLinks.map((column, index) => (
            <div key={index} className="lg:col-span-1">
              <h4 className="mb-6 text-sm font-semibold tracking-wider text-[#101828] dark:text-white">
                {column.title}
              </h4>
              <ul className="space-y-4">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.type === "page" ? (
                      <Link
                        href={link.href}
                        className="text-sm text-[#7a8595] transition-colors hover:text-[#101828]"
                      >
                        {link.label}
                      </Link>
                    ) : (
                    <a
                      href="#"
                      className="text-sm text-[#7a8595] transition-colors hover:text-[#101828] dark:text-white/80 dark:hover:text-white"
                    >
                      {link.label}
                    </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Marca fantasma: la palabra cierra la página como firma */}
        <p
          aria-hidden="true"
          className="font-advercase pointer-events-none mt-14 -mb-4 select-none text-center text-[22vw] font-bold leading-[0.78] tracking-tight text-[#101828]/[0.04] lg:text-[17vw] dark:text-white/[0.045]"
        >
          teko
        </p>

        {/* Separador */}
        <hr className="my-10 border-[#e5e7eb] dark:border-white/10" />

        {/* Sección Inferior: Copyright y Legales */}
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-[#7a8595] dark:text-white/60 md:flex-row">
          <p>© 2026 TEKO. Todos los derechos reservados.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/politica-de-cookies" className="transition-colors hover:text-[#101828] dark:hover:text-white">
              Política de Cookies
            </Link>
            <Link href="/politica-de-privacidad" className="transition-colors hover:text-[#101828] dark:hover:text-white">
              Política de Privacidad
            </Link>
            <Link href="/terminos-y-condiciones" className="transition-colors hover:text-[#101828] dark:hover:text-white">
              Términos y Condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}