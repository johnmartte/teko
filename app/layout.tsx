import type { Metadata } from "next";
import "./../style/globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import Header from "@/components/globales/Header";
import Footer from "@/components/globales/Footer";
import { ThemeProvider } from "@/components/providers/theme-provider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "TEKO",
  description: "",
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
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
