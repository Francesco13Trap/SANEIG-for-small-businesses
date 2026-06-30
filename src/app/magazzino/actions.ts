"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getActiveBusinessId } from "@/lib/supabase/business";

export type ProdottoFormState = { error?: string; success?: string } | undefined;

function readProdottoFields(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const quantitaRaw = String(formData.get("quantita") ?? "").trim();
  const scortaMinimaRaw = String(formData.get("scortaMinima") ?? "").trim();
  const unita = String(formData.get("unita") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "").trim();
  const fornitoreIdRaw = String(formData.get("fornitoreId") ?? "").trim();
  const nota = String(formData.get("nota") ?? "").trim();

  return {
    nome,
    quantita: quantitaRaw === "" ? NaN : Number(quantitaRaw),
    scortaMinima: scortaMinimaRaw === "" ? null : Number(scortaMinimaRaw),
    unita: unita || null,
    categoria: categoria || null,
    fornitoreId: fornitoreIdRaw && fornitoreIdRaw !== "none" ? fornitoreIdRaw : null,
    nota: nota || null,
  };
}

export async function addProdotto(
  _prevState: ProdottoFormState,
  formData: FormData,
): Promise<ProdottoFormState> {
  const { nome, quantita, scortaMinima, unita, categoria, fornitoreId, nota } =
    readProdottoFields(formData);

  if (!nome) {
    return { error: "Inserisci il nome del prodotto." };
  }
  if (!Number.isFinite(quantita) || quantita < 0) {
    return { error: "Inserisci una quantità valida." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile salvare il prodotto." };
  }

  const { error } = await supabase.from("inventory_items").insert({
    business_id: businessId,
    supplier_id: fornitoreId,
    name: nome,
    quantity: quantita,
    minimum_quantity: scortaMinima,
    unit: unita,
    category: categoria,
    note: nota,
  });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[magazzino] insert error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare il prodotto." };
  }

  revalidatePath("/magazzino");
  return { success: "Prodotto aggiunto." };
}

export async function updateProdotto(
  _prevState: ProdottoFormState,
  formData: FormData,
): Promise<ProdottoFormState> {
  const id = String(formData.get("id") ?? "");
  const { nome, quantita, scortaMinima, unita, categoria, fornitoreId, nota } =
    readProdottoFields(formData);

  if (!id) {
    return { error: "Non è stato possibile salvare il prodotto." };
  }
  if (!nome) {
    return { error: "Inserisci il nome del prodotto." };
  }
  if (!Number.isFinite(quantita) || quantita < 0) {
    return { error: "Inserisci una quantità valida." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile salvare il prodotto." };
  }

  const { error } = await supabase
    .from("inventory_items")
    .update({
      supplier_id: fornitoreId,
      name: nome,
      quantity: quantita,
      minimum_quantity: scortaMinima,
      unit: unita,
      category: categoria,
      note: nota,
    })
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[magazzino] update error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare il prodotto." };
  }

  revalidatePath("/magazzino");
  return { success: "Prodotto aggiornato." };
}

export async function deleteProdotto(
  _prevState: ProdottoFormState,
  formData: FormData,
): Promise<ProdottoFormState> {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return { error: "Non è stato possibile eliminare il prodotto." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile eliminare il prodotto." };
  }

  const { error } = await supabase
    .from("inventory_items")
    .delete()
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[magazzino] delete error:", error.code, error.message);
    }
    return { error: "Non è stato possibile eliminare il prodotto." };
  }

  revalidatePath("/magazzino");
  return { success: "Prodotto eliminato." };
}
