import { CreditCard, Home, Package, Palette } from "lucide-react";

import type { NavItem } from "@/types/navigation";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Inicio",
    href: "/",
    icon: Home,
    available: true,
  },
  {
    label: "Condiciones comerciales",
    href: "/condiciones-comerciales",
    icon: CreditCard,
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
