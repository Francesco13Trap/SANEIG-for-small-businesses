import { Badge, type badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  Nuovo: "outline",
  Abituale: "success",
  "Da ricontattare": "warning",

  "Da controllare": "outline",
  "Da sollecitare": "warning",
  Pagato: "success",

  Attivo: "success",
  "In scadenza": "warning",
  Scaduto: "destructive",
  "Da rinnovare": "warning",

  Attiva: "success",
  Programmata: "outline",
  Conclusa: "secondary",

  "Da rispondere": "warning",
  Risposto: "success",

  "Da inviare": "outline",
  Inviato: "secondary",
  Accettato: "success",
  Rifiutato: "destructive",

  "Da pagare": "warning",

  "Da contattare": "warning",

  Disponibile: "success",
  "In esaurimento": "warning",
  "Da ordinare": "destructive",

  "Da fare": "outline",
  "In corso": "warning",
  Completata: "success",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge variant={STATUS_VARIANT[status] ?? "secondary"}>{status}</Badge>;
}
