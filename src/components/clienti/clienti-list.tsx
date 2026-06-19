import { ClienteFormDialog } from "@/components/clienti/cliente-form-dialog";
import { EliminaClienteDialog } from "@/components/clienti/elimina-cliente-dialog";
import type { ClienteRecord } from "@/lib/clienti/types";

export function ClientiList({ clienti }: { clienti: ClienteRecord[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <ClienteFormDialog mode="add" />
      </div>
      <ul className="flex flex-col gap-3">
        {clienti.map((cliente) => (
          <li
            key={cliente.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="font-medium text-foreground">{cliente.nome}</span>
              {cliente.telefono && (
                <span className="text-sm text-muted-foreground">
                  {cliente.telefono}
                </span>
              )}
              {cliente.email && (
                <span className="text-sm text-muted-foreground">
                  {cliente.email}
                </span>
              )}
              {cliente.nota && (
                <span className="text-sm text-muted-foreground">
                  {cliente.nota}
                </span>
              )}
            </div>
            <div className="flex shrink-0 gap-2">
              <ClienteFormDialog mode="edit" cliente={cliente} />
              <EliminaClienteDialog id={cliente.id} nome={cliente.nome} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
