"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RequestFlowStep } from "@/hooks/use-commercial-conditions-request";
import type { CommercialConditionRequestFormValues } from "@/lib/schemas";
import { formatPlanSummary } from "@/utils/format";
import type { PlanOption } from "@/types/plan";

import { RequestForm } from "./request-form";
import { SuccessScreen } from "./success-screen";

interface RequestFormDialogProps {
  plan: PlanOption | null;
  isOpen: boolean;
  step: RequestFlowStep;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CommercialConditionRequestFormValues) => void;
}

export function RequestFormDialog({
  plan,
  isOpen,
  step,
  onOpenChange,
  onSubmit,
}: RequestFormDialogProps) {
  if (!plan) return null;

  const isSuccess = step === "success";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        {!isSuccess && (
          <DialogHeader>
            <DialogTitle>Solicitar cambio de plan</DialogTitle>
            <DialogDescription>
              Completá tus datos para solicitar el nuevo plan de {formatPlanSummary(plan)}.
            </DialogDescription>
          </DialogHeader>
        )}

        {isSuccess ? (
          <SuccessScreen />
        ) : (
          <RequestForm
            planSummary={formatPlanSummary(plan)}
            isSubmitting={step === "submitting"}
            onSubmit={onSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
