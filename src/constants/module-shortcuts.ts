import { Package, Palette } from "lucide-react";

import type { ModuleShortcut } from "@/types/module-shortcut";

// "Condiciones comerciales" queda oculto a pedido del negocio (ver constants/navigation.ts).
export const MODULE_SHORTCUTS: ModuleShortcut[] = [
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
