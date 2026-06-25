"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getActiveBusinessId } from "@/lib/supabase/business";

export type PromemoriaFormState = { error?: string; success?: string } | undefined;

export async function addPromemoria(
  _prevState: PromemoriaFormState,
  formData: FormData,
): Promise<PromemoriaFormState> {
  const titolo = String(formData.get("titolo") ?? "").trim();
  const dettaglio = String(formData.get("dettaglio") ?? "").trim();
  const scadenza = String(formData.get("scadenza") ?? "").trim();
  const importante = String(formData.get("importante") ?? "false") === "true";

  if (!titolo) {
    return { error: "Inserisci un titolo per il promemoria." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile salvare il promemoria." };
  }

  const { error } = await supabase.from("reminders").insert({
    business_id: businessId,
    title: titolo,
    detail: dettaglio || null,
    due_date: scadenza || null,
    important: importante,
  });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[promemoria] insert error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare il promemoria." };
  }

  revalidatePath("/promemoria");
  revalidatePath("/");
  return { success: "Promemoria aggiunto." };
}

export async function setPromemoriaFatto(
  _prevState: PromemoriaFormState,
  formData: FormData,
): Promise<PromemoriaFormState> {
  const id = String(formData.get("id") ?? "");
  const fatto = String(formData.get("fatto") ?? "true") === "true";

  if (!id) {
    return { error: "Non è stato possibile aggiornare il promemoria." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("reminders")
    .update({ done: fatto })
    .eq("id", id);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[promemoria] update error:", error.code, error.message);
    }
    return { error: "Non è stato possibile aggiornare il promemoria." };
  }

  revalidatePath("/promemoria");
  revalidatePath("/");
  return { success: "Promemoria aggiornato." };
}

export async function deletePromemoria(
  _prevState: PromemoriaFormState,
  formData: FormData,
): Promise<PromemoriaFormState> {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return { error: "Non è stato possibile eliminare il promemoria." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("reminders").delete().eq("id", id);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[promemoria] delete error:", error.code, error.message);
    }
    return { error: "Non è stato possibile eliminare il promemoria." };
  }

  revalidatePath("/promemoria");
  revalidatePath("/");
  return { success: "Promemoria eliminato." };
}
