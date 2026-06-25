"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getActiveBusinessId } from "@/lib/supabase/business";
import { parseStatoScadenza } from "@/lib/scadenze/types";

export type ScadenzaFormState = { error?: string; success?: string } | undefined;

function readScadenzaFields(formData: FormData) {
  const titolo = String(formData.get("titolo") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "").trim();
  const scadenza = String(formData.get("scadenza") ?? "").trim();
  const stato = parseStatoScadenza(String(formData.get("stato") ?? "todo"));

  return {
    titolo,
    categoria: categoria || null,
    scadenza: scadenza || null,
    stato,
  };
}

export async function addScadenza(
  _prevState: ScadenzaFormState,
  formData: FormData,
): Promise<ScadenzaFormState> {
  const { titolo, categoria, scadenza, stato } = readScadenzaFields(formData);

  if (!titolo) {
    return { error: "Inserisci un titolo per la scadenza." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile salvare la scadenza." };
  }

  const { error } = await supabase.from("deadlines").insert({
    business_id: businessId,
    title: titolo,
    category: categoria,
    due_date: scadenza,
    status: stato,
  });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[scadenze] insert error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare la scadenza." };
  }

  revalidatePath("/scadenze-attivita");
  revalidatePath("/");
  return { success: "Scadenza aggiunta." };
}

export async function updateScadenza(
  _prevState: ScadenzaFormState,
  formData: FormData,
): Promise<ScadenzaFormState> {
  const id = String(formData.get("id") ?? "");
  const { titolo, categoria, scadenza, stato } = readScadenzaFields(formData);

  if (!id) {
    return { error: "Non è stato possibile salvare la scadenza." };
  }
  if (!titolo) {
    return { error: "Inserisci un titolo per la scadenza." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("deadlines")
    .update({
      title: titolo,
      category: categoria,
      due_date: scadenza,
      status: stato,
    })
    .eq("id", id);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[scadenze] update error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare la scadenza." };
  }

  revalidatePath("/scadenze-attivita");
  revalidatePath("/");
  return { success: "Scadenza aggiornata." };
}

export async function setScadenzaCompletata(
  _prevState: ScadenzaFormState,
  formData: FormData,
): Promise<ScadenzaFormState> {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return { error: "Non è stato possibile aggiornare la scadenza." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("deadlines")
    .update({ status: "done" })
    .eq("id", id);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[scadenze] update error:", error.code, error.message);
    }
    return { error: "Non è stato possibile aggiornare la scadenza." };
  }

  revalidatePath("/scadenze-attivita");
  revalidatePath("/");
  return { success: "Scadenza completata." };
}

export async function deleteScadenza(
  _prevState: ScadenzaFormState,
  formData: FormData,
): Promise<ScadenzaFormState> {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return { error: "Non è stato possibile eliminare la scadenza." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("deadlines").delete().eq("id", id);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[scadenze] delete error:", error.code, error.message);
    }
    return { error: "Non è stato possibile eliminare la scadenza." };
  }

  revalidatePath("/scadenze-attivita");
  revalidatePath("/");
  return { success: "Scadenza eliminata." };
}
