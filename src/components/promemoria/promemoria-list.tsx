"use client";

import { useActionState } from "react";
import { Check, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { setPromemoriaFatto } from "@/app/promemoria/actions";
import { EliminaPromemoriaDialog } from "@/components/promemoria/elimina-promemoria-dialog";
import { formatScadenza, type PromemoriaRecord } from "@/lib/promemoria/types";

export function PromemoriaList({
  promemoria,
}: {
  promemoria: PromemoriaRecord[];
}) {
  return (
    <div className="flex flex-col gap-3">
      {promemoria.map((p) => (
        <PromemoriaItem key={p.id} promemoria={p} />
      ))}
    </div>
  );
}

function PromemoriaItem({ promemoria: p }: { promemoria: PromemoriaRecord }) {
  const [state, formAction, pending] = useActionState(setPromemoriaFatto, undefined);

  return (
    <Card className={cn(p.fatto && "opacity-60")}>
      <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-medium text-foreground",
                p.fatto && "line-through",
              )}
            >
              {p.titolo}
            </span>
            {p.importante && !p.fatto && (
              <Badge variant="warning">Importante</Badge>
            )}
          </div>
          {p.dettaglio && (
            <p className="text-sm text-muted-foreground">{p.dettaglio}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Scadenza: {formatScadenza(p.scadenza)}
          </p>
          {state?.error && (
            <p className="text-xs text-destructive">{state.error}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <form action={formAction}>
            <input type="hidden" name="id" value={p.id} />
            <input type="hidden" name="fatto" value={p.fatto ? "false" : "true"} />
            <Button
              variant={p.fatto ? "ghost" : "outline"}
              size="sm"
              type="submit"
              disabled={pending}
            >
              {p.fatto ? (
                <Undo2 className="h-4 w-4" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {p.fatto ? "Riapri" : "Segna come fatto"}
            </Button>
          </form>
          <EliminaPromemoriaDialog id={p.id} titolo={p.titolo} />
        </div>
      </CardContent>
    </Card>
  );
}
