'use client'
import { Globe, LayoutGrid } from "lucide-react";

import { FiGithub } from "react-icons/fi";
import { FaLinkedinIn } from "react-icons/fa6";
import { CiTwitter } from "react-icons/ci";

export default function Footer() {
  const footerLinks = [
    {
      title: "PRODUCTOS",
      links: [
        "Plataformas Web",
        "Apps Móviles",
        "Sistemas",
        "API & Backend",
        "Integraciones",
      ],
    },
    {
      title: "EMPRESA",
      links: ["CRM", "Pagos", "Funciones", "Características", "Blog"],
    },
    {
      title: "RECURSOS",
      links: [
        "Centro de Ayuda",
        "Demo",
        "Estado del Servidor",
        "Blog",
        "Partners",
      ],
    },
    {
      title: "NOSOTROS",
      links: [
        "Sobre TEKO",
        "Contacto",
        "Características",
        "Carreras",
        "Prensa",
      ],
    },
  ];

  return (
    <footer className="bg-[#1880ff] pt-16 pb-8 text-white dark:bg-[#0f1525] dark:border-t dark:border-white/10">
      <div className="mx-auto w-full  px-6 md:px-12">
        {/* Sección Superior: Grid principal */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-6 lg:gap-8">
          {/* Columna Izquierda (Brand & Descripción) - Ocupa 2 columnas en desktop */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/20">
                <LayoutGrid className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">teko.</span>
            </div>

            {/* Descripción */}
            <p className="mb-8 max-w-sm text-sm leading-relaxed text-white/80">
              Software que transforma negocios. Diseñamos, desarrollamos e
              implementamos soluciones digitales a medida.
            </p>

            {/* Redes Sociales */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white/20"
              >
                <CiTwitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white/20"
              >
                <FaLinkedinIn className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white/20"
              >
                <FiGithub className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white/20"
              >
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Columnas de Enlaces */}
          {footerLinks.map((column, index) => (
            <div key={index} className="lg:col-span-1">
              <h4 className="mb-6 text-sm font-semibold tracking-wider text-white">
                {column.title}
              </h4>
              <ul className="space-y-4">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-sm text-white/80 transition-colors hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Separador */}
        <hr className="my-10 border-white/10" />

        {/* Sección Inferior: Copyright y Legales */}
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-white/60 md:flex-row">
          <p>© 2026 TEKO. Todos los derechos reservados.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="transition-colors hover:text-white">
              Política de Cookies
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Política de Privacidad
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Términos y Condiciones
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
