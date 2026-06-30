"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { clientBelongsToBusiness, getActiveBusinessId } from "@/lib/supabase/business";
import { parseStatoPreventivo } from "@/lib/preventivi/types";

export type PreventivoFormState = { error?: string; success?: string } | undefined;

function readPreventivoFields(formData: FormData) {
  const clienteId = String(formData.get("clienteId") ?? "").trim();
  const titolo = String(formData.get("titolo") ?? "").trim();
  const descrizione = String(formData.get("descrizione") ?? "").trim();
  const importoRaw = String(formData.get("importo") ?? "").trim();
  const importo = Number(importoRaw.replace(",", "."));
  const validoFino = String(formData.get("validoFino") ?? "").trim();
  const stato = parseStatoPreventivo(String(formData.get("stato") ?? "draft"));
  const nota = String(formData.get("nota") ?? "").trim();

  return {
    clienteId: clienteId || null,
    titolo,
    descrizione: descrizione || null,
    importo,
    validoFino: validoFino || null,
    stato,
    nota: nota || null,
  };
}

export async function addPreventivo(
  _prevState: PreventivoFormState,
  formData: FormData,
): Promise<PreventivoFormState> {
  const { clienteId, titolo, descrizione, importo, validoFino, stato, nota } =
    readPreventivoFields(formData);

  if (!clienteId) {
    return { error: "Scegli un cliente." };
  }
  if (!titolo) {
    return { error: "Inserisci il titolo del preventivo." };
  }
  if (!Number.isFinite(importo) || importo <= 0) {
    return { error: "Inserisci un importo valido." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile salvare il preventivo." };
  }

  if (!(await clientBelongsToBusiness(supabase, clienteId, businessId))) {
    return { error: "Il cliente selezionato non è valido." };
  }

  const { error } = await supabase.from("quotes").insert({
    business_id: businessId,
    client_id: clienteId,
    title: titolo,
    description: descrizione,
    amount: importo,
    valid_until: validoFino,
    status: stato,
    note: nota,
  });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[preventivi] insert error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare il preventivo." };
  }

  revalidatePath("/preventivi");
  return { success: "Preventivo aggiunto." };
}

export async function updatePreventivo(
  _prevState: PreventivoFormState,
  formData: FormData,
): Promise<PreventivoFormState> {
  const id = String(formData.get("id") ?? "");
  const { clienteId, titolo, descrizione, importo, validoFino, stato, nota } =
    readPreventivoFields(formData);

  if (!id) {
    return { error: "Non è stato possibile salvare il preventivo." };
  }
  if (!clienteId) {
    return { error: "Scegli un cliente." };
  }
  if (!titolo) {
    return { error: "Inserisci il titolo del preventivo." };
  }
  if (!Number.isFinite(importo) || importo <= 0) {
    return { error: "Inserisci un importo valido." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile salvare il preventivo." };
  }

  if (!(await clientBelongsToBusiness(supabase, clienteId, businessId))) {
    return { error: "Il cliente selezionato non è valido." };
  }

  const { error } = await supabase
    .from("quotes")
    .update({
      client_id: clienteId,
      title: titolo,
      description: descrizione,
      amount: importo,
      valid_until: validoFino,
      status: stato,
      note: nota,
    })
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[preventivi] update error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare il preventivo." };
  }

  revalidatePath("/preventivi");
  return { success: "Preventivo aggiornato." };
}

export async function deletePreventivo(
  _prevState: PreventivoFormState,
  formData: FormData,
): Promise<PreventivoFormState> {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return { error: "Non è stato possibile eliminare il preventivo." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile eliminare il preventivo." };
  }

  const { error } = await supabase
    .from("quotes")
    .delete()
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[preventivi] delete error:", error.code, error.message);
    }
    return { error: "Non è stato possibile eliminare il preventivo." };
  }

  revalidatePath("/preventivi");
  return { success: "Preventivo eliminato." };
}
