// Types for the real, Supabase-backed Fornitori feature. Kept separate
// from the mock `Fornitore` type in `@/lib/types` (still used by the
// mock-data sample list) so this section can move to real data on its own.

export type FornitoreRecord = {
  id: string;
  nome: string;
  referente: string | null;
  telefono: string | null;
  email: string | null;
  categoria: string | null;
  nota: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FornitoreRow = {
  id: string;
  name: string;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  category: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export function mapFornitoreRow(row: FornitoreRow): FornitoreRecord {
  return {
    id: row.id,
    nome: row.name,
    referente: row.contact_name,
    telefono: row.phone,
    email: row.email,
    categoria: row.category,
    nota: row.note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
