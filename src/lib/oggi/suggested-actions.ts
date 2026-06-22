import type { PaymentWarning } from "@/lib/oggi/payment-warnings";

export type SuggestedAction = {
  id: string;
  label: string;
  href: string;
};

const MAX_ACTIONS = 3;

// Turns the remaining real payment warnings into a short, calm to-do list.
// The most urgent one is already shown in "Da controllare prima", so it's
// skipped here.
export function getSuggestedActions(warnings: PaymentWarning[]): SuggestedAction[] {
  return warnings.slice(1, 1 + MAX_ACTIONS).map((warning) => ({
    id: warning.pagamentoId,
    label: warning.message,
    href: "/pagamenti",
  }));
}
