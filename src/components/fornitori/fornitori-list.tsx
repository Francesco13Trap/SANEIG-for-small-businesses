import { FornitoreFormDialog } from "@/components/fornitori/fornitore-form-dialog";
import { EliminaFornitoreDialog } from "@/components/fornitori/elimina-fornitore-dialog";
import type { FornitoreRecord } from "@/lib/fornitori/types";

export function FornitoriList({ fornitori }: { fornitori: FornitoreRecord[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <FornitoreFormDialog mode="add" />
      </div>
      <ul className="flex flex-col gap-3">
        {fornitori.map((fornitore) => (
          <li
            key={fornitore.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="font-medium text-foreground">{fornitore.nome}</span>
              {fornitore.categoria && (
                <span className="text-sm text-muted-foreground">
                  {fornitore.categoria}
                </span>
              )}
              {fornitore.referente && (
                <span className="text-sm text-muted-foreground">
                  Referente: {fornitore.referente}
                </span>
              )}
              {fornitore.telefono && (
                <span className="text-sm text-muted-foreground">
                  {fornitore.telefono}
                </span>
              )}
              {fornitore.email && (
                <span className="text-sm text-muted-foreground">
                  {fornitore.email}
                </span>
              )}
              {fornitore.nota && (
                <span className="text-sm text-muted-foreground">
                  {fornitore.nota}
                </span>
              )}
            </div>
            <div className="flex shrink-0 gap-2">
              <FornitoreFormDialog mode="edit" fornitore={fornitore} />
              <EliminaFornitoreDialog id={fornitore.id} nome={fornitore.nome} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
