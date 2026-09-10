"use client";

import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const FOOTER_LINKS = [
  {
    title: "PRODUCTOS",
    links: [
      { label: "Plataformas Web", href: "/plataformas" },
      { label: "Apps Móviles", href: "/portafolio" },
      { label: "Sistemas", href: "/servicios" },
      { label: "API & Backend", href: "/servicios" },
      { label: "Integraciones", href: "/servicios" },
    ],
  },
  {
    title: "EMPRESA",
    links: [
      { label: "CRM", href: "/portafolio" },
      { label: "Pagos", href: "/precios" },
      { label: "Funciones", href: "/" },
      { label: "Características", href: "/servicios" },
      { label: "Blog", href: "/" },
    ],
  },
  {
    title: "RECURSOS",
    links: [
      { label: "Centro de Ayuda", href: "/contacto" },
      { label: "Demo", href: "/" },
      { label: "Estado del Servidor", href: "/" },
      { label: "Partners", href: "/" },
    ],
  },
  {
    title: "NOSOTROS",
    links: [
      { label: "Sobre TEKO", href: "/nosotros" },
      { label: "Contacto", href: "/contacto" },
      { label: "Carreras", href: "/nosotros" },
      { label: "Prensa", href: "/" },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/teko.dr/", icon: FaInstagram },
  { label: "LinkedIn", href: "#", icon: FaLinkedinIn },
  { label: "YouTube", href: "#", icon: FaYoutube },
];

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden pt-16 pb-0"
      style={{
        background: "#070910",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-12">
        {/* Top section */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-6 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Image
                src="/Isologo-White.svg"
                alt="TEKO"
                width={36}
                height={36}
              />
            </div>

            <p
              className="mb-8 max-w-xs text-sm leading-relaxed"
              style={{ color: "rgba(242,243,245,0.55)" }}
            >
              Software que transforma negocios. Diseñamos, desarrollamos e
              implementamos soluciones digitales a medida.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200"
                  style={{
                    borderColor: "rgba(255,255,255,0.12)",
                    color: "rgba(242,243,245,0.6)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "rgba(30,196,255,0.4)";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "#1ec4ff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "rgba(255,255,255,0.12)";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "rgba(242,243,245,0.6)";
                  }}
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((column) => (
            <div key={column.title} className="lg:col-span-1">
              <h4
                className="mb-6 text-xs font-semibold tracking-widest"
                style={{ color: "rgba(242,243,245,0.4)" }}
              >
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200"
                      style={{ color: "rgba(242,243,245,0.6)" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          "#f2f3f5";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          "rgba(242,243,245,0.6)";
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Ghost text */}
        <p
          aria-hidden="true"
          className="pointer-events-none select-none mt-14 -mb-4 text-center font-bold leading-[0.78] tracking-tight"
          style={{
            fontSize: "clamp(90px, 20vw, 300px)",
            color: "rgba(255,255,255,0.035)",
          }}
        >
          teko.
        </p>

        {/* Divider */}
        <hr style={{ borderColor: "rgba(255,255,255,0.08)", margin: "2rem 0" }} />

        {/* Bottom bar */}
        <div
          className="flex flex-col items-center justify-between gap-4 pb-8 text-sm md:flex-row"
          style={{ color: "rgba(242,243,245,0.4)" }}
        >
          <p>&copy; 2026 TEKO. Todos los derechos reservados.</p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { label: "Política de Cookies", href: "/politica-de-cookies" },
              { label: "Política de Privacidad", href: "/politica-de-privacidad" },
              { label: "Términos y Condiciones", href: "/terminos-y-condiciones" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="transition-colors duration-200"
                style={{ color: "rgba(242,243,245,0.4)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#f2f3f5";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "rgba(242,243,245,0.4)";
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
