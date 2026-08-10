import type { Metadata } from "next";
import { AdminAuthProvider } from "@/components/admin/auth-provider";

export const metadata: Metadata = { title: "Administración | TEKO", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
