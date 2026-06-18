import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { StatusBadge } from "@/components/status-badge";
import { CopyMessageButton } from "@/components/copy-message-button";
import { Stars } from "@/components/recensioni/stars";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { recensioni } from "@/lib/mock-data";

export default function RecensioniPage() {
  return (
    <div>
      <PageHeader
        title="Recensioni"
        description="Le recensioni lasciate dai clienti, da leggere e da ringraziare."
      />

      <div className="flex flex-col gap-3">
        {recensioni.map((r) => (
          <Card key={r.id}>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-foreground">
                  {r.cliente}
                </span>
                <Stars punteggio={r.punteggio} />
              </div>
              <StatusBadge status={r.risposta} />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">{r.testo}</p>
              <p className="mt-1 text-xs text-muted-foreground">{r.data}</p>
            </CardContent>
            <CardFooter>
              <CopyMessageButton
                label="Copia risposta"
                message={`Ciao ${r.cliente}, grazie mille per la tua recensione! Per noi conta davvero tanto.`}
              />
            </CardFooter>
          </Card>
        ))}
      </div>

      <TrustNote className="mt-6">
        Nessun messaggio viene inviato senza conferma.
      </TrustNote>
    </div>
  );
}
