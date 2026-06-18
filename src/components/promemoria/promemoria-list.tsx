"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Promemoria } from "@/lib/types";

export function PromemoriaList({ promemoria }: { promemoria: Promemoria[] }) {
  const [completati, setCompletati] = useState<Set<string>>(new Set());

  function segnaFatto(id: string) {
    setCompletati((prev) => new Set(prev).add(id));
  }

  return (
    <div className="flex flex-col gap-3">
      {promemoria.map((p) => {
        const fatto = completati.has(p.id);
        return (
          <Card key={p.id} className={cn(fatto && "opacity-60")}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "font-medium text-foreground",
                      fatto && "line-through"
                    )}
                  >
                    {p.titolo}
                  </span>
                  {p.importante && !fatto && (
                    <Badge variant="warning">Importante</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{p.dettaglio}</p>
                <p className="text-xs text-muted-foreground">
                  Scadenza: {p.scadenza}
                </p>
              </div>
              <Button
                variant={fatto ? "ghost" : "outline"}
                size="sm"
                disabled={fatto}
                onClick={() => segnaFatto(p.id)}
              >
                <Check className="h-4 w-4" />
                {fatto ? "Fatto" : "Segna come fatto"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
