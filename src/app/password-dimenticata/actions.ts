"use server";

import { headers } from "next/headers";

import { createClient } from "@/lib/supabase/server";

export type RequestResetState = { error?: string; success?: string } | undefined;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function requestPasswordReset(
  _prevState: RequestResetState,
  formData: FormData,
): Promise<RequestResetState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email || !EMAIL_REGEX.test(email)) {
    return { error: "Inserisci un'email valida." };
  }

  // NEXT_PUBLIC_APP_URL lets the deployment pin one stable origin (the one
  // registered in Supabase's Redirect URLs); falls back to this request's
  // own host when it isn't set.
  const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  let origin = configuredAppUrl;
  if (!origin) {
    const headersList = await headers();
    const host = headersList.get("host") ?? "";
    const proto = headersList.get("x-forwarded-proto") ?? "http";
    origin = `${proto}://${host}`;
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=${encodeURIComponent("/nuova-password")}`,
  });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "[password-dimenticata] resetPasswordForEmail error:",
        error.code,
        error.message,
      );
    }

    return { error: "Non è stato possibile inviare il link. Riprova." };
  }

  // Always the same message whether or not the email is registered, so the
  // app never reveals which emails exist in the system.
  return {
    success: "Se l'email è registrata, riceverai un link per reimpostare la password.",
  };
}
