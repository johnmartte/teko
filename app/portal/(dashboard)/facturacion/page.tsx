"use client";

import { Download } from "lucide-react";
import { mockInvoices } from "@/Data/portal/mock-data";
import { formatCurrency } from "@/Data/portal/mock-helpers";
import type { InvoiceStatus } from "@/shared/portal-types";

const statusConfig: Record<InvoiceStatus, { label: string; classes: string }> = {
  pagada: { label: "Pagada", classes: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  pendiente: { label: "Pendiente", classes: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  vencida: { label: "Vencida", classes: "bg-red-500/10 text-red-600 dark:text-red-400" },
  cancelada: { label: "Cancelada", classes: "bg-gray-500/10 text-gray-500" },
};

export default function FacturacionPage() {
  const totalBilled = mockInvoices.reduce((s, i) => s + i.amount, 0);
  const totalPaid = mockInvoices.filter((i) => i.status === "pagada").reduce((s, i) => s + i.amount, 0);
  const outstanding = totalBilled - totalPaid;

  return (
    <div className="mx-auto max-w-[900px] space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#101828] dark:text-white">Facturacion</h1>
        <p className="mt-1 text-sm text-[#7a8595] dark:text-white/40">
          Historial de facturas y estado de pagos.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total facturado", value: formatCurrency(totalBilled), color: "text-[#101828] dark:text-white" },
          { label: "Total pagado", value: formatCurrency(totalPaid), color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Saldo pendiente", value: formatCurrency(outstanding), color: "text-amber-600 dark:text-amber-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[#e6eaf2] bg-white p-5 dark:border-white/10 dark:bg-[#0f1525]"
          >
            <p className="text-[11px] font-medium text-[#7a8595] dark:text-white/40">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Invoice table */}
      <div className="overflow-x-auto rounded-2xl border border-[#e6eaf2] bg-white dark:border-white/10 dark:bg-[#0f1525]">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#e6eaf2] dark:border-white/10">
              <th className="px-5 py-3 font-semibold text-[#7a8595] dark:text-white/40">Factura</th>
              <th className="px-5 py-3 font-semibold text-[#7a8595] dark:text-white/40">Proyecto</th>
              <th className="px-5 py-3 font-semibold text-[#7a8595] dark:text-white/40">Fecha</th>
              <th className="px-5 py-3 font-semibold text-[#7a8595] dark:text-white/40">Monto</th>
              <th className="px-5 py-3 font-semibold text-[#7a8595] dark:text-white/40">Estado</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {mockInvoices.map((inv) => {
              const { label, classes } = statusConfig[inv.status];
              return (
                <tr
                  key={inv.id}
                  className="border-b border-[#e6eaf2] last:border-0 dark:border-white/10"
                >
                  <td className="px-5 py-3 font-medium text-[#101828] dark:text-white">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-5 py-3 text-[#52607a] dark:text-white/50">
                    {inv.projectName}
                  </td>
                  <td className="px-5 py-3 text-[#52607a] dark:text-white/50">
                    {new Date(inv.issuedAt).toLocaleDateString("es-DO", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3 font-semibold text-[#101828] dark:text-white">
                    {formatCurrency(inv.amount, inv.currency)}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${classes}`}>
                      {label}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7a8595] transition-colors hover:bg-[#f4f7ff] dark:text-white/40 dark:hover:bg-white/5">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
