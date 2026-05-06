"use client";

import Image from "next/image";
import LogoTeko from "@/public/LogoTeko.png";
import LoginBg from "@/public/login-bg.jpg";
import LoginForm from "@/components/portal/auth/login-form";
import ThemeToggle from "@/components/globales/theme-toggle";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      {/* Background image */}
      <Image
        src={LoginBg}
        alt=""
        fill
        className="object-cover"
        priority
        placeholder="blur"
      />

      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Theme toggle */}
      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle />
      </div>

      {/* Logo */}
      <div className="relative z-10 mb-8 h-[54px] w-[157px]">
        <Image src={LogoTeko} alt="TEKO" fill className="object-contain" priority />
      </div>

      {/* Login form */}
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}
