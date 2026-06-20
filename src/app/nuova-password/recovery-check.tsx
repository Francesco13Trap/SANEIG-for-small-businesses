"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NuovaPasswordForm } from "@/app/nuova-password/nuova-password-form";
import { createClient } from "@/lib/supabase/client";

type Status = "checking" | "valid" | "invalid";

// Generous timeout: never flash "invalid" while Supabase is still
// processing the link. Only declare it dead once nothing has resolved a
// session by then.
const RECOVERY_TIMEOUT_MS = 8000;

// By the time the browser reaches this page, /auth/confirm has normally
// already exchanged the link for a session server-side, so a session
// already exists in cookies. The checks below remain as a safety net for
// links generated before that route existed and for the implicit hash-token
// flow, which only the browser can read (the fragment never reaches the
// server).
// /auth/confirm redirects here with ?error=... when it couldn't exchange
// the link; Supabase's own hosted verify endpoint can also add an error
// param directly for an expired/already-used link.
function hasErrorParam(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("error");
}

function useRecoverySession(): Status {
  const [status, setStatus] = useState<Status>(() =>
    hasErrorParam() ? "invalid" : "checking",
  );

  useEffect(() => {
    if (hasErrorParam()) return;

    const supabase = createClient();
    let settled = false;

    const settle = (valid: boolean) => {
      if (settled) return;
      settled = true;
      setStatus(valid ? "valid" : "invalid");
    };

    const timeoutId = window.setTimeout(() => settle(false), RECOVERY_TIMEOUT_MS);

    async function checkRecoveryLink() {
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (accessToken && refreshToken) {
        window.history.replaceState(null, "", window.location.pathname);
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (!error && data.session) settle(true);
        return;
      }

      const queryParams = new URLSearchParams(window.location.search);
      const tokenHash = queryParams.get("token_hash");
      const type = queryParams.get("type");

      if (tokenHash && type === "recovery") {
        const { data, error } = await supabase.auth.verifyOtp({
          type: "recovery",
          token_hash: tokenHash,
        });
        if (!error && data.session) settle(true);
        return;
      }

      // No token in the URL: either a session already exists (the normal
      // case after /auth/confirm) or a legacy PKCE `?code=` link is still
      // being exchanged automatically by the client on init.
      const { data } = await supabase.auth.getSession();
      if (data.session) settle(true);
    }

    checkRecoveryLink();

    // PKCE code exchanges resolve as a plain SIGNED_IN event, not
    // PASSWORD_RECOVERY — both must be treated as a valid recovery session
    // on this page, since it's only ever reachable from a reset-password
    // link.
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        settle(true);
      }
    });

    return () => {
      window.clearTimeout(timeoutId);
      listener.subscription.unsubscribe();
    };
  }, []);

  return status;
}

export function RecoveryCheck() {
  const status = useRecoverySession();

  if (status === "checking") {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Controllo del link in corso…</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (status === "invalid") {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Link non valido</CardTitle>
          <CardDescription>
            Il link non è valido o è scaduto. Richiedi un nuovo link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/password-dimenticata"
            className="text-sm font-medium text-primary hover:underline"
          >
            Richiedi un nuovo link
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Crea una nuova password</CardTitle>
        <CardDescription>
          Scegli una nuova password per il tuo account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NuovaPasswordForm />
      </CardContent>
    </Card>
  );
}
