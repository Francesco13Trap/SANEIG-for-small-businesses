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
import { PreventivoFormDialog } from "@/components/preventivi/preventivo-form-dialog";
import { EliminaPreventivoDialog } from "@/components/preventivi/elimina-preventivo-dialog";
import {
  STATO_PREVENTIVO_LABELS,
  formatData,
  formatImporto,
  type PreventivoRecord,
} from "@/lib/preventivi/types";

function buildMessaggioPreventivo(p: PreventivoRecord): string {
  const descrizioneParte = p.descrizione ? `: ${p.descrizione}` : "";
  const validoParte = p.validoFino
    ? ` Il preventivo è valido fino al ${formatData(p.validoFino)}.`
    : "";

  return `Ciao ${p.cliente}, ti mando il preventivo per ${p.titolo}${descrizioneParte}. Totale: ${formatImporto(p.importo)} €.${validoParte} Fammi sapere se va bene, grazie.`;
}

export function PreventiviTable({
  preventivi,
  clienti,
}: {
  preventivi: PreventivoRecord[];
  clienti: { id: string; nome: string }[];
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Cliente</TableHead>
              <TableHead>Titolo preventivo</TableHead>
              <TableHead>Importo</TableHead>
              <TableHead>Valido fino al</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="pr-5 text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {preventivi.map((p) => {
              const statoLabel = STATO_PREVENTIVO_LABELS[p.stato];

              return (
                <TableRow key={p.id}>
                  <TableCell className="pl-5 font-medium text-foreground">
                    {p.cliente}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.titolo}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {formatImporto(p.importo)} €
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatData(p.validoFino)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={statoLabel} />
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <CopyMessageButton
                        label="Copia preventivo"
                        message={buildMessaggioPreventivo(p)}
                      />
                      <PreventivoFormDialog
                        mode="edit"
                        preventivo={p}
                        clienti={clienti}
                      />
                      <EliminaPreventivoDialog id={p.id} titolo={p.titolo} />
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
