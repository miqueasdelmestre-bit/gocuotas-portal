import { formatBusinessDays, formatFeePercentage, formatInstallmentsLabel } from "@/utils/format";
import type { PlanOption } from "@/types/plan";

interface RequestSummaryProps {
  plan: PlanOption;
}

export function RequestSummary({ plan }: RequestSummaryProps) {
  const rows = [
    { label: "Plan", value: formatInstallmentsLabel(plan.installments) },
    { label: "Acreditación", value: formatBusinessDays(plan.businessDays) },
    { label: "Comisión", value: formatFeePercentage(plan.feePercentage) },
  ];

  return (
    <div className="space-y-3 rounded-xl border border-border bg-muted/40 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Resumen de tu solicitud
      </p>
      <dl className="space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4">
            <dt className="text-sm text-muted-foreground">{row.label}</dt>
            <dd className="text-sm font-semibold text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
