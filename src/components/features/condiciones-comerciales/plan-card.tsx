import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatBusinessDays, formatFeePercentage, formatInstallmentsLabel } from "@/utils/format";
import type { PlanOption } from "@/types/plan";

interface PlanCardProps {
  plan: PlanOption;
  onSelect: (plan: PlanOption) => void;
}

export function PlanCard({ plan, onSelect }: PlanCardProps) {
  const descriptionParagraphs = plan.recommendedDescription?.split("\n\n") ?? [];

  return (
    <Card className="flex flex-col justify-between transition-shadow hover:shadow-soft-lg">
      <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
        <span className="font-display text-2xl font-black tracking-tight text-foreground">
          {formatInstallmentsLabel(plan.installments)}
        </span>
        {plan.recommended && <Badge>⭐ Recomendado</Badge>}
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

      <CardFooter className="flex flex-col items-stretch gap-3">
        <Button className="w-full" onClick={() => onSelect(plan)}>
          Solicitar este plan
        </Button>
        {descriptionParagraphs.length > 0 && (
          <div className="space-y-1.5">
            {descriptionParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
