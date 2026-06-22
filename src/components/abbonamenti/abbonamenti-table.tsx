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
import { AbbonamentoFormDialog } from "@/components/abbonamenti/abbonamento-form-dialog";
import { EliminaAbbonamentoDialog } from "@/components/abbonamenti/elimina-abbonamento-dialog";
import {
  STATO_ABBONAMENTO_LABELS,
  formatData,
  type AbbonamentoRecord,
} from "@/lib/abbonamenti/types";

export function AbbonamentiTable({
  abbonamenti,
  clienti,
}: {
  abbonamenti: AbbonamentoRecord[];
  clienti: { id: string; nome: string }[];
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Cliente</TableHead>
              <TableHead>Nome abbonamento</TableHead>
              <TableHead>Data inizio</TableHead>
              <TableHead>Data scadenza</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="pr-5 text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {abbonamenti.map((a) => {
              const statoLabel = STATO_ABBONAMENTO_LABELS[a.stato];
              const scadenzaLabel = formatData(a.scadenza);

              return (
                <TableRow key={a.id}>
                  <TableCell className="pl-5 font-medium text-foreground">
                    {a.cliente}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {a.nome}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatData(a.dataInizio)}
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
                        label="Avvisa cliente"
                        message={`Ciao ${a.cliente}, il tuo abbonamento "${a.nome}" scade il ${scadenzaLabel}. Vuoi che te lo rinnoviamo?`}
                      />
                      <AbbonamentoFormDialog
                        mode="edit"
                        abbonamento={a}
                        clienti={clienti}
                      />
                      <EliminaAbbonamentoDialog id={a.id} cliente={a.cliente} />
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
