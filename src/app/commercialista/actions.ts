"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getActiveBusinessId } from "@/lib/supabase/business";
import { startOfCurrentMonth } from "@/lib/monthly-period";

export type CommercialistaFormState = { error?: string; success?: string } | undefined;

export async function addDocumentoMancante(
  _prevState: CommercialistaFormState,
  formData: FormData,
): Promise<CommercialistaFormState> {
  const descrizione = String(formData.get("descrizione") ?? "").trim();

  if (!descrizione) {
    return { error: "Inserisci il nome del documento." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile salvare il documento." };
  }

  const { error } = await supabase.from("missing_documents").insert({
    business_id: businessId,
    description: descrizione,
  });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[commercialista] insert documento error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare il documento." };
  }

  revalidatePath("/commercialista");
  return { success: "Documento aggiunto." };
}

export async function deleteDocumentoMancante(
  _prevState: CommercialistaFormState,
  formData: FormData,
): Promise<CommercialistaFormState> {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return { error: "Non è stato possibile aggiornare il documento." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile aggiornare il documento." };
  }

  const { error } = await supabase
    .from("missing_documents")
    .delete()
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[commercialista] delete documento error:", error.code, error.message);
    }
    return { error: "Non è stato possibile aggiornare il documento." };
  }

  revalidatePath("/commercialista");
  return { success: "Documento segnato come trovato." };
}

export async function updateNoteDelMese(
  _prevState: CommercialistaFormState,
  formData: FormData,
): Promise<CommercialistaFormState> {
  const note = String(formData.get("note") ?? "").trim();

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile salvare la nota." };
  }

  const { error } = await supabase.from("monthly_revenue_summaries").upsert(
    {
      business_id: businessId,
      period: startOfCurrentMonth(),
      notes: note,
    },
    { onConflict: "business_id,period" },
  );

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[commercialista] note update error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare la nota." };
  }

  revalidatePath("/commercialista");
  return { success: "Nota salvata." };
}
