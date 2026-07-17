import type { InstallmentCount, PlanOption } from "@/types/plan";

export interface PlanGroup {
  installments: InstallmentCount;
  options: PlanOption[];
}

/** Agrupa las opciones por cantidad de cuotas, ordenadas de menor a mayor plazo. */
export function groupPlansByInstallments(plans: PlanOption[]): PlanGroup[] {
  const installmentCounts = Array.from(
    new Set(plans.map((plan) => plan.installments)),
  ).sort((a, b) => a - b);

  return installmentCounts.map((installments) => ({
    installments,
    options: plans
      .filter((plan) => plan.installments === installments)
      .sort((a, b) => a.businessDays - b.businessDays),
  }));
}

export function findPlanById(plans: PlanOption[], planId: string): PlanOption | undefined {
  return plans.find((plan) => plan.id === planId);
}
