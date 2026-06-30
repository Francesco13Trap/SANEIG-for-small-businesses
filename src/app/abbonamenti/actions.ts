"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { clientBelongsToBusiness, getActiveBusinessId } from "@/lib/supabase/business";
import { parseStatoAbbonamento } from "@/lib/abbonamenti/types";

export type AbbonamentoFormState = { error?: string; success?: string } | undefined;

function readAbbonamentoFields(formData: FormData) {
  const clienteId = String(formData.get("clienteId") ?? "").trim();
  const nome = String(formData.get("nome") ?? "").trim();
  const dataInizio = String(formData.get("dataInizio") ?? "").trim();
  const scadenza = String(formData.get("scadenza") ?? "").trim();
  const stato = parseStatoAbbonamento(String(formData.get("stato") ?? "active"));
  const nota = String(formData.get("nota") ?? "").trim();

  return {
    clienteId: clienteId || null,
    nome,
    dataInizio: dataInizio || null,
    scadenza,
    stato,
    nota: nota || null,
  };
}

export async function addAbbonamento(
  _prevState: AbbonamentoFormState,
  formData: FormData,
): Promise<AbbonamentoFormState> {
  const { clienteId, nome, dataInizio, scadenza, stato, nota } =
    readAbbonamentoFields(formData);

  if (!nome) {
    return { error: "Inserisci il nome dell'abbonamento." };
  }
  if (!scadenza) {
    return { error: "Inserisci la data di scadenza." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile salvare l'abbonamento." };
  }

  if (clienteId && !(await clientBelongsToBusiness(supabase, clienteId, businessId))) {
    return { error: "Il cliente selezionato non è valido." };
  }

  const { error } = await supabase.from("subscriptions").insert({
    business_id: businessId,
    client_id: clienteId,
    name: nome,
    start_date: dataInizio,
    expiry_date: scadenza,
    status: stato,
    note: nota,
  });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[abbonamenti] insert error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare l'abbonamento." };
  }

  revalidatePath("/abbonamenti");
  return { success: "Abbonamento aggiunto." };
}

export async function updateAbbonamento(
  _prevState: AbbonamentoFormState,
  formData: FormData,
): Promise<AbbonamentoFormState> {
  const id = String(formData.get("id") ?? "");
  const { clienteId, nome, dataInizio, scadenza, stato, nota } =
    readAbbonamentoFields(formData);

  if (!id) {
    return { error: "Non è stato possibile salvare l'abbonamento." };
  }
  if (!nome) {
    return { error: "Inserisci il nome dell'abbonamento." };
  }
  if (!scadenza) {
    return { error: "Inserisci la data di scadenza." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile salvare l'abbonamento." };
  }

  if (clienteId && !(await clientBelongsToBusiness(supabase, clienteId, businessId))) {
    return { error: "Il cliente selezionato non è valido." };
  }

  const { error } = await supabase
    .from("subscriptions")
    .update({
      client_id: clienteId,
      name: nome,
      start_date: dataInizio,
      expiry_date: scadenza,
      status: stato,
      note: nota,
    })
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[abbonamenti] update error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare l'abbonamento." };
  }

  revalidatePath("/abbonamenti");
  return { success: "Abbonamento aggiornato." };
}

export async function deleteAbbonamento(
  _prevState: AbbonamentoFormState,
  formData: FormData,
): Promise<AbbonamentoFormState> {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return { error: "Non è stato possibile eliminare l'abbonamento." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile eliminare l'abbonamento." };
  }

  const { error } = await supabase
    .from("subscriptions")
    .delete()
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[abbonamenti] delete error:", error.code, error.message);
    }
    return { error: "Non è stato possibile eliminare l'abbonamento." };
  }

  revalidatePath("/abbonamenti");
  return { success: "Abbonamento eliminato." };
}
