import { StatusBadge } from "@/components/status-badge";
import { CopyMessageButton } from "@/components/copy-message-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PromozioneFormDialog } from "@/components/promozioni/promozione-form-dialog";
import { EliminaPromozioneDialog } from "@/components/promozioni/elimina-promozione-dialog";
import {
  STATO_PROMOZIONE_LABELS,
  type PromozioneRecord,
} from "@/lib/promozioni/types";

export function PromozioniGrid({
  promozioni,
}: {
  promozioni: PromozioneRecord[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {promozioni.map((p) => (
        <Card key={p.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <CardTitle>{p.titolo}</CardTitle>
              <StatusBadge status={STATO_PROMOZIONE_LABELS[p.stato]} />
            </div>
            {p.periodo && <CardDescription>{p.periodo}</CardDescription>}
          </CardHeader>
          <CardContent className="flex-1">
            {p.descrizione && (
              <p className="text-sm text-foreground">{p.descrizione}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-between gap-2">
            <CopyMessageButton
              label="Copia messaggio"
              message={`Ciao [nome], ti scrivo per "${p.titolo}"${
                p.descrizione ? `: ${p.descrizione}` : ""
              }.${p.periodo ? ` Valida nel periodo ${p.periodo}.` : ""}`}
            />
            <div className="flex gap-2">
              <PromozioneFormDialog mode="edit" promozione={p} />
              <EliminaPromozioneDialog id={p.id} titolo={p.titolo} />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
