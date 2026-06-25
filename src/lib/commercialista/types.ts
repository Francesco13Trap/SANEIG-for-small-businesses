// Types for the real, Supabase-backed Commercialista feature.

export type DocumentoMancanteRecord = {
  id: string;
  descrizione: string;
};

export type DocumentoMancanteRow = {
  id: string;
  description: string;
};

export function mapDocumentoMancanteRow(
  row: DocumentoMancanteRow,
): DocumentoMancanteRecord {
  return {
    id: row.id,
    descrizione: row.description,
  };
}
