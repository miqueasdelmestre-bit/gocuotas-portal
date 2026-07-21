"use client";

import { useCallback, useState } from "react";

import { submitPhysicalMaterialRequest } from "@/services/physical-material-service";
import type { PhysicalMaterialRequestInput } from "@/types/physical-material-request";
import type { RequestFlowStep } from "@/types/request-flow";

export function usePhysicalMaterialRequest() {
  const [step, setStep] = useState<RequestFlowStep>("form");

  const submitRequest = useCallback(async (values: PhysicalMaterialRequestInput) => {
    setStep("submitting");

    try {
      const result = await submitPhysicalMaterialRequest(values);
      setStep(result.success ? "success" : "error");
    } catch {
      setStep("error");
    }
  }, []);

  const reset = useCallback(() => setStep("form"), []);

  return { step, submitRequest, reset };
}
