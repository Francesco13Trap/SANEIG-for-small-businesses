"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type CreaAttivitaState = { error?: string } | undefined;

export async function creaAttivita(
  _prevState: CreaAttivitaState,
  formData: FormData,
): Promise<CreaAttivitaState> {
  const nome = String(formData.get("nome") ?? "").trim();

  if (!nome) {
    return { error: "Inserisci il nome della tua attività." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("create_business", {
    business_name: nome,
  });

  if (error) {
    return { error: "Non è stato possibile creare l'attività. Riprova." };
  }

  redirect("/");
}
