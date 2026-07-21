import { PartyPopper } from "lucide-react";

export function PhysicalMaterialSuccessScreen() {
  return (
    <div className="flex flex-col items-center gap-5 py-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-success/10">
        <PartyPopper className="size-7 text-success" />
      </div>

      <div className="space-y-2">
        <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
          Pedido recibido
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Recibimos correctamente tu pedido de material POP. Nuestro equipo se va a contactar
          para coordinar el envío a la dirección que nos dejaste.
        </p>
      </div>
    </div>
  );
}
