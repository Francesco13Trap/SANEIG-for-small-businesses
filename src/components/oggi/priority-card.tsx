import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PriorityItem } from "@/lib/oggi/priority";

export function PriorityCard({ item }: { item: PriorityItem | null }) {
  if (!item) {
    return (
      <Card className="mb-6 border-l-4 border-l-success">
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <div className="flex flex-col gap-1.5">
            <CardTitle>Da controllare prima</CardTitle>
            <CardDescription>
              La cosa più importante da sistemare oggi.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground">
            Per ora non ci sono urgenze. Puoi controllare clienti, pagamenti o
            promemoria.
          </p>
        </CardContent>
      </Card>
    );
  }

  const Icon = item.icon;

  return (
    <Card className="mb-6 border-l-4 border-l-warning">
      <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
        <div className="flex flex-col gap-1.5">
          <CardTitle>Da controllare prima</CardTitle>
          <CardDescription>
            La cosa più importante da sistemare oggi.
          </CardDescription>
        </div>
        <Badge variant="warning">Da fare</Badge>
      </CardHeader>
      <CardContent className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">{item.label}</p>
          <p className="text-sm text-foreground">{item.message}</p>
          {item.note && (
            <p className="text-sm text-muted-foreground">{item.note}</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild size="sm" className="w-full sm:w-auto">
          <Link href={item.href}>{item.ctaLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
