// Types for the real, Supabase-backed Magazzino feature. Kept separate
// from the mock `ArticoloMagazzino` type in `@/lib/types` (still used by
// the mock-data sample list) so this section can move to real data on its
// own.

export type ProdottoRecord = {
  id: string;
  nome: string;
  quantita: number;
  scortaMinima: number | null;
  unita: string | null;
  categoria: string | null;
  fornitoreId: string | null;
  fornitore: string | null;
  nota: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProdottoRow = {
  id: string;
  name: string;
  quantity: number;
  minimum_quantity: number | null;
  unit: string | null;
  category: string | null;
  supplier_id: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
  suppliers: { name: string }[] | { name: string } | null;
};

export function mapProdottoRow(row: ProdottoRow): ProdottoRecord {
  const fornitore = Array.isArray(row.suppliers)
    ? row.suppliers[0]?.name ?? null
    : row.suppliers?.name ?? null;

  return {
    id: row.id,
    nome: row.name,
    quantita: row.quantity,
    scortaMinima: row.minimum_quantity,
    unita: row.unit,
    categoria: row.category,
    fornitoreId: row.supplier_id,
    fornitore,
    nota: row.note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function isScortaBassa(prodotto: ProdottoRecord): boolean {
  return prodotto.scortaMinima != null && prodotto.quantita <= prodotto.scortaMinima;
}
