import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SIX_INSTALLMENTS_INFO } from "@/constants/plans";

export function SixInstallmentsCard() {
  const paragraphs = SIX_INSTALLMENTS_INFO.description.split("\n\n");

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle>{SIX_INSTALLMENTS_INFO.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <Button type="button" variant="outline">
          {SIX_INSTALLMENTS_INFO.ctaLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
