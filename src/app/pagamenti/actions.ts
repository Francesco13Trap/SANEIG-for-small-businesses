"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { clientBelongsToBusiness, getActiveBusinessId } from "@/lib/supabase/business";
import { parseStatoPagamento } from "@/lib/pagamenti/types";

export type PagamentoFormState = { error?: string; success?: string } | undefined;

function readPagamentoFields(formData: FormData) {
  const clienteId = String(formData.get("clienteId") ?? "").trim();
  const importoRaw = String(formData.get("importo") ?? "").trim();
  const scadenza = String(formData.get("scadenza") ?? "").trim();
  const stato = parseStatoPagamento(String(formData.get("stato") ?? "to_check"));
  const importo = Number(importoRaw.replace(",", "."));

  return {
    clienteId: clienteId || null,
    importo,
    scadenza: scadenza || null,
    stato,
  };
}

export async function addPagamento(
  _prevState: PagamentoFormState,
  formData: FormData,
): Promise<PagamentoFormState> {
  const { clienteId, importo, scadenza, stato } = readPagamentoFields(formData);

  if (!Number.isFinite(importo) || importo <= 0) {
    return { error: "Inserisci un importo valido." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile salvare il pagamento." };
  }

  if (clienteId && !(await clientBelongsToBusiness(supabase, clienteId, businessId))) {
    return { error: "Il cliente selezionato non è valido." };
  }

  const { error } = await supabase.from("payments").insert({
    business_id: businessId,
    client_id: clienteId,
    amount: importo,
    due_date: scadenza,
    status: stato,
  });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[pagamenti] insert error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare il pagamento." };
  }

  revalidatePath("/pagamenti");
  return { success: "Pagamento aggiunto." };
}

export async function updatePagamento(
  _prevState: PagamentoFormState,
  formData: FormData,
): Promise<PagamentoFormState> {
  const id = String(formData.get("id") ?? "");
  const { clienteId, importo, scadenza, stato } = readPagamentoFields(formData);

  if (!id) {
    return { error: "Non è stato possibile salvare il pagamento." };
  }

  if (!Number.isFinite(importo) || importo <= 0) {
    return { error: "Inserisci un importo valido." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile salvare il pagamento." };
  }

  if (clienteId && !(await clientBelongsToBusiness(supabase, clienteId, businessId))) {
    return { error: "Il cliente selezionato non è valido." };
  }

  const { error } = await supabase
    .from("payments")
    .update({
      client_id: clienteId,
      amount: importo,
      due_date: scadenza,
      status: stato,
    })
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[pagamenti] update error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare il pagamento." };
  }

  revalidatePath("/pagamenti");
  return { success: "Pagamento aggiornato." };
}

export async function deletePagamento(
  _prevState: PagamentoFormState,
  formData: FormData,
): Promise<PagamentoFormState> {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return { error: "Non è stato possibile eliminare il pagamento." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile eliminare il pagamento." };
  }

  const { error } = await supabase
    .from("payments")
    .delete()
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[pagamenti] delete error:", error.code, error.message);
    }
    return { error: "Non è stato possibile eliminare il pagamento." };
  }

  revalidatePath("/pagamenti");
  return { success: "Pagamento eliminato." };
}
