import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { StatusBadge } from "@/components/status-badge";
import { CopyMessageButton } from "@/components/copy-message-button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { pagamenti } from "@/lib/mock-data";

export default function PagamentiPage() {
  return (
    <div>
      <PageHeader
        title="Pagamenti"
        description="I pagamenti da controllare o da sollecitare ai clienti."
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Cliente</TableHead>
                <TableHead>Importo</TableHead>
                <TableHead>Scadenza</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="pr-5 text-right">Azione</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagamenti.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="pl-5 font-medium text-foreground">
                    {p.cliente}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {p.importo} €
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.scadenza}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={p.stato} />
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <CopyMessageButton
                      message={`Ciao ${p.cliente}, ti scrivo solo per ricordarti il pagamento di ${p.importo} € relativo al ${p.scadenza}. Fammi sapere quando ti è comodo, grazie!`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TrustNote className="mt-6">
        Nessun messaggio viene inviato senza conferma.
      </TrustNote>
    </div>
  );
}
