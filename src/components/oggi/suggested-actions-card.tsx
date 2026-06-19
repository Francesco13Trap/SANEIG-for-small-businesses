import Link from "next/link";
import { ChevronRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SuggestedAction } from "@/lib/oggi/suggested-actions";

export function SuggestedActionsCard({
  actions,
}: {
  actions: SuggestedAction[];
}) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Prossime 3 azioni consigliate</CardTitle>
        <CardDescription>
          Piccole cose utili da sistemare quando hai un momento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {actions.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {actions.map((action) => (
              <li key={action.href}>
                <Link
                  href={action.href}
                  className="flex items-center justify-between gap-3 rounded-lg bg-secondary px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary/70"
                >
                  <span>{action.label}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Per ora non ci sono azioni urgenti. Puoi continuare a tenere
            d&apos;occhio clienti, pagamenti e promemoria.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
