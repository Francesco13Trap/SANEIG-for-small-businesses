import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { StatusBadge } from "@/components/status-badge";
import { ClienteSchedaDialog } from "@/components/clienti/cliente-scheda-dialog";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { clienti } from "@/lib/mock-data";

export default function ClientiPage() {
  return (
    <div>
      <PageHeader
        title="Clienti"
        description="L'elenco dei tuoi clienti, con lo stato di ognuno a colpo d'occhio."
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Nome</TableHead>
                <TableHead>Telefono</TableHead>
                <TableHead>Ultimo contatto</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Nota</TableHead>
                <TableHead className="pr-5 text-right">Azione</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clienti.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="pl-5 font-medium text-foreground">
                    {cliente.nome}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {cliente.telefono}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {cliente.ultimoContatto}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={cliente.stato} />
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate text-muted-foreground">
                    {cliente.nota}
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <ClienteSchedaDialog cliente={cliente} />
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
