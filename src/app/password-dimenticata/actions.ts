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

  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const proto = headersList.get("x-forwarded-proto") ?? "http";

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${proto}://${host}/nuova-password`,
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
