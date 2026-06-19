"use server";

import { createClient } from "@/lib/supabase/server";

export type UpdatePasswordState =
  | { error?: string; success?: string }
  | undefined;

export async function updatePassword(
  _prevState: UpdatePasswordState,
  formData: FormData,
): Promise<UpdatePasswordState> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    return { error: "La password deve avere almeno 8 caratteri." };
  }

  if (password !== confirmPassword) {
    return { error: "Le password non coincidono." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "[nuova-password] updateUser error:",
        error.code,
        error.message,
      );
    }

    return { error: "Non è stato possibile aggiornare la password. Riprova." };
  }

  await supabase.auth.signOut();

  return { success: "Password aggiornata. Ora puoi accedere." };
}
