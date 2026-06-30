"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getActiveBusinessId } from "@/lib/supabase/business";
import { parseStatoStipendio } from "@/lib/stipendi/types";

export type StipendioFormState = { error?: string; success?: string } | undefined;

function readStipendioFields(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const ruolo = String(formData.get("ruolo") ?? "").trim();
  const importoRaw = String(formData.get("importo") ?? "").trim();
  const mese = String(formData.get("mese") ?? "").trim();
  const scadenza = String(formData.get("scadenza") ?? "").trim();
  const stato = parseStatoStipendio(String(formData.get("stato") ?? "to_pay"));
  const nota = String(formData.get("nota") ?? "").trim();
  const importo = Number(importoRaw.replace(",", "."));

  return {
    nome,
    ruolo: ruolo || null,
    importo,
    mese,
    scadenza: scadenza || null,
    stato,
    nota: nota || null,
  };
}

export async function addStipendio(
  _prevState: StipendioFormState,
  formData: FormData,
): Promise<StipendioFormState> {
  const { nome, ruolo, importo, mese, scadenza, stato, nota } = readStipendioFields(formData);

  if (!nome) {
    return { error: "Inserisci il nome del collaboratore." };
  }

  if (!mese) {
    return { error: "Inserisci il mese di riferimento." };
  }

  if (!Number.isFinite(importo) || importo <= 0) {
    return { error: "Inserisci un importo valido." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile salvare il promemoria." };
  }

  const { error } = await supabase.from("staff_payments").insert({
    business_id: businessId,
    person_name: nome,
    role: ruolo,
    amount: importo,
    month: mese,
    due_date: scadenza,
    status: stato,
    note: nota,
  });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[stipendi] insert error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare il promemoria." };
  }

  revalidatePath("/stipendi");
  return { success: "Promemoria aggiunto." };
}

export async function updateStipendio(
  _prevState: StipendioFormState,
  formData: FormData,
): Promise<StipendioFormState> {
  const id = String(formData.get("id") ?? "");
  const { nome, ruolo, importo, mese, scadenza, stato, nota } = readStipendioFields(formData);

  if (!id) {
    return { error: "Non è stato possibile salvare il promemoria." };
  }

  if (!nome) {
    return { error: "Inserisci il nome del collaboratore." };
  }

  if (!mese) {
    return { error: "Inserisci il mese di riferimento." };
  }

  if (!Number.isFinite(importo) || importo <= 0) {
    return { error: "Inserisci un importo valido." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile salvare il promemoria." };
  }

  const { error } = await supabase
    .from("staff_payments")
    .update({
      person_name: nome,
      role: ruolo,
      amount: importo,
      month: mese,
      due_date: scadenza,
      status: stato,
      note: nota,
    })
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[stipendi] update error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare il promemoria." };
  }

  revalidatePath("/stipendi");
  return { success: "Promemoria aggiornato." };
}

export async function deleteStipendio(
  _prevState: StipendioFormState,
  formData: FormData,
): Promise<StipendioFormState> {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return { error: "Non è stato possibile eliminare il promemoria." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile eliminare il promemoria." };
  }

  const { error } = await supabase
    .from("staff_payments")
    .delete()
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[stipendi] delete error:", error.code, error.message);
    }
    return { error: "Non è stato possibile eliminare il promemoria." };
  }

  revalidatePath("/stipendi");
  return { success: "Promemoria eliminato." };
}
