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
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "[login] signInWithPassword error:",
        error.code,
        error.status,
        error.message,
      );
    }

    if (error.code === "email_not_confirmed") {
      return {
        error: "Email non confermata. Controlla la tua casella di posta.",
      };
    }

    return { error: "Email o password non corretti." };
  }

  const { data: membership, error: membershipError } = await supabase
    .from("business_members")
    .select("business_id")
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "[login] business_members lookup error:",
        membershipError.message,
      );
    }

    return {
      error:
        "Accesso riuscito, ma non è stato possibile caricare i dati dell'attività.",
    };
  }

  redirect(membership ? "/" : "/nuova-attivita");
}
