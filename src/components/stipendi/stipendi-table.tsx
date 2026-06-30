import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StipendioFormDialog } from "@/components/stipendi/stipendio-form-dialog";
import { EliminaStipendioDialog } from "@/components/stipendi/elimina-stipendio-dialog";
import {
  STATO_STIPENDIO_LABELS,
  formatImporto,
  formatScadenza,
  type StipendioRecord,
} from "@/lib/stipendi/types";

export function StipendiTable({ stipendi }: { stipendi: StipendioRecord[] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Nome</TableHead>
              <TableHead>Ruolo</TableHead>
              <TableHead>Importo</TableHead>
              <TableHead>Mese</TableHead>
              <TableHead>Scadenza</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="pr-5 text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stipendi.map((s) => {
              const statoLabel = STATO_STIPENDIO_LABELS[s.stato];

              return (
                <TableRow key={s.id}>
                  <TableCell className="pl-5 font-medium text-foreground">
                    {s.nome}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {s.ruolo ?? "—"}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {formatImporto(s.importo)} €
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.mese}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatScadenza(s.scadenza)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={statoLabel} />
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <StipendioFormDialog mode="edit" stipendio={s} />
                      <EliminaStipendioDialog id={s.id} nome={s.nome} />
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
