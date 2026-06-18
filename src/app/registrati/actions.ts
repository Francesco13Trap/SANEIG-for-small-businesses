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
    return { error: "Password troppo corta. Usa almeno 8 caratteri." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "[signup] signUp error:",
        error.code,
        error.status,
        error.message,
      );
    }

    if (error.code === "user_already_exists" || error.code === "email_exists") {
      return { error: "Email già registrata. Prova ad accedere." };
    }

    if (error.code === "weak_password") {
      return { error: "Password troppo corta. Usa almeno 8 caratteri." };
    }

    return { error: "Non è stato possibile creare l'account. Riprova." };
  }

  // Supabase returns a "fake" successful user with no identities when the
  // email is already registered, to avoid leaking which emails exist.
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return {
      error: "Email già registrata. Prova ad accedere.",
    };
  }

  if (!data.session) {
    return {
      success: "Controlla la tua email per confermare l'account, poi accedi.",
    };
  }

  redirect("/nuova-attivita");
}
