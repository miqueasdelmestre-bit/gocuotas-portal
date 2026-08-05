import { Home, Package, Palette } from "lucide-react";

import type { NavItem } from "@/types/navigation";

// "Condiciones comerciales" queda oculto del menú a pedido del negocio,
// sin borrar la página ni el módulo — sigue accesible en /condiciones-comerciales
// por URL directa si hace falta reactivarlo más adelante.
export const NAV_ITEMS: NavItem[] = [
  {
    label: "Inicio",
    href: "/",
    icon: Home,
    available: true,
  },
  {
    label: "Material publicitario online",
    href: "/material-publicitario-online",
    icon: Palette,
    available: true,
  },
  {
    label: "Material publicitario físico",
    href: "/material-publicitario-fisico",
    icon: Package,
    available: true,
  },
];
