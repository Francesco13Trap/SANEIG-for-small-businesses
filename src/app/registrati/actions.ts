"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type SignupState = { error?: string; success?: string } | undefined;

export async function signup(
  _prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!fullName || !email || !password) {
    return { error: "Compila tutti i campi." };
  }
  if (password.length < 8) {
    return { error: "La password deve avere almeno 8 caratteri." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    return { error: "Non è stato possibile creare l'account. Riprova." };
  }

  // Supabase returns a "fake" successful user with no identities when the
  // email is already registered, to avoid leaking which emails exist.
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return {
      error: "Questo indirizzo email è già registrato. Vai alla pagina di accesso.",
    };
  }

  if (!data.session) {
    return {
      success: "Controlla la tua email per confermare l'account, poi accedi.",
    };
  }

  redirect("/nuova-attivita");
}
