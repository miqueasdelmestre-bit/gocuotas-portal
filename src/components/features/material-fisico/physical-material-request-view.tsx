"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { usePhysicalMaterialRequest } from "@/hooks/use-physical-material-request";

import { PhysicalMaterialRequestForm } from "./physical-material-request-form";

interface PhysicalMaterialRequestViewProps {
  /** utm_source de la URL (ej. "panel", "correorepo", "soporte"), si vino en el link. */
  utmSource?: string;
}

export function PhysicalMaterialRequestView({ utmSource }: PhysicalMaterialRequestViewProps) {
  const { step, submitRequest, reset } = usePhysicalMaterialRequest();
  // Cambiar la key remonta el formulario con los campos en blanco.
  const [formResetKey, setFormResetKey] = useState(0);

  useEffect(() => {
    if (step === "success") {
      toast.success(
        "¡Recibimos tu pedido! En las próximas horas vas a recibir el seguimiento por mail.",
      );
      setFormResetKey((key) => key + 1);
      reset();
    }

    if (step === "error") {
      toast.error("No pudimos enviar tu pedido. Probá de nuevo en unos minutos.");
    }
  }, [step, reset]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="space-y-3">
        <h1 className="font-display text-3xl font-black tracking-tight text-[#EE2A7B] sm:text-4xl">
          Material publicitario físico
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Desde acá vas a poder solicitar material POP para comunicar las cuotas en tu local.
          Completá tus datos y la dirección de entrega para que el envío llegue sin problemas.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardContent className="p-6">
          <PhysicalMaterialRequestForm
            key={formResetKey}
            isSubmitting={step === "submitting"}
            onSubmit={submitRequest}
            utmSource={utmSource}
          />
        </CardContent>
      </Card>
    </div>
  );
}
