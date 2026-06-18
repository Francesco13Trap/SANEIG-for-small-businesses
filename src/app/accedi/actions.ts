"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type LoginState = { error?: string } | undefined;

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Inserisci email e password." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[login] signInWithPassword error:", error.code, error.message);
    }

    if (error.code === "email_not_confirmed") {
      return {
        error: "Email non confermata. Controlla la tua casella di posta.",
      };
    }

    return { error: "Email o password non corretti." };
  }

  if (!data.session) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[login] signInWithPassword non ha restituito una sessione.");
    }

    return { error: "Non è stato possibile completare l'accesso. Riprova." };
  }

  const { data: membership, error: membershipError } = await supabase
    .from("business_members")
    .select("business_id")
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[login] business_members lookup error:", membershipError.message);
    }

    return { error: "Non è stato possibile completare l'accesso. Riprova." };
  }

  redirect(membership ? "/" : "/nuova-attivita");
}
