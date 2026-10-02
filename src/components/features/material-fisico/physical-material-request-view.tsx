"use client";

import { PackageCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { usePhysicalMaterialRequest } from "@/hooks/use-physical-material-request";

import { PhysicalMaterialRequestForm } from "./physical-material-request-form";

interface PhysicalMaterialRequestViewProps {
  /** utm_source de la URL (ej. "panel", "correorepo", "soporte"), si vino en el link. */
  utmSource?: string;
  /** CUIT que vino en el link (ya validado): se muestra precargado y no editable. */
  lockedCuit?: string;
  initialBrandName?: string;
}

export function PhysicalMaterialRequestView({
  utmSource,
  lockedCuit,
  initialBrandName,
}: PhysicalMaterialRequestViewProps) {
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

      <div className="flex max-w-2xl items-start gap-3 rounded-xl border border-[#F6C9DE] bg-[#FCEEF5] p-4">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-[#EE2A7B]">
          <PackageCheck className="h-4 w-4 text-white" />
        </span>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Un dato rápido</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Si te diste de alta hace menos de 10 días,{" "}
            <strong className="font-bold text-foreground">ya te enviamos la cartelería</strong> —
            no es necesario que la solicites de nuevo. Si pasados los 10 días todavía no te
            llegó, ahí sí pedila con este formulario.
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardContent className="p-6">
          <PhysicalMaterialRequestForm
            key={formResetKey}
            isSubmitting={step === "submitting"}
            onSubmit={submitRequest}
            utmSource={utmSource}
            lockedCuit={lockedCuit}
            initialBrandName={initialBrandName}
          />
        </CardContent>
      </Card>
    </div>
  );
}
