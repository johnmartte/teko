import DashboardLayout from "@/components/portal/layout/dashboard-layout";
import ProtectedRoute from "@/components/portal/auth/protected-route";

export default function DashboardRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
