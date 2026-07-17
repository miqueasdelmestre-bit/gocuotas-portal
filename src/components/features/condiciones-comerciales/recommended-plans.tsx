import { RECOMMENDED_PLANS } from "@/constants/plans";
import type { PlanOption } from "@/types/plan";

import { PlanCard } from "./plan-card";

interface RecommendedPlansProps {
  onSelectPlan: (plan: PlanOption) => void;
}

export function RecommendedPlans({ onSelectPlan }: RecommendedPlansProps) {
  return (
    <section aria-labelledby="recommended-plans-heading">
      <h2 id="recommended-plans-heading" className="sr-only">
        Planes recomendados
      </h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {RECOMMENDED_PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onSelect={onSelectPlan} />
        ))}
      </div>
    </section>
  );
}
