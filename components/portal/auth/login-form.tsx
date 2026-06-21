"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "./auth-context";
import gsap from "gsap";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!formRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(formRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    }, formRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        router.push("/portal");
      } else {
        setError("Credenciales incorrectas.");
      }
    } catch {
      setError("Error al iniciar sesion. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="w-full max-w-[420px] space-y-6 rounded-3xl border border-white/20 bg-white/10 p-8 shadow-[0_8px_40px_-12px_rgba(0,71,255,0.4)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_40px_-12px_rgba(30,196,255,0.3)]"
      style={{ WebkitBackdropFilter: "blur(40px) saturate(140%)" }}
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-white">Bienvenido</h1>
        <p className="text-sm text-white/60">
          Inicia sesion para acceder a tu portal de cliente
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-xl border-white/20 bg-white/10 pl-11 text-white placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-[#0047ff]"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input
            type="password"
            placeholder="Contrasena"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-xl border-white/20 bg-white/10 pl-11 text-white placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-[#0047ff]"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#1ec4ff] via-[#0b6eff] to-[#0047ff] text-sm font-semibold text-white shadow-[0_8px_24px_-6px_rgba(11,110,255,0.6)] transition-all duration-300 hover:shadow-[0_10px_30px_-6px_rgba(11,110,255,0.8)] hover:brightness-110 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            Iniciar sesion
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      <p className="text-center text-xs text-white/40">
        ¿No tienes acceso? Contacta a tu gestor de proyecto.
      </p>
    </form>
  );
}
