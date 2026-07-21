"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { usePhysicalMaterialRequest } from "@/hooks/use-physical-material-request";

import { PhysicalMaterialRequestForm } from "./physical-material-request-form";
import { PhysicalMaterialSuccessScreen } from "./physical-material-success-screen";

export function PhysicalMaterialRequestView() {
  const { step, submitRequest } = usePhysicalMaterialRequest();

  useEffect(() => {
    if (step === "error") {
      toast.error("No pudimos enviar tu pedido. Probá de nuevo en unos minutos.");
    }
  }, [step]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="space-y-3">
        <h1 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          Material publicitario físico
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Desde acá vas a poder solicitar material POP para comunicar las cuotas en tu local.
          Completá tus datos y la dirección de entrega para que el envío llegue sin problemas.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardContent className="p-6">
          {step === "success" ? (
            <PhysicalMaterialSuccessScreen />
          ) : (
            <PhysicalMaterialRequestForm
              isSubmitting={step === "submitting"}
              onSubmit={submitRequest}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
