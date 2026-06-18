import { Phone } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fornitori } from "@/lib/mock-data";

export default function FornitoriPage() {
  return (
    <div>
      <PageHeader
        title="Fornitori"
        description="I fornitori dell'attività e i loro contatti."
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Telefono</TableHead>
                <TableHead>Ultimo ordine</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="pr-5 text-right">Azione</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fornitori.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="pl-5 font-medium text-foreground">
                    {f.nome}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {f.categoria}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {f.telefono}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {f.ultimoOrdine}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={f.stato} />
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`tel:${f.telefono.replace(/\s+/g, "")}`}>
                        <Phone className="h-4 w-4" />
                        Chiama
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TrustNote className="mt-6">
        Puoi modificare tutto in qualsiasi momento.
      </TrustNote>
    </div>
  );
}
