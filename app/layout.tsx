import type { Metadata } from "next";
import "./../style/globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "TEKO — Agencia de Transformación Digital",
    template: "%s | TEKO",
  },
  description:
    "Diseñamos, desarrollamos e implementamos soluciones digitales a medida: plataformas web, apps móviles, sistemas empresariales y APIs. +50 proyectos entregados en RD y LATAM.",
  keywords: [
    "agencia digital",
    "desarrollo web",
    "apps móviles",
    "transformación digital",
    "software a medida",
    "República Dominicana",
    "TEKO",
  ],
  authors: [{ name: "TEKO" }],
  creator: "TEKO",
  metadataBase: new URL("https://www.teko.do"),
  openGraph: {
    type: "website",
    locale: "es_DO",
    url: "https://www.teko.do",
    siteName: "TEKO",
    title: "TEKO — Agencia de Transformación Digital",
    description:
      "Construimos productos digitales que transforman tu negocio. Plataformas web, apps móviles, sistemas y APIs a medida.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TEKO — Agencia de Transformación Digital",
    description:
      "Construimos productos digitales que transforman tu negocio. Plataformas web, apps móviles, sistemas y APIs a medida.",
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
      lang="en"
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
