import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { TrustNote } from "@/components/trust-note";
import { Card, CardContent } from "@/components/ui/card";
import { ProdottoFormDialog } from "@/components/magazzino/prodotto-form-dialog";
import { MagazzinoTable } from "@/components/magazzino/magazzino-table";
import { getActiveBusinessId } from "@/lib/supabase/business";
import { createClient } from "@/lib/supabase/server";
import { mapProdottoRow, type ProdottoRow } from "@/lib/magazzino/types";

// Reads the session and the inventory list via Supabase on every request —
// must never be prerendered at build time, when env vars/cookies aren't
// available.
export const dynamic = "force-dynamic";

export default async function MagazzinoPage() {
  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    redirect("/nuova-attivita");
  }

  const [itemsResult, suppliersResult] = await Promise.all([
    supabase
      .from("inventory_items")
      .select(
        "id, supplier_id, name, quantity, minimum_quantity, unit, category, note, created_at, updated_at, suppliers(name)",
      )
      .eq("business_id", businessId)
      .order("name", { ascending: true }),
    supabase
      .from("suppliers")
      .select("id, name")
      .eq("business_id", businessId)
      .order("name", { ascending: true }),
  ]);

  const { data, error } = itemsResult;
  const prodotti = ((data as ProdottoRow[]) ?? []).map(mapProdottoRow);
  const fornitori = (suppliersResult.data ?? []).map((f) => ({
    id: f.id,
    nome: f.name,
  }));

  return (
    <div>
      <PageHeader
        title="Magazzino"
        description="Cosa hai in magazzino e cosa sta per finire."
      />

      {error ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-destructive">
              Non è stato possibile caricare il magazzino.
            </p>
          </CardContent>
        </Card>
      ) : prodotti.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-4 p-6">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-foreground">
                Nessun prodotto salvato.
              </p>
              <p className="text-sm text-muted-foreground">
                Aggiungi il primo prodotto per tenere il magazzino sotto
                controllo.
              </p>
            </div>
            <ProdottoFormDialog mode="add" fornitori={fornitori} />
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <ProdottoFormDialog mode="add" fornitori={fornitori} />
          </div>
          <MagazzinoTable prodotti={prodotti} fornitori={fornitori} />
        </div>
      )}

      <TrustNote className="mt-6">
        Puoi modificare tutto in qualsiasi momento.
      </TrustNote>
    </div>
  );
}
