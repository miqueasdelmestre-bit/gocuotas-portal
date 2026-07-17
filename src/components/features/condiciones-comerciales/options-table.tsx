import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBusinessDays, formatFeePercentage } from "@/utils/format";
import type { PlanOption } from "@/types/plan";
import type { PlanGroup } from "@/utils/plan-selectors";

interface OptionsTableProps {
  group: PlanGroup;
  onSelectPlan: (plan: PlanOption) => void;
}

export function OptionsTable({ group, onSelectPlan }: OptionsTableProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-display text-sm font-bold uppercase tracking-wide text-foreground">
        {group.installments} cuotas
      </h3>
      <div className="overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Acreditación</TableHead>
              <TableHead className="text-right">Comisión</TableHead>
              <TableHead className="text-right">Solicitar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {group.options.map((option) => (
              <TableRow key={option.id}>
                <TableCell className="font-medium text-foreground">
                  {formatBusinessDays(option.businessDays)}
                </TableCell>
                <TableCell className="text-right font-semibold text-foreground">
                  {formatFeePercentage(option.feePercentage)}
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" onClick={() => onSelectPlan(option)}>
                    Solicitar este plan
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
