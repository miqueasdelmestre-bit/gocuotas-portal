"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { AppSidebarContent } from "@/components/layout/app-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-sidebar md:block">
        <AppSidebarContent />
      </aside>

      <div className="flex min-h-screen w-full flex-col md:pl-64">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:hidden">
          <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Abrir menú">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <AppSidebarContent onNavigate={() => setIsMobileNavOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="font-display text-sm font-bold tracking-tight">GOcuotas</span>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
