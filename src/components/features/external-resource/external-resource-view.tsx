import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ExternalResourceInfo } from "@/types/external-resource";

interface ExternalResourceViewProps {
  resource: ExternalResourceInfo;
}

export function ExternalResourceView({ resource }: ExternalResourceViewProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="space-y-3">
        <h1 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          {resource.title}
        </h1>
      </div>

      <Card className="max-w-2xl">
        <CardContent className="space-y-5 p-6">
          <p className="text-base leading-relaxed text-muted-foreground">
            {resource.description}
          </p>
          <Button asChild size="lg">
            <a href={resource.href} target="_blank" rel="noopener noreferrer">
              {resource.ctaLabel}
              <ExternalLink className="size-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
