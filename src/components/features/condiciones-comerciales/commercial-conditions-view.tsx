"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { useCommercialConditionsRequest } from "@/hooks/use-commercial-conditions-request";

import { AllOptionsAccordion } from "./all-options-accordion";
import { HeroSection } from "./hero-section";
import { RecommendedPlans } from "./recommended-plans";
import { RequestFormDialog } from "./request-form-dialog";
import { SixInstallmentsCard } from "./six-installments-card";

export function CommercialConditionsView() {
  const {
    selectedPlan,
    step,
    isDialogOpen,
    openRequestFlow,
    closeRequestFlow,
    submitRequest,
  } = useCommercialConditionsRequest();

  useEffect(() => {
    if (step === "error") {
      toast.error("No pudimos enviar tu solicitud. Probá de nuevo en unos minutos.");
    }
  }, [step]);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <HeroSection />

      <RecommendedPlans onSelectPlan={openRequestFlow} />

      <AllOptionsAccordion />

      <SixInstallmentsCard />

      <RequestFormDialog
        plan={selectedPlan}
        isOpen={isDialogOpen}
        step={step}
        onOpenChange={(open) => {
          if (!open) closeRequestFlow();
        }}
        onSubmit={submitRequest}
      />
    </div>
  );
}
