"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/navigation";

interface SidebarNavLinkProps {
  item: NavItem;
  onNavigate?: () => void;
}

export function SidebarNavLink({ item, onNavigate }: SidebarNavLinkProps) {
  const pathname = usePathname();
  const isActive = item.available && pathname === item.href;
  const Icon = item.icon;

  if (!item.available) {
    return (
      <div
        className="flex cursor-default items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-sidebar-muted"
        aria-disabled="true"
      >
        <Icon className="size-[18px] shrink-0" />
        <span className="flex-1 truncate">{item.label}</span>
        <Badge
          variant="upcoming"
          className="shrink-0 border-sidebar-border bg-transparent text-[10px] text-sidebar-muted"
        >
          Próximamente
        </Badge>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold tracking-tight transition-colors",
        isActive
          ? "bg-primary/15 text-white"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
      )}
    >
      <Icon className={cn("size-[18px] shrink-0", isActive && "text-primary")} />
      <span className="flex-1 truncate">{item.label}</span>
    </Link>
  );
}
