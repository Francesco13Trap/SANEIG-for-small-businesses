import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { CopyMessageButton } from "@/components/copy-message-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { messaggi } from "@/lib/mock-data";

export default function MessaggiPage() {
  return (
    <div>
      <PageHeader
        title="Messaggi"
        description="Modelli di messaggi pronti da copiare e inviare come preferisci."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {messaggi.map((m) => (
          <Card key={m.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{m.titolo}</CardTitle>
              <CardDescription>{m.descrizione}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="rounded-lg bg-secondary p-3 text-sm text-foreground">
                {m.testo}
              </p>
            </CardContent>
            <CardFooter>
              <CopyMessageButton message={m.testo} />
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
