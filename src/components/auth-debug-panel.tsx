import type { AuthDebugInfo } from "@/lib/auth-debug";

// Temporary diagnostic panel for production auth debugging. Remove once the
// root cause of login/signup failures is found.
export function AuthDebugPanel({
  title,
  debug,
}: {
  title: string;
  debug: AuthDebugInfo;
}) {
  return (
    <div className="space-y-0.5 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs text-muted-foreground">
      <p className="font-medium text-destructive">{title}</p>
      <p>Fase: {debug.phase}</p>
      <p>Dettaglio: {debug.detail}</p>
      {debug.code && <p>Codice: {debug.code}</p>}
    </div>
  );
}
