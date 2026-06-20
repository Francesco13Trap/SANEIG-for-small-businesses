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
import { PagamentoFormDialog } from "@/components/pagamenti/pagamento-form-dialog";
import { EliminaPagamentoDialog } from "@/components/pagamenti/elimina-pagamento-dialog";
import {
  STATO_PAGAMENTO_LABELS,
  formatImporto,
  formatScadenza,
  type PagamentoRecord,
} from "@/lib/pagamenti/types";

export function PagamentiTable({
  pagamenti,
  clienti,
}: {
  pagamenti: PagamentoRecord[];
  clienti: { id: string; nome: string }[];
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Cliente</TableHead>
              <TableHead>Importo</TableHead>
              <TableHead>Scadenza</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="pr-5 text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagamenti.map((p) => {
              const statoLabel = STATO_PAGAMENTO_LABELS[p.stato];
              const scadenzaLabel = formatScadenza(p.scadenza);

              return (
                <TableRow key={p.id}>
                  <TableCell className="pl-5 font-medium text-foreground">
                    {p.cliente}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {formatImporto(p.importo)} €
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {scadenzaLabel}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={statoLabel} />
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <CopyMessageButton
                        message={`Ciao ${p.cliente}, ti scrivo solo per ricordarti il pagamento di ${formatImporto(p.importo)} € relativo al ${scadenzaLabel}. Fammi sapere quando ti è comodo, grazie!`}
                      />
                      <PagamentoFormDialog
                        mode="edit"
                        pagamento={p}
                        clienti={clienti}
                      />
                      <EliminaPagamentoDialog id={p.id} cliente={p.cliente} />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
