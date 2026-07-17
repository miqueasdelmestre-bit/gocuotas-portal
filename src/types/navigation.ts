import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Módulos no disponibles todavía muestran el badge "Próximamente" y no navegan. */
  available: boolean;
}
