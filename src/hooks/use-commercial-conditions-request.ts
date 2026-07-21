"use client";

import { useCallback, useState } from "react";

import { submitCommercialConditionRequest } from "@/services/commercial-conditions-service";
import type { PlanOption } from "@/types/plan";
import type { RequestFlowStep } from "@/types/request-flow";

interface SubmitValues {
  cuit: string;
  email: string;
  acceptsCommercialConditions: boolean;
  commitsToCommunicateConditions: boolean;
}

export function useCommercialConditionsRequest() {
  const [selectedPlan, setSelectedPlan] = useState<PlanOption | null>(null);
  const [step, setStep] = useState<RequestFlowStep>("form");

  const openRequestFlow = useCallback((plan: PlanOption) => {
    setSelectedPlan(plan);
    setStep("form");
  }, []);

  const closeRequestFlow = useCallback(() => {
    setSelectedPlan(null);
    setStep("form");
  }, []);

  const submitRequest = useCallback(
    async (values: SubmitValues) => {
      if (!selectedPlan) return;

      setStep("submitting");

      try {
        const result = await submitCommercialConditionRequest({
          ...values,
          planId: selectedPlan.id,
        });

        setStep(result.success ? "success" : "error");
      } catch {
        setStep("error");
      }
    },
    [selectedPlan],
  );

  return {
    selectedPlan,
    step,
    isDialogOpen: selectedPlan !== null,
    openRequestFlow,
    closeRequestFlow,
    submitRequest,
  };
}
