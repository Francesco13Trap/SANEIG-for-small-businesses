// Types for the real, Supabase-backed Clienti feature. Kept separate from
// the mock `Cliente` type in `@/lib/types` (still used by the Oggi page's
// mock data) so this section can move to real data on its own.

export type ClienteRecord = {
  id: string;
  nome: string;
  telefono: string | null;
  email: string | null;
  nota: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ClienteRow = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export function mapClienteRow(row: ClienteRow): ClienteRecord {
  return {
    id: row.id,
    nome: row.name,
    telefono: row.phone,
    email: row.email,
    nota: row.note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
