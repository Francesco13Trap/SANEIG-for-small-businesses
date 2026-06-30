"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getActiveBusinessId } from "@/lib/supabase/business";

export type ClienteFormState = { error?: string; success?: string } | undefined;

function readClienteFields(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const nota = String(formData.get("nota") ?? "").trim();

  return {
    nome,
    telefono: telefono || null,
    email: email || null,
    nota: nota || null,
  };
}

export async function addCliente(
  _prevState: ClienteFormState,
  formData: FormData,
): Promise<ClienteFormState> {
  const { nome, telefono, email, nota } = readClienteFields(formData);

  if (!nome) {
    return { error: "Inserisci almeno il nome del cliente." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile salvare il cliente." };
  }

  const { error } = await supabase.from("clients").insert({
    business_id: businessId,
    name: nome,
    phone: telefono,
    email,
    note: nota,
  });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[clienti] insert error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare il cliente." };
  }

  revalidatePath("/clienti");
  return { success: "Cliente aggiunto." };
}

export async function updateCliente(
  _prevState: ClienteFormState,
  formData: FormData,
): Promise<ClienteFormState> {
  const id = String(formData.get("id") ?? "");
  const { nome, telefono, email, nota } = readClienteFields(formData);

  if (!id) {
    return { error: "Non è stato possibile salvare il cliente." };
  }

  if (!nome) {
    return { error: "Inserisci almeno il nome del cliente." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile salvare il cliente." };
  }

  const { error } = await supabase
    .from("clients")
    .update({ name: nome, phone: telefono, email, note: nota })
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[clienti] update error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare il cliente." };
  }

  revalidatePath("/clienti");
  return { success: "Cliente aggiornato." };
}

export async function deleteCliente(
  _prevState: ClienteFormState,
  formData: FormData,
): Promise<ClienteFormState> {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return { error: "Non è stato possibile eliminare il cliente." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile eliminare il cliente." };
  }

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[clienti] delete error:", error.code, error.message);
    }
    return { error: "Non è stato possibile eliminare il cliente." };
  }

  revalidatePath("/clienti");
  return { success: "Cliente eliminato." };
}
