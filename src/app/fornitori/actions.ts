"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getActiveBusinessId } from "@/lib/supabase/business";

export type FornitoreFormState = { error?: string; success?: string } | undefined;

function readFornitoreFields(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const referente = String(formData.get("referente") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "").trim();
  const nota = String(formData.get("nota") ?? "").trim();

  return {
    nome,
    referente: referente || null,
    telefono: telefono || null,
    email: email || null,
    categoria: categoria || null,
    nota: nota || null,
  };
}

export async function addFornitore(
  _prevState: FornitoreFormState,
  formData: FormData,
): Promise<FornitoreFormState> {
  const { nome, referente, telefono, email, categoria, nota } =
    readFornitoreFields(formData);

  if (!nome) {
    return { error: "Inserisci almeno il nome del fornitore." };
  }

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile salvare il fornitore." };
  }

  const { error } = await supabase.from("suppliers").insert({
    business_id: businessId,
    name: nome,
    contact_name: referente,
    phone: telefono,
    email,
    category: categoria,
    note: nota,
  });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[fornitori] insert error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare il fornitore." };
  }

  revalidatePath("/fornitori");
  return { success: "Fornitore aggiunto." };
}

export async function updateFornitore(
  _prevState: FornitoreFormState,
  formData: FormData,
): Promise<FornitoreFormState> {
  const id = String(formData.get("id") ?? "");
  const { nome, referente, telefono, email, categoria, nota } =
    readFornitoreFields(formData);

  if (!id) {
    return { error: "Non è stato possibile salvare il fornitore." };
  }
  if (!nome) {
    return { error: "Inserisci almeno il nome del fornitore." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("suppliers")
    .update({
      name: nome,
      contact_name: referente,
      phone: telefono,
      email,
      category: categoria,
      note: nota,
    })
    .eq("id", id);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[fornitori] update error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare il fornitore." };
  }

  revalidatePath("/fornitori");
  return { success: "Fornitore aggiornato." };
}

export async function deleteFornitore(
  _prevState: FornitoreFormState,
  formData: FormData,
): Promise<FornitoreFormState> {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return { error: "Non è stato possibile eliminare il fornitore." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("suppliers").delete().eq("id", id);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[fornitori] delete error:", error.code, error.message);
    }
    return { error: "Non è stato possibile eliminare il fornitore." };
  }

  revalidatePath("/fornitori");
  return { success: "Fornitore eliminato." };
}
