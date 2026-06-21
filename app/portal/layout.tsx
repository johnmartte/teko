import { AuthProvider } from "@/components/portal/auth/auth-context";

export default function PortalRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
