"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getActiveBusinessId } from "@/lib/supabase/business";
import { parseStatoPromozione } from "@/lib/promozioni/types";

export type PromozioneFormState = { error?: string; success?: string } | undefined;

function readPromozioneFields(formData: FormData) {
  const titolo = String(formData.get("titolo") ?? "").trim();
  const descrizione = String(formData.get("descrizione") ?? "").trim();
  const periodo = String(formData.get("periodo") ?? "").trim();
  const stato = parseStatoPromozione(String(formData.get("stato") ?? "scheduled"));

  return {
    titolo,
    descrizione: descrizione || null,
    periodo: periodo || null,
    stato,
  };
}

export async function addPromozione(
  _prevState: PromozioneFormState,
  formData: FormData,
): Promise<PromozioneFormState> {
  const { titolo, descrizione, periodo, stato } = readPromozioneFields(formData);

  if (!titolo) {
    return { error: "Inserisci un titolo per la promozione." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile salvare la promozione." };
  }

  const { error } = await supabase.from("promotions").insert({
    business_id: businessId,
    title: titolo,
    description: descrizione,
    period: periodo,
    status: stato,
  });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[promozioni] insert error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare la promozione." };
  }

  revalidatePath("/promozioni");
  return { success: "Promozione aggiunta." };
}

export async function updatePromozione(
  _prevState: PromozioneFormState,
  formData: FormData,
): Promise<PromozioneFormState> {
  const id = String(formData.get("id") ?? "");
  const { titolo, descrizione, periodo, stato } = readPromozioneFields(formData);

  if (!id) {
    return { error: "Non è stato possibile salvare la promozione." };
  }
  if (!titolo) {
    return { error: "Inserisci un titolo per la promozione." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("promotions")
    .update({
      title: titolo,
      description: descrizione,
      period: periodo,
      status: stato,
    })
    .eq("id", id);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[promozioni] update error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare la promozione." };
  }

  revalidatePath("/promozioni");
  return { success: "Promozione aggiornata." };
}

export async function deletePromozione(
  _prevState: PromozioneFormState,
  formData: FormData,
): Promise<PromozioneFormState> {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return { error: "Non è stato possibile eliminare la promozione." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("promotions").delete().eq("id", id);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[promozioni] delete error:", error.code, error.message);
    }
    return { error: "Non è stato possibile eliminare la promozione." };
  }

  revalidatePath("/promozioni");
  return { success: "Promozione eliminata." };
}
