import type { PaymentWarning, PaymentWarningKind } from "@/lib/oggi/payment-warnings";
import type {
  SubscriptionWarning,
  SubscriptionWarningKind,
} from "@/lib/oggi/subscription-warnings";

export type OggiWarningKind =
  | "subscription_expired"
  | "subscription_expiring"
  | "payment_overdue"
  | "payment_to_remind"
  | "payment_upcoming"
  | "payment_to_check";

export type OggiWarning = {
  kind: OggiWarningKind;
  id: string;
  cliente: string;
  message: string;
};

// Required priority order: expired/expiring abbonamenti always outrank
// payment warnings.
const PRIORITY: OggiWarningKind[] = [
  "subscription_expired",
  "subscription_expiring",
  "payment_overdue",
  "payment_to_remind",
  "payment_upcoming",
  "payment_to_check",
];

export const OGGI_WARNING_HREF: Record<OggiWarningKind, string> = {
  subscription_expired: "/abbonamenti",
  subscription_expiring: "/abbonamenti",
  payment_overdue: "/pagamenti",
  payment_to_remind: "/pagamenti",
  payment_upcoming: "/pagamenti",
  payment_to_check: "/pagamenti",
};

const SUBSCRIPTION_KIND_MAP: Record<SubscriptionWarningKind, OggiWarningKind> = {
  expired: "subscription_expired",
  expiring: "subscription_expiring",
};

const PAYMENT_KIND_MAP: Record<PaymentWarningKind, OggiWarningKind> = {
  overdue: "payment_overdue",
  to_remind: "payment_to_remind",
  upcoming: "payment_upcoming",
  to_check: "payment_to_check",
};

// Merges abbonamenti and pagamenti warnings into the single ordered list
// Oggi's priority card and suggested actions read from.
export function buildOggiWarnings(
  subscriptionWarnings: SubscriptionWarning[],
  paymentWarnings: PaymentWarning[],
): OggiWarning[] {
  const combined: OggiWarning[] = [
    ...subscriptionWarnings.map((w) => ({
      kind: SUBSCRIPTION_KIND_MAP[w.kind],
      id: w.abbonamentoId,
      cliente: w.cliente,
      message: w.message,
    })),
    ...paymentWarnings.map((w) => ({
      kind: PAYMENT_KIND_MAP[w.kind],
      id: w.pagamentoId,
      cliente: w.cliente,
      message: w.message,
    })),
  ];

  return combined.sort(
    (a, b) => PRIORITY.indexOf(a.kind) - PRIORITY.indexOf(b.kind),
  );
}
