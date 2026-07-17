import { MODULE_SHORTCUTS } from "@/constants/module-shortcuts";
import { siteConfig } from "@/constants/site-config";

import { ModuleShortcutCard } from "./module-shortcut-card";

export function InicioView() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="space-y-3">
        <h1 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          Hola
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Bienvenido al {siteConfig.appName} de {siteConfig.name}. Elegí un módulo para
          empezar.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {MODULE_SHORTCUTS.map((shortcut) => (
          <ModuleShortcutCard key={shortcut.href} shortcut={shortcut} />
        ))}
      </div>
    </div>
  );
}
