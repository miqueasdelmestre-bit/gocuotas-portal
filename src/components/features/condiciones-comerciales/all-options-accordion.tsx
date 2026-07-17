import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { COMMERCIAL_PLANS } from "@/constants/plans";
import type { PlanOption } from "@/types/plan";
import { groupPlansByInstallments } from "@/utils/plan-selectors";

import { OptionsTable } from "./options-table";

interface AllOptionsAccordionProps {
  onSelectPlan: (plan: PlanOption) => void;
}

export function AllOptionsAccordion({ onSelectPlan }: AllOptionsAccordionProps) {
  const groups = groupPlansByInstallments(COMMERCIAL_PLANS);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="all-options" className="shadow-soft">
        <AccordionTrigger>Ver todas las opciones disponibles</AccordionTrigger>
        <AccordionContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <OptionsTable key={group.installments} group={group} onSelectPlan={onSelectPlan} />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
