import { CreditCard, Home, Package, Palette } from "lucide-react";

import type { NavItem } from "@/types/navigation";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Inicio",
    href: "/",
    icon: Home,
    available: false,
  },
  {
    label: "Condiciones comerciales",
    href: "/condiciones-comerciales",
    icon: CreditCard,
    available: true,
  },
  {
    label: "Material de marketing",
    href: "/material-de-marketing",
    icon: Palette,
    available: false,
  },
  {
    label: "Solicitud de material POP",
    href: "/material-pop",
    icon: Package,
    available: false,
  },
];
