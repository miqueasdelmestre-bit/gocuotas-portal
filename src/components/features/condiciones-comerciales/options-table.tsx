import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBusinessDays, formatFeePercentage } from "@/utils/format";
import type { PlanGroup } from "@/utils/plan-selectors";

interface OptionsTableProps {
  group: PlanGroup;
}

export function OptionsTable({ group }: OptionsTableProps) {
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
