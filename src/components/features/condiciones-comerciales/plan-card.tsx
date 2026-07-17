import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatBusinessDays, formatFeePercentage, formatInstallmentsLabel } from "@/utils/format";
import type { PlanOption } from "@/types/plan";

interface PlanCardProps {
  plan: PlanOption;
  onSelect: (plan: PlanOption) => void;
}

export function PlanCard({ plan, onSelect }: PlanCardProps) {
  return (
    <Card className="flex flex-col justify-between transition-shadow hover:shadow-soft-lg">
      <CardHeader>
        <span className="font-display text-2xl font-black tracking-tight text-foreground">
          {formatInstallmentsLabel(plan.installments)}
        </span>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Acreditación
          </p>
          <p className="text-base font-semibold text-foreground">
            {formatBusinessDays(plan.businessDays)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Comisión
          </p>
          <p className="text-base font-semibold text-foreground">
            {formatFeePercentage(plan.feePercentage)}
          </p>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" onClick={() => onSelect(plan)}>
          Seleccionar
        </Button>
      </CardFooter>
    </Card>
  );
}
