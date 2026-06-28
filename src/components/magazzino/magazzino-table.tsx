import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProdottoFormDialog } from "@/components/magazzino/prodotto-form-dialog";
import { EliminaProdottoDialog } from "@/components/magazzino/elimina-prodotto-dialog";
import { isScortaBassa, type ProdottoRecord } from "@/lib/magazzino/types";

export function MagazzinoTable({
  prodotti,
  fornitori,
}: {
  prodotti: ProdottoRecord[];
  fornitori: { id: string; nome: string }[];
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Prodotto</TableHead>
              <TableHead>Quantità</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Fornitore</TableHead>
              <TableHead className="pr-5 text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prodotti.map((p) => {
              const scortaBassa = isScortaBassa(p);

              return (
                <TableRow key={p.id}>
                  <TableCell className="pl-5 font-medium text-foreground">
                    {p.nome}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-foreground">
                        {p.quantita} {p.unita ?? ""}
                      </span>
                      {p.scortaMinima != null && (
                        <span className="text-xs text-muted-foreground">
                          Scorta minima: {p.scortaMinima} {p.unita ?? ""}
                        </span>
                      )}
                      {scortaBassa && (
                        <Badge variant="destructive" className="w-fit">
                          Scorta bassa
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.categoria ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.fornitore ?? "—"}
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <ProdottoFormDialog
                        mode="edit"
                        prodotto={p}
                        fornitori={fornitori}
                      />
                      <EliminaProdottoDialog id={p.id} nome={p.nome} />
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
