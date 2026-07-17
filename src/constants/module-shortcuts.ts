import { CreditCard, Package, Palette } from "lucide-react";

import type { ModuleShortcut } from "@/types/module-shortcut";

export const MODULE_SHORTCUTS: ModuleShortcut[] = [
  {
    title: "Condiciones comerciales",
    description:
      "Consultá las alternativas de plan de cuotas disponibles para tu comercio y solicitá un cambio.",
    href: "/condiciones-comerciales",
    icon: CreditCard,
  },
  {
    title: "Material publicitario online",
    description: "Descargá banners y piezas gráficas para comunicar tus cuotas.",
    href: "/material-publicitario-online",
    icon: Palette,
  },
  {
    title: "Material publicitario físico",
    description: "Solicitá material POP para comunicar tus cuotas en tu local.",
    href: "/material-publicitario-fisico",
    icon: Package,
  },
];
