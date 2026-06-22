import type { LucideIcon } from "lucide-react";
import { Wallet } from "lucide-react";

import type {
  PaymentWarning,
  PaymentWarningKind,
} from "@/lib/oggi/payment-warnings";

export type PriorityItem = {
  icon: LucideIcon;
  label: string;
  message: string;
  note?: string;
  href: string;
  ctaLabel: string;
};

const LABELS: Record<PaymentWarningKind, string> = {
  overdue: "Pagamento scaduto",
  to_remind: "Pagamento da sollecitare",
  upcoming: "Pagamento in scadenza",
  to_check: "Pagamento da controllare",
};

// Picks the single most urgent real payment warning to show on Oggi.
// Warnings already arrive sorted by urgency (see getPaymentWarnings).
export function getPriorityItem(warnings: PaymentWarning[]): PriorityItem | null {
  const principale = warnings[0];
  if (!principale) return null;

  const altri = warnings.length - 1;

  return {
    icon: Wallet,
    label: LABELS[principale.kind],
    message: principale.message,
    note: altri > 0 ? `Ci sono altri ${altri} pagamenti da controllare.` : undefined,
    href: "/pagamenti",
    ctaLabel: "Apri Pagamenti",
  };
}
