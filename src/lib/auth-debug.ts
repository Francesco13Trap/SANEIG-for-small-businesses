// Temporary diagnostic helper for surfacing exactly which auth step failed,
// directly in the login/registration UI. Remove once the production
// signup/login failure is root-caused.
export type AuthDebugInfo = {
  phase: string;
  detail: string;
  code?: string;
};

export function buildAuthDebug(
  scope: string,
  phase: string,
  detail: string,
  code?: string,
): AuthDebugInfo {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[${scope}] Fase: ${phase} — ${detail}`, code ? `(codice: ${code})` : "");
  }
  return { phase, detail, code };
}
