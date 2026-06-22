import { OGGI_WARNING_HREF, type OggiWarning } from "@/lib/oggi/warnings";

export type SuggestedAction = {
  id: string;
  label: string;
  href: string;
};

const MAX_ACTIONS = 3;

// Turns the remaining real warnings (abbonamenti and pagamenti) into a
// short, calm to-do list. The most urgent one is already shown in "Da
// controllare prima", so it's skipped here.
export function getSuggestedActions(warnings: OggiWarning[]): SuggestedAction[] {
  return warnings.slice(1, 1 + MAX_ACTIONS).map((warning) => ({
    id: warning.id,
    label: warning.message,
    href: OGGI_WARNING_HREF[warning.kind],
  }));
}
