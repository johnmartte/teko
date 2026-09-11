"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { BarChart3, BriefcaseBusiness, CircleDollarSign, FileQuestion, FolderKanban, LogOut, Menu, MessageSquareText, Search, Users, X } from "lucide-react";
import { api, type AdminUser, type ContactRequest, type DashboardStats } from "@/lib/admin-api";
import { useAdminAuth } from "./auth-provider";
import { modules } from "./cms-config";
import { RecordModule } from "./record-module";

const nav = [
  { key: "dashboard", label: "Dashboard", icon: BarChart3 },
  { key: "contacts", label: "Solicitudes", icon: MessageSquareText },
  { key: "services", label: "Servicios", icon: BriefcaseBusiness },
  { key: "service-categories", label: "Categorias de servicios", icon: FolderKanban },
  { key: "faqs", label: "FAQs", icon: FileQuestion },
  { key: "plans", label: "Planes", icon: CircleDollarSign },
  { key: "budget-ranges", label: "Presupuestos", icon: CircleDollarSign },
  { key: "portfolio-projects", label: "Portfolio", icon: FolderKanban },
  { key: "portfolio-categories", label: "Categorias portfolio", icon: FolderKanban },
  { key: "admins", label: "Administradores", icon: Users },
];

export function AdminShell() {
  const { user, loading, login, logout } = useAdminAuth();
  const [active, setActive] = useState("dashboard");
  const [mobile, setMobile] = useState(false);

  if (loading) return (
    <div className="grid min-h-screen place-items-center" style={{ background: "#080a0f" }}>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" style={{ borderColor: "#1ec4ff", borderTopColor: "transparent" }} />
    </div>
  );

  if (!user) return <Login onLogin={login} />;

  const selectedModule = modules.find((item) => item.key === active);

  return (
    <div className="min-h-screen" style={{ background: "#080a0f", color: "#f2f3f5" }}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r transition-transform lg:translate-x-0 ${mobile ? "translate-x-0" : "-translate-x-full"}`}
        style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
      >
        <div className="flex h-20 items-center justify-between border-b px-6" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <Image src="/LogoTeko.png" width={100} height={34} alt="TEKO" className="h-8 w-auto" />
          <button onClick={() => setMobile(false)} className="lg:hidden" style={{ color: "rgba(242,243,245,0.5)" }}>
            <X />
          </button>
        </div>

        <nav className="h-[calc(100vh-10rem)] overflow-y-auto p-4">
          {nav.map((item) => (
            <button
              key={item.key}
              onClick={() => { setActive(item.key); setMobile(false); }}
              className="mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors"
              style={{
                background: active === item.key ? "rgba(30,196,255,0.12)" : "transparent",
                color: active === item.key ? "#1ec4ff" : "rgba(242,243,245,0.6)",
              }}
              onMouseEnter={(e) => { if (active !== item.key) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={(e) => { if (active !== item.key) e.currentTarget.style.background = "transparent"; }}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full border-t p-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl p-3 text-sm transition-colors"
            style={{ color: "#f87171" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(248,113,113,0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <LogOut size={18} />
            Cerrar sesion
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobile && <button aria-label="Cerrar menu" onClick={() => setMobile(false)} className="fixed inset-0 z-30 bg-black/50 lg:hidden" />}

      {/* Main area */}
      <div className="lg:pl-72">
        <header
          className="sticky top-0 z-20 flex h-20 items-center justify-between border-b px-4 backdrop-blur lg:px-8"
          style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(8,10,15,0.85)" }}
        >
          <button onClick={() => setMobile(true)} className="rounded-lg p-2 lg:hidden" style={{ color: "rgba(242,243,245,0.6)" }}>
            <Menu />
          </button>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold" style={{ color: "#f2f3f5" }}>Panel administrativo</p>
            <p className="text-xs" style={{ color: "rgba(242,243,245,0.45)" }}>Contenido real de TEKO</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold" style={{ color: "#f2f3f5" }}>{user.full_name}</p>
              <p className="text-xs" style={{ color: "rgba(242,243,245,0.45)" }}>{user.email}</p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold" style={{ background: "#1ec4ff", color: "#080a0f" }}>
              {user.full_name.charAt(0)}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl p-4 lg:p-8">
          {active === "dashboard" ? <Dashboard /> : active === "contacts" ? <Contacts /> : active === "admins" ? <Admins current={user} /> : selectedModule ? <RecordModule config={selectedModule} /> : null}
        </main>
      </div>
    </div>
  );
}

function Login({ onLogin }: { onLogin: (email: string, password: string) => Promise<void> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try { await onLogin(email, password); } catch (err) { setError((err as Error).message); } finally { setBusy(false); }
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-2" style={{ background: "#080a0f" }}>
      {/* Left: decorative */}
      <div className="relative hidden overflow-hidden lg:block" style={{ background: "linear-gradient(135deg, #080a0f, #0a1628)" }}>
        <div aria-hidden="true" className="absolute inset-0" style={{ background: "radial-gradient(60% 60% at 30% 80%, rgba(30,196,255,0.12), transparent 70%)" }} />
        <div className="absolute bottom-16 left-16 max-w-lg" style={{ color: "#f2f3f5" }}>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[.25em]" style={{ color: "#1ec4ff" }}>TEKO CMS</p>
          <h1 className="text-5xl font-bold leading-tight">Gestiona lo que tus clientes ven.</h1>
          <p className="mt-5 text-lg" style={{ color: "rgba(242,243,245,0.55)" }}>Un unico lugar para contenido, solicitudes y catalogo.</p>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-6">
        <form
          onSubmit={submit}
          className="w-full max-w-md rounded-3xl border p-8 shadow-2xl"
          style={{
            borderColor: "rgba(255,255,255,0.1)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
            color: "#f2f3f5",
          }}
        >
          <Image src="/LogoTeko.png" width={120} height={40} alt="TEKO" className="mb-10 h-10 w-auto" />
          <p className="text-sm font-medium" style={{ color: "#1ec4ff" }}>Administracion</p>
          <h2 className="mt-1 text-3xl font-bold">Bienvenido de vuelta</h2>
          <p className="mt-2 text-sm" style={{ color: "rgba(242,243,245,0.5)" }}>Ingresa con tu cuenta administrativa.</p>

          {error && (
            <p className="mt-5 rounded-xl border p-3 text-sm" style={{ borderColor: "rgba(248,113,113,0.25)", background: "rgba(248,113,113,0.1)", color: "#f87171" }}>
              {error}
            </p>
          )}

          <label className="mt-8 block text-sm font-medium">
            Correo
            <input
              required
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none transition-all"
              style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#f2f3f5" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(30,196,255,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(30,196,255,0.1)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </label>

          <label className="mt-4 block text-sm font-medium">
            Contrasena
            <input
              required
              minLength={8}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none transition-all"
              style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#f2f3f5" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(30,196,255,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(30,196,255,0.1)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </label>

          <button
            disabled={busy}
            className="mt-7 w-full rounded-xl py-3 font-semibold transition-all hover:brightness-110 disabled:opacity-60"
            style={{ background: "#1ec4ff", color: "#080a0f", boxShadow: "0 8px 24px -6px rgba(30,196,255,0.45)" }}
          >
            {busy ? "Verificando..." : "Iniciar sesion"}
          </button>
        </form>
      </div>
    </main>
  );
}

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<DashboardStats>("/admin/dashboard").then(setStats).catch((e: Error) => setError(e.message));
  }, []);

  const cards = stats ? [
    { label: "Solicitudes", value: stats.contact_requests },
    { label: "Nuevas", value: stats.new_requests },
    { label: "Calificadas", value: stats.qualified_requests },
    { label: "Servicios activos", value: stats.active_services },
    { label: "Proyectos activos", value: stats.active_projects },
    { label: "FAQs activas", value: stats.active_faqs },
    { label: "Planes activos", value: stats.active_plans },
  ] : [];

  return (
    <section>
      <p className="text-sm font-medium" style={{ color: "#1ec4ff" }}>Resumen</p>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-1" style={{ color: "rgba(242,243,245,0.5)" }}>Estado actual del contenido y las oportunidades.</p>
      {error && <p className="mt-6" style={{ color: "#f87171" }}>{error}</p>}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats ? cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border p-5"
            style={{
              borderColor: "rgba(255,255,255,0.1)",
              background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
            }}
          >
            <p className="text-sm" style={{ color: "rgba(242,243,245,0.5)" }}>{card.label}</p>
            <p className="mt-2 text-3xl font-bold" style={{ color: "#f2f3f5" }}>{card.value}</p>
          </div>
        )) : [1, 2, 3, 4].map((n) => (
          <div key={n} className="h-28 animate-pulse rounded-2xl" style={{ background: "rgba(255,255,255,0.06)" }} />
        ))}
      </div>
    </section>
  );
}

const statuses = ["new", "contacted", "qualified", "closed", "discarded"];

function Contacts() {
  const [items, setItems] = useState<ContactRequest[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<ContactRequest | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = useCallback(() => {
    setError("");
    api<ContactRequest[]>("/admin/contact-requests").then(setItems).catch((e: Error) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { Promise.resolve().then(load); }, [load]);

  const filtered = useMemo(() =>
    items.filter((item) => (status === "all" || item.status === status) && JSON.stringify(item).toLowerCase().includes(search.toLowerCase())),
    [items, search, status],
  );

  const change = async (item: ContactRequest, value: string) => {
    if (updatingId !== null) return;
    setUpdatingId(item.id);
    setError("");
    setSuccess("");
    try {
      await api(`/admin/contact-requests/${item.id}/status`, { method: "PATCH", body: JSON.stringify({ status: value }) });
      setSuccess("Estado actualizado correctamente.");
      load();
    } catch (e) { setError((e as Error).message); } finally { setUpdatingId(null); }
  };

  return (
    <section>
      <h1 className="text-2xl font-bold">Solicitudes de contacto</h1>
      <p className="text-sm" style={{ color: "rgba(242,243,245,0.5)" }}>Busca, filtra, revisa y califica oportunidades reales.</p>

      <div className="my-6 flex flex-wrap gap-3">
        <label
          className="flex min-w-64 flex-1 items-center gap-2 rounded-xl border px-3"
          style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}
        >
          <Search size={16} style={{ color: "rgba(242,243,245,0.35)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nombre, email, empresa..."
            className="w-full bg-transparent py-3 outline-none"
            style={{ color: "#f2f3f5" }}
          />
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border px-4"
          style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#f2f3f5" }}
        >
          <option value="all" style={{ background: "#0d1017" }}>Todos los estados</option>
          {statuses.map((s) => <option key={s} style={{ background: "#0d1017" }}>{s}</option>)}
        </select>
      </div>

      {error && <p className="mb-4" style={{ color: "#f87171" }}>{error}</p>}
      {success && <p className="mb-4 rounded-xl p-3 text-sm" style={{ background: "rgba(74,222,128,0.12)", color: "#4ade80" }}>{success}</p>}

      {loading ? (
        <div className="h-48 animate-pulse rounded-2xl" style={{ background: "rgba(255,255,255,0.06)" }} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead style={{ background: "rgba(255,255,255,0.04)" }}>
              <tr className="text-xs uppercase" style={{ color: "rgba(242,243,245,0.4)" }}>
                {["Contacto", "Servicio", "Presupuesto", "Fecha", "Estado"].map((h) => <th key={h} className="p-4">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ ["--tw-divide-color" as string]: "rgba(255,255,255,0.06)" }}>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className="cursor-pointer transition-colors"
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <td className="p-4">
                    <b style={{ color: "#f2f3f5" }}>{item.name}</b>
                    <br />
                    <span className="text-xs" style={{ color: "rgba(242,243,245,0.45)" }}>{item.email} · {item.company || "Sin empresa"}</span>
                  </td>
                  <td className="p-4">{item.service || "—"}</td>
                  <td className="p-4">{item.budget || "—"}</td>
                  <td className="p-4">{new Date(item.created_at).toLocaleDateString("es")}</td>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      disabled={updatingId !== null}
                      value={item.status}
                      onChange={(e) => change(item, e.target.value)}
                      className="rounded-lg border px-2 py-1 disabled:opacity-50"
                      style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#f2f3f5" }}
                    >
                      {statuses.map((s) => <option key={s} style={{ background: "#0d1017" }}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="p-10 text-center" style={{ color: "rgba(242,243,245,0.4)" }}>No hay solicitudes para estos filtros.</p>}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => setSelected(null)}>
          <article
            onClick={(e) => e.stopPropagation()}
            className="h-full w-full max-w-lg overflow-y-auto p-7 shadow-2xl"
            style={{ background: "#0d1017", color: "#f2f3f5" }}
          >
            <button onClick={() => setSelected(null)} className="float-right" style={{ color: "rgba(242,243,245,0.5)" }}><X /></button>
            <p className="text-sm font-semibold" style={{ color: "#1ec4ff" }}>Solicitud #{selected.id}</p>
            <h2 className="mt-2 text-2xl font-bold">{selected.name}</h2>
            <p className="mt-1" style={{ color: "rgba(242,243,245,0.6)" }}>{selected.email}</p>
            <dl className="mt-8 grid grid-cols-2 gap-5 text-sm">
              <div><dt style={{ color: "rgba(242,243,245,0.45)" }}>Empresa</dt><dd>{selected.company || "—"}</dd></div>
              <div><dt style={{ color: "rgba(242,243,245,0.45)" }}>Telefono</dt><dd>{selected.phone || "—"}</dd></div>
              <div><dt style={{ color: "rgba(242,243,245,0.45)" }}>Servicio</dt><dd>{selected.service || "—"}</dd></div>
              <div><dt style={{ color: "rgba(242,243,245,0.45)" }}>Presupuesto</dt><dd>{selected.budget || "—"}</dd></div>
            </dl>
            <div className="mt-8 rounded-xl p-5" style={{ background: "rgba(255,255,255,0.04)" }}>
              <p className="mb-2 text-xs font-semibold uppercase" style={{ color: "rgba(242,243,245,0.4)" }}>Mensaje</p>
              <p className="whitespace-pre-wrap">{selected.message}</p>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}

function Admins({ current }: { current: AdminUser }) {
  const [items, setItems] = useState<AdminUser[]>([]);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(() => api<AdminUser[]>("/admin/admin-users").then(setItems).catch((e: Error) => setError(e.message)), []);
  useEffect(() => { Promise.resolve().then(load); }, [load]);

  const toggle = async (item: AdminUser) => {
    if (busyId !== null) return;
    setBusyId(item.id);
    setError("");
    setSuccess("");
    try {
      await api(`/admin/admin-users/${item.id}/status`, { method: "PATCH", body: JSON.stringify({ is_active: !item.is_active }) });
      setSuccess("Estado del administrador actualizado.");
      load();
    } catch (e) { setError((e as Error).message); } finally { setBusyId(null); }
  };

  return (
    <section>
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Administradores</h1>
          <p className="text-sm" style={{ color: "rgba(242,243,245,0.5)" }}>Acceso al CMS sin exponer credenciales.</p>
        </div>
        <button
          onClick={() => { setSuccess(""); setShow(true); }}
          className="rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "#1ec4ff", color: "#080a0f" }}
        >
          Nuevo admin
        </button>
      </div>
      {error && <p className="my-4" style={{ color: "#f87171" }}>{error}</p>}
      {success && <p className="my-4 rounded-xl p-3 text-sm" style={{ background: "rgba(74,222,128,0.12)", color: "#4ade80" }}>{success}</p>}
      <div className="mt-6 grid gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-2xl border p-5"
            style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
          >
            <div>
              <p className="font-semibold">
                {item.full_name}
                {item.id === current.id && <span className="text-xs" style={{ color: "#1ec4ff" }}> (tu)</span>}
              </p>
              <p className="text-sm" style={{ color: "rgba(242,243,245,0.5)" }}>{item.email} · {item.role}</p>
            </div>
            <button
              disabled={item.id === current.id || busyId !== null}
              onClick={() => toggle(item)}
              className="rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40"
              style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(242,243,245,0.7)" }}
            >
              {busyId === item.id ? "Guardando..." : item.is_active ? "Desactivar" : "Activar"}
            </button>
          </div>
        ))}
      </div>
      {show && <AdminForm close={() => setShow(false)} saved={() => { setShow(false); setSuccess("Administrador creado correctamente."); load(); }} />}
    </section>
  );
}

function AdminForm({ close, saved }: { close: () => void; saved: () => void }) {
  const [form, setForm] = useState({ full_name: "", email: "", password: "", role: "admin" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    try { await api("/admin/admin-users", { method: "POST", body: JSON.stringify(form) }); saved(); } catch (err) { setError((err as Error).message); } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl border p-6"
        style={{
          borderColor: "rgba(255,255,255,0.1)",
          background: "#0d1017",
          color: "#f2f3f5",
        }}
      >
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">Nuevo administrador</h2>
          <button type="button" onClick={close} style={{ color: "rgba(242,243,245,0.5)" }}><X /></button>
        </div>
        {error && <p className="mt-4 text-sm" style={{ color: "#f87171" }}>{error}</p>}
        {Object.entries(form).map(([key, value]) => (
          <label key={key} className="mt-4 block text-sm capitalize">
            {key.replace("_", " ")}
            <input
              required
              type={key === "password" ? "password" : key === "email" ? "email" : "text"}
              minLength={key === "password" ? 8 : undefined}
              value={value}
              onChange={(e) => setForm((old) => ({ ...old, [key]: e.target.value }))}
              className="mt-1 w-full rounded-xl border px-3 py-2.5"
              style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#f2f3f5" }}
            />
          </label>
        ))}
        <button
          disabled={saving}
          className="mt-6 w-full rounded-xl py-3 font-semibold transition-all hover:brightness-110 disabled:opacity-60"
          style={{ background: "#1ec4ff", color: "#080a0f" }}
        >
          {saving ? "Creando..." : "Crear administrador"}
        </button>
      </form>
    </div>
  );
}
