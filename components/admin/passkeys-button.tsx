"use client";

import { useEffect, useState } from "react";
import { Fingerprint, Trash2 } from "lucide-react";
import { deletePasskey, isCancelled, listPasskeys, registerPasskey, usePasskeysSupported, type Passkey } from "@/lib/passkeys";

// Botón de la barra superior: activa, lista y elimina los passkeys de la cuenta.
export function PasskeysButton() {
  const supported = usePasskeysSupported();
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<Passkey[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) listPasskeys().then(setList).catch(() => setList([]));
  }, [open]);

  if (!supported) return null;

  const add = async () => {
    setBusy(true);
    setError("");
    try {
      await registerPasskey(`Dispositivo ${list.length + 1}`);
      setList(await listPasskeys());
    } catch (e) {
      if (!isCancelled(e)) setError((e as Error).message || "No se pudo activar. Inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: number) => {
    try {
      await deletePasskey(id);
      setList((l) => l.filter((p) => p.id !== id));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Acceso con Touch ID / passkey"
        title="Acceso con Touch ID / passkey"
        className="grid h-10 w-10 place-items-center rounded-full border transition-colors hover:bg-white/5"
        style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(242,243,245,0.7)" }}
      >
        <Fingerprint size={18} />
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border p-4 shadow-2xl" style={{ borderColor: "rgba(255,255,255,0.1)", background: "#0d1017", color: "#f2f3f5" }}>
          <p className="text-sm font-semibold">Acceso rápido (Touch ID)</p>
          <p className="mt-1 text-xs" style={{ color: "rgba(242,243,245,0.5)" }}>Entra con tu huella o el gestor de contraseñas. Tu contraseña sigue funcionando.</p>
          <div className="mt-3 space-y-2">
            {list.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border px-3 py-2" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs" style={{ color: "rgba(242,243,245,0.45)" }}>{p.last_used_at ? `Último uso: ${new Date(p.last_used_at).toLocaleDateString("es-DO")}` : "Sin usar aún"}</p>
                </div>
                <button onClick={() => remove(p.id)} aria-label={`Eliminar ${p.name}`} className="p-2" style={{ color: "#f87171" }}><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
          {error && <p role="alert" className="mt-2 text-xs" style={{ color: "#f87171" }}>{error}</p>}
          <button
            onClick={add}
            disabled={busy}
            className="mt-3 w-full rounded-xl py-2.5 text-sm font-semibold disabled:opacity-60"
            style={{ background: "#1ec4ff", color: "#080a0f" }}
          >
            {list.length ? "Añadir otro dispositivo" : "Activar Touch ID en este dispositivo"}
          </button>
        </div>
      )}
    </div>
  );
}
