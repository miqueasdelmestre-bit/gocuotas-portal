export function formatFeePercentage(value: number): string {
  return `${value.toString().replace(".", ",")}%`;
}

export function formatBusinessDays(days: number): string {
  return `${days} días hábiles`;
}

export function formatInstallmentsLabel(installments: number): string {
  return `${installments} cuotas`;
}
