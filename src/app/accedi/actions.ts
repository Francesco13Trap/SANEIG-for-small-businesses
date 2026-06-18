"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { buildAuthDebug, type AuthDebugInfo } from "@/lib/auth-debug";

export type LoginState = { error?: string; debug?: AuthDebugInfo } | undefined;

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      error: "Inserisci email e password.",
      debug: buildAuthDebug(
        "login",
        "Validazione modulo",
        "Email o password mancanti.",
      ),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const debug = buildAuthDebug(
      "login",
      "Supabase signInWithPassword",
      error.message,
      error.code ?? (error.status ? String(error.status) : undefined),
    );

    if (error.code === "email_not_confirmed") {
      return {
        error: "Email non confermata. Controlla la tua casella di posta.",
        debug,
      };
    }

    return { error: "Email o password non corretti.", debug };
  }

  if (!data.session) {
    return {
      error: "Email o password non corretti.",
      debug: buildAuthDebug(
        "login",
        "Sessione restituita da Supabase",
        "signInWithPassword non ha restituito una sessione.",
      ),
    };
  }

  const { data: membership, error: membershipError } = await supabase
    .from("business_members")
    .select("business_id")
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    return {
      error:
        "Accesso riuscito, ma non è stato possibile caricare i dati dell'attività.",
      debug: buildAuthDebug(
        "login",
        "Caricamento attività (business_members)",
        membershipError.message,
        membershipError.code,
      ),
    };
  }

  redirect(membership ? "/" : "/nuova-attivita");
}
