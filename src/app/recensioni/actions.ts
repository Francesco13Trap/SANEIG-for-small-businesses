"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getActiveBusinessId } from "@/lib/supabase/business";

export type RecensioneFormState = { error?: string; success?: string } | undefined;

function readRecensioneFields(formData: FormData) {
  const cliente = String(formData.get("cliente") ?? "").trim();
  const testo = String(formData.get("testo") ?? "").trim();
  const data = String(formData.get("data") ?? "").trim();
  const punteggioRaw = Number(formData.get("punteggio"));
  const punteggio = Number.isFinite(punteggioRaw)
    ? Math.min(5, Math.max(1, Math.trunc(punteggioRaw)))
    : 5;

  return { cliente, punteggio, testo, data: data || null };
}

export async function addRecensione(
  _prevState: RecensioneFormState,
  formData: FormData,
): Promise<RecensioneFormState> {
  const { cliente, punteggio, testo, data } = readRecensioneFields(formData);

  if (!cliente) {
    return { error: "Inserisci il nome del cliente." };
  }
  if (!testo) {
    return { error: "Inserisci il testo della recensione." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile salvare la recensione." };
  }

  const { error } = await supabase.from("reviews").insert({
    business_id: businessId,
    client_name: cliente,
    rating: punteggio,
    comment: testo,
    review_date: data,
  });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[recensioni] insert error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare la recensione." };
  }

  revalidatePath("/recensioni");
  return { success: "Recensione aggiunta." };
}

export async function updateRecensione(
  _prevState: RecensioneFormState,
  formData: FormData,
): Promise<RecensioneFormState> {
  const id = String(formData.get("id") ?? "");
  const { cliente, punteggio, testo, data } = readRecensioneFields(formData);

  if (!id) {
    return { error: "Non è stato possibile salvare la recensione." };
  }
  if (!cliente) {
    return { error: "Inserisci il nome del cliente." };
  }
  if (!testo) {
    return { error: "Inserisci il testo della recensione." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile salvare la recensione." };
  }

  const { error } = await supabase
    .from("reviews")
    .update({
      client_name: cliente,
      rating: punteggio,
      comment: testo,
      review_date: data,
    })
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[recensioni] update error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare la recensione." };
  }

  revalidatePath("/recensioni");
  return { success: "Recensione aggiornata." };
}

export async function setRecensioneRisposta(
  _prevState: RecensioneFormState,
  formData: FormData,
): Promise<RecensioneFormState> {
  const id = String(formData.get("id") ?? "");
  const risposto = String(formData.get("risposto") ?? "true") === "true";

  if (!id) {
    return { error: "Non è stato possibile aggiornare la recensione." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile aggiornare la recensione." };
  }

  const { error } = await supabase
    .from("reviews")
    .update({ responded: risposto })
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[recensioni] update error:", error.code, error.message);
    }
    return { error: "Non è stato possibile aggiornare la recensione." };
  }

  revalidatePath("/recensioni");
  return { success: "Recensione aggiornata." };
}

export async function deleteRecensione(
  _prevState: RecensioneFormState,
  formData: FormData,
): Promise<RecensioneFormState> {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return { error: "Non è stato possibile eliminare la recensione." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile eliminare la recensione." };
  }

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[recensioni] delete error:", error.code, error.message);
    }
    return { error: "Non è stato possibile eliminare la recensione." };
  }

  revalidatePath("/recensioni");
  return { success: "Recensione eliminata." };
}
