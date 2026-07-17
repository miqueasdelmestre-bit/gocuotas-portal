import { NAV_ITEMS } from "@/constants/navigation";

import { SidebarNavLink } from "./sidebar-nav-link";

interface AppSidebarContentProps {
  onNavigate?: () => void;
}

export function AppSidebarContent({ onNavigate }: AppSidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          <span className="font-display text-sm font-black text-primary-foreground">G</span>
        </div>
        <span className="font-display text-base font-bold tracking-tight text-white">
          GOcuotas
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV_ITEMS.map((item) => (
          <SidebarNavLink key={item.href} item={item} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="px-5 py-5 text-xs leading-relaxed text-sidebar-muted">
        Centro de Condiciones Comerciales
      </div>
    </div>
  );
}
