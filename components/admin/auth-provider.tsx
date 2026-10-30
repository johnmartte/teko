"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, getToken, login as requestLogin, setToken, type AdminUser } from "@/lib/admin-api";
import { loginWithPasskeyCeremony } from "@/lib/passkeys";

type AuthValue = { user: AdminUser | null; loading: boolean; login: (email: string, password: string, remember: boolean) => Promise<void>; loginWithPasskey: (remember: boolean) => Promise<void>; logout: () => void };
const AuthContext = createContext<AuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const logout = useCallback(() => { setToken(null); setUser(null); }, []);
  useEffect(() => {
    const unauthorized = () => logout();
    window.addEventListener("teko:unauthorized", unauthorized);
    Promise.resolve().then(() => {
      if (!getToken()) { setLoading(false); return; }
      api<AdminUser>("/auth/me").then(setUser).catch(logout).finally(() => setLoading(false));
    });
    return () => window.removeEventListener("teko:unauthorized", unauthorized);
  }, [logout]);
  const login = async (email: string, password: string, remember: boolean) => { setUser(await requestLogin(email, password, remember)); };
  const loginWithPasskey = async (remember: boolean) => { setUser(await loginWithPasskeyCeremony(remember)); };
  return <AuthContext.Provider value={{ user, loading, login, loginWithPasskey, logout }}>{children}</AuthContext.Provider>;
}

export function useAdminAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAdminAuth debe usarse dentro de AdminAuthProvider");
  return value;
}
