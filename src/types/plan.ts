export type InstallmentCount = 3 | 4 | 5;

export interface PlanOption {
  /** Identificador estable, usado como valor del plan seleccionado en el formulario. */
  id: string;
  installments: InstallmentCount;
  businessDays: number;
  feePercentage: number;
  /** Marca la opción destacada de su grupo de cuotas (se muestra como tarjeta recomendada). */
  recommended?: boolean;
  /** Texto que acompaña a la tarjeta recomendada, explicando para qué comercio conviene. */
  recommendedDescription?: string;
}

export interface SixInstallmentsInfo {
  title: string;
  description: string;
  ctaLabel: string;
}
