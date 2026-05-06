"use client";

import Image from "next/image";
import LogoTeko from "@/public/LogoTeko.png";
import LoginForm from "@/components/portal/auth/login-form";
import ThemeToggle from "@/components/globales/theme-toggle";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[linear-gradient(177deg,#0071ff_10%,#ffffff_96%)] px-4 dark:bg-[radial-gradient(ellipse_at_center,#15326b_0%,#0a1838_45%,#05080f_100%)]">
      {/* Theme toggle */}
      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle />
      </div>

      {/* Logo */}
      <div className="relative mb-8 h-[54px] w-[157px]">
        <Image src={LogoTeko} alt="TEKO" fill className="object-contain" priority />
      </div>

      {/* Login form */}
      <LoginForm />
    </div>
  );
}
