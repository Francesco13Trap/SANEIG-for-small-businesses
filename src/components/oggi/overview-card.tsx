import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function OverviewCard({
  title,
  icon: Icon,
  count,
  href,
  ctaLabel,
  emptyText,
  children,
}: {
  title: string;
  icon: LucideIcon;
  count: number;
  href: string;
  ctaLabel: string;
  emptyText: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <CardTitle>{title}</CardTitle>
        </div>
        <Badge variant="secondary">{count}</Badge>
      </CardHeader>
      <CardContent className="flex-1">
        {count > 0 ? (
          <ul className="flex flex-col gap-2.5 text-sm">{children}</ul>
        ) : (
          <p className="text-sm text-muted-foreground">{emptyText}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={href}>{ctaLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
