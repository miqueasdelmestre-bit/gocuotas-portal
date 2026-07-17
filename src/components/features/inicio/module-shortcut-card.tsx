import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { ModuleShortcut } from "@/types/module-shortcut";

interface ModuleShortcutCardProps {
  shortcut: ModuleShortcut;
}

export function ModuleShortcutCard({ shortcut }: ModuleShortcutCardProps) {
  const Icon = shortcut.icon;

  return (
    <Link href={shortcut.href} className="group block">
      <Card className="h-full transition-shadow hover:shadow-soft-lg">
        <CardContent className="flex h-full flex-col gap-4 p-6">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="size-5 text-primary" />
          </div>
          <div className="flex-1 space-y-1.5">
            <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
              {shortcut.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {shortcut.description}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            Ir al módulo
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
