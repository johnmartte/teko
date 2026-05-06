"use client";

import { useAuth } from "@/components/portal/auth/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";

export default function PerfilPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="mx-auto max-w-[600px] space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#101828] dark:text-white">Mi Perfil</h1>
        <p className="mt-1 text-sm text-[#7a8595] dark:text-white/40">
          Tu informacion de cuenta.
        </p>
      </div>

      {/* Avatar + name */}
      <div className="flex items-center gap-4 rounded-2xl border border-[#e6eaf2] bg-white p-6 dark:border-white/10 dark:bg-[#0f1525]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-[#1ec4ff] to-[#0047ff] text-xl font-bold text-white">
          {user.firstName[0]}{user.lastName[0]}
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#101828] dark:text-white">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-sm text-[#7a8595] dark:text-white/40">{user.company}</p>
          <p className="text-[11px] text-[#99a1af] dark:text-white/25">
            Cliente desde{" "}
            {new Date(user.createdAt).toLocaleDateString("es-DO", { month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Form (read-only for now) */}
      <div className="space-y-4 rounded-2xl border border-[#e6eaf2] bg-white p-6 dark:border-white/10 dark:bg-[#0f1525]">
        <h3 className="text-sm font-semibold text-[#101828] dark:text-white">
          Informacion personal
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[#7a8595] dark:text-white/40">
              Nombre
            </label>
            <Input
              value={user.firstName}
              readOnly
              className="h-11 rounded-xl border-[#e6eaf2] bg-[#f8f9fb] text-[#101828] dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[#7a8595] dark:text-white/40">
              Apellido
            </label>
            <Input
              value={user.lastName}
              readOnly
              className="h-11 rounded-xl border-[#e6eaf2] bg-[#f8f9fb] text-[#101828] dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-[#7a8595] dark:text-white/40">
            Email
          </label>
          <Input
            value={user.email}
            readOnly
            className="h-11 rounded-xl border-[#e6eaf2] bg-[#f8f9fb] text-[#101828] dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-[#7a8595] dark:text-white/40">
            Empresa
          </label>
          <Input
            value={user.company}
            readOnly
            className="h-11 rounded-xl border-[#e6eaf2] bg-[#f8f9fb] text-[#101828] dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-[#7a8595] dark:text-white/40">
            Telefono
          </label>
          <Input
            value={user.phone ?? ""}
            readOnly
            className="h-11 rounded-xl border-[#e6eaf2] bg-[#f8f9fb] text-[#101828] dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </div>

        <p className="text-[11px] text-[#99a1af] dark:text-white/25">
          Para actualizar tu informacion, contacta a tu gestor de proyecto.
        </p>
      </div>
    </div>
  );
}
