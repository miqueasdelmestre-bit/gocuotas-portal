import type { PlanOption, SixInstallmentsInfo } from "@/types/plan";

/**
 * Todas las combinaciones de cuotas / plazo de acreditación / comisión disponibles.
 * Las marcadas con `recommended` son las que se destacan como tarjetas en la
 * pantalla principal; el resto se ve en la tabla de "todas las opciones".
 */
export const COMMERCIAL_PLANS: PlanOption[] = [
  // 3 cuotas
  { id: "3-22", installments: 3, businessDays: 22, feePercentage: 9.9 },
  {
    id: "3-28",
    installments: 3,
    businessDays: 28,
    feePercentage: 9.2,
    recommended: true,
    recommendedDescription:
      "Ideal para comercios que buscan ofrecer financiación manteniendo una acreditación rápida.",
  },
  { id: "3-34", installments: 3, businessDays: 34, feePercentage: 8.5 },
  { id: "3-45", installments: 3, businessDays: 45, feePercentage: 7.4 },
  { id: "3-55", installments: 3, businessDays: 55, feePercentage: 6.2 },
  { id: "3-65", installments: 3, businessDays: 65, feePercentage: 4.9 },
  { id: "3-75", installments: 3, businessDays: 75, feePercentage: 3.7 },
  { id: "3-85", installments: 3, businessDays: 85, feePercentage: 2.3 },

  // 4 cuotas
  { id: "4-22", installments: 4, businessDays: 22, feePercentage: 11.4 },
  { id: "4-28", installments: 4, businessDays: 28, feePercentage: 10.7 },
  {
    id: "4-34",
    installments: 4,
    businessDays: 34,
    feePercentage: 10,
    recommended: true,
    recommendedDescription:
      "Ideal para comercios que buscan un equilibrio entre financiación y plazo de acreditación.\n\nEs la alternativa más elegida por nuestros comercios.",
  },
  { id: "4-45", installments: 4, businessDays: 45, feePercentage: 8.6 },
  { id: "4-55", installments: 4, businessDays: 55, feePercentage: 7.5 },
  { id: "4-65", installments: 4, businessDays: 65, feePercentage: 6.2 },
  { id: "4-75", installments: 4, businessDays: 75, feePercentage: 4.8 },
  { id: "4-85", installments: 4, businessDays: 85, feePercentage: 3.8 },

  // 5 cuotas
  { id: "5-45", installments: 5, businessDays: 45, feePercentage: 10.1 },
  {
    id: "5-55",
    installments: 5,
    businessDays: 55,
    feePercentage: 8.8,
    recommended: true,
    recommendedDescription:
      "Ideal para comercios que desean ofrecer una mayor financiación para potenciar sus ventas.",
  },
  { id: "5-65", installments: 5, businessDays: 65, feePercentage: 7.4 },
  { id: "5-75", installments: 5, businessDays: 75, feePercentage: 6.3 },
  { id: "5-85", installments: 5, businessDays: 85, feePercentage: 5.1 },
];

export const RECOMMENDED_PLANS: PlanOption[] = COMMERCIAL_PLANS.filter(
  (plan) => plan.recommended,
);

/** El plan de 6 cuotas no expone comisión, plazo ni condiciones: es solo informativo. */
export const SIX_INSTALLMENTS_INFO: SixInstallmentsInfo = {
  title: "Hasta 6 cuotas",
  description:
    "Para acceder al plan de hasta 6 cuotas es necesario alcanzar aproximadamente 150 operaciones mensuales utilizando GOcuotas.\n\nSi tu comercio alcanza ese volumen, nuestro equipo evaluará la posibilidad de habilitar este beneficio.",
  ctaLabel: "Quiero recibir más información",
};
