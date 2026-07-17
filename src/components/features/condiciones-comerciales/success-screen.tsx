import { PartyPopper } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constants/site-config";

export function SuccessScreen() {
  return (
    <div className="flex flex-col items-center gap-5 py-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-success/10">
        <PartyPopper className="size-7 text-success" />
      </div>

      <div className="space-y-2">
        <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
          Solicitud recibida
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Recibimos correctamente tu solicitud. Dentro de las próximas{" "}
          {siteConfig.processingWindowHours} horas hábiles actualizaremos las condiciones
          comerciales de tu cuenta. Mientras tanto podés descargar el material de comunicación
          para comenzar a informar las nuevas condiciones.
        </p>
      </div>

      <Button asChild className="w-full">
        <a href={siteConfig.materialDownloadUrl} target="_blank" rel="noopener noreferrer">
          Descargar material
        </a>
      </Button>
    </div>
  );
}
