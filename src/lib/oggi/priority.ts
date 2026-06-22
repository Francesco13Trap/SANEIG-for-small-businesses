import type { LucideIcon } from "lucide-react";
import { Repeat, Wallet } from "lucide-react";

import { OGGI_WARNING_HREF, type OggiWarning, type OggiWarningKind } from "@/lib/oggi/warnings";

export type PriorityItem = {
  icon: LucideIcon;
  label: string;
  message: string;
  note?: string;
  href: string;
  ctaLabel: string;
};

const LABELS: Record<OggiWarningKind, string> = {
  subscription_expired: "Abbonamento scaduto",
  subscription_expiring: "Abbonamento in scadenza",
  payment_overdue: "Pagamento scaduto",
  payment_to_remind: "Pagamento da sollecitare",
  payment_upcoming: "Pagamento in scadenza",
  payment_to_check: "Pagamento da controllare",
};

const ICONS: Record<OggiWarningKind, LucideIcon> = {
  subscription_expired: Repeat,
  subscription_expiring: Repeat,
  payment_overdue: Wallet,
  payment_to_remind: Wallet,
  payment_upcoming: Wallet,
  payment_to_check: Wallet,
};

const CTA_LABELS: Record<OggiWarningKind, string> = {
  subscription_expired: "Apri Abbonamenti",
  subscription_expiring: "Apri Abbonamenti",
  payment_overdue: "Apri Pagamenti",
  payment_to_remind: "Apri Pagamenti",
  payment_upcoming: "Apri Pagamenti",
  payment_to_check: "Apri Pagamenti",
};

// Picks the single most urgent real warning to show on Oggi. Warnings
// already arrive sorted by urgency (see buildOggiWarnings).
export function getPriorityItem(warnings: OggiWarning[]): PriorityItem | null {
  const principale = warnings[0];
  if (!principale) return null;

  const altri = warnings.length - 1;

  return {
    icon: ICONS[principale.kind],
    label: LABELS[principale.kind],
    message: principale.message,
    note: altri > 0 ? `Ci sono altri ${altri} avvisi da controllare.` : undefined,
    href: OGGI_WARNING_HREF[principale.kind],
    ctaLabel: CTA_LABELS[principale.kind],
  };
}
