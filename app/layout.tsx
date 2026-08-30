import type { Metadata } from "next";
import "./../style/globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "TEKO | Desarrollo de Software & Transformación Digital en RD",
    template: "%s | TEKO",
  },
  description:
    "Agencia de desarrollo de software en República Dominicana. Creamos plataformas web, aplicaciones móviles, sistemas empresariales y APIs a medida para empresas que quieren crecer con tecnología. Más de 50 proyectos entregados.",
  keywords: [
    "desarrollo de software República Dominicana",
    "agencia digital RD",
    "desarrollo web a medida",
    "aplicaciones móviles RD",
    "transformación digital",
    "software empresarial",
    "diseño UX/UI",
    "APIs y backend",
    "TEKO",
    "teko.do",
  ],
  authors: [{ name: "TEKO" }],
  creator: "TEKO",
  metadataBase: new URL("https://www.teko.do"),
  openGraph: {
    type: "website",
    locale: "es_DO",
    url: "https://www.teko.do",
    siteName: "TEKO",
    title: "TEKO | Desarrollo de Software & Transformación Digital",
    description:
      "Creamos productos digitales que transforman negocios: sitios web, apps móviles, sistemas internos y APIs. Agenda una cita sin compromiso.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TEKO | Desarrollo de Software & Transformación Digital",
    description:
      "Creamos productos digitales que transforman negocios: sitios web, apps móviles, sistemas internos y APIs. Agenda una cita sin compromiso.",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn("h-full ", "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col bg-white text-[#101828] transition-colors duration-300 dark:bg-[#0a0e1a] dark:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
