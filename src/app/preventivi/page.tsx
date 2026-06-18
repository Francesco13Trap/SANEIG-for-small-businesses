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
import { preventivi } from "@/lib/mock-data";

export default function PreventiviPage() {
  return (
    <div>
      <PageHeader
        title="Preventivi"
        description="I preventivi proposti ai clienti e il loro stato."
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Cliente</TableHead>
                <TableHead>Descrizione</TableHead>
                <TableHead>Importo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="pr-5 text-right">Azione</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {preventivi.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="pl-5 font-medium text-foreground">
                    {p.cliente}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.descrizione}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {p.importo} €
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.data}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={p.stato} />
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <CopyMessageButton
                      message={`Ciao ${p.cliente}, ecco il preventivo per "${p.descrizione}": ${p.importo} €. Fammi sapere cosa ne pensi!`}
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
