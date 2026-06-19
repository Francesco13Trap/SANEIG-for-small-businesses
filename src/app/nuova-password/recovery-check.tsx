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

// Supabase can deliver the recovery session to this page in three different
// ways depending on the email template/flow configuration: a URL hash
// fragment (#access_token=...&refresh_token=...&type=recovery), a
// ?token_hash=...&type=recovery query param, or a PKCE ?code= query param
// (handled automatically by the client on init). All three must be checked
// before deciding the link is invalid.
function useRecoverySession(): Status {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    const supabase = createClient();
    let settled = false;

    const settle = (valid: boolean) => {
      if (settled) return;
      settled = true;
      setStatus(valid ? "valid" : "invalid");
    };

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
        settle(!error && !!data.session);
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
        settle(!error && !!data.session);
        return;
      }

      // No hash/token_hash in the URL: covers a PKCE `code` query param
      // (exchanged automatically by the client on init) and the case of an
      // already-active session.
      const { data } = await supabase.auth.getSession();
      settle(!!data.session);
    }

    checkRecoveryLink();

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        settle(true);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return status;
}

export function RecoveryCheck() {
  const status = useRecoverySession();

  if (status === "checking") {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Verifica del link in corso…</CardTitle>
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
            Link non valido o scaduto. Richiedi un nuovo link.
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
