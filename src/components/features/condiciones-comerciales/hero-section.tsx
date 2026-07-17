import { siteConfig } from "@/constants/site-config";

export function HeroSection() {
  return (
    <div className="space-y-3">
      <h1 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
        Condiciones Comerciales
      </h1>
      <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
        Bienvenido. Desde este portal podrás conocer las distintas alternativas comerciales
        disponibles para tu comercio y solicitar un cambio de plan. Las solicitudes son
        procesadas dentro de las próximas {siteConfig.processingWindowHours} horas hábiles.
      </p>
    </div>
  );
}
