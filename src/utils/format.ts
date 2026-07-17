export function formatFeePercentage(value: number): string {
  return `${value.toString().replace(".", ",")}%`;
}

export function formatBusinessDays(days: number): string {
  return `${days} días hábiles`;
}

export function formatInstallmentsLabel(installments: number): string {
  return `${installments} cuotas`;
}

export function formatPlanSummary(plan: {
  installments: number;
  businessDays: number;
  feePercentage: number;
}): string {
  return `${formatInstallmentsLabel(plan.installments)} — ${formatBusinessDays(
    plan.businessDays,
  )} — ${formatFeePercentage(plan.feePercentage)}`;
}
