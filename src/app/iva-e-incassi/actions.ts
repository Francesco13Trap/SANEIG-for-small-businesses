"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getActiveBusinessId } from "@/lib/supabase/business";
import { parseRegimeIva } from "@/lib/iva/types";

export type IvaFormState = { error?: string; success?: string } | undefined;

function startOfCurrentMonth(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
}

function readImporto(value: FormDataEntryValue | null): number {
  const parsed = Number(String(value ?? "0").replace(",", "."));
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.round(parsed * 100) / 100);
}

export async function updateRegimeIva(
  _prevState: IvaFormState,
  formData: FormData,
): Promise<IvaFormState> {
  const regime = parseRegimeIva(String(formData.get("regime") ?? "non-lo-so"));

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile salvare il regime." };
  }

  const { error } = await supabase
    .from("iva_settings")
    .upsert({ business_id: businessId, regime }, { onConflict: "business_id" });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[iva] regime update error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare il regime." };
  }

  revalidatePath("/iva-e-incassi");
  return { success: "Regime salvato." };
}

export async function updateNotaCommercialista(
  _prevState: IvaFormState,
  formData: FormData,
): Promise<IvaFormState> {
  const nota = String(formData.get("nota") ?? "").trim();

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile salvare la nota." };
  }

  const { error } = await supabase
    .from("iva_settings")
    .upsert({ business_id: businessId, accountant_note: nota }, { onConflict: "business_id" });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[iva] note update error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare la nota." };
  }

  revalidatePath("/iva-e-incassi");
  return { success: "Nota salvata." };
}

export async function updateRiepilogoMese(
  _prevState: IvaFormState,
  formData: FormData,
): Promise<IvaFormState> {
  const incassiSegnati = readImporto(formData.get("incassi"));
  const speseSegnate = readImporto(formData.get("spese"));

  const supabase = await createClient();
  const businessId = await getActiveBusinessId(supabase);

  if (!businessId) {
    return { error: "Non è stato possibile salvare il riepilogo." };
  }

  const { error } = await supabase.from("monthly_revenue_summaries").upsert(
    {
      business_id: businessId,
      period: startOfCurrentMonth(),
      incassi_segnati: incassiSegnati,
      spese_segnate: speseSegnate,
    },
    { onConflict: "business_id,period" },
  );

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[iva] monthly summary update error:", error.code, error.message);
    }
    return { error: "Non è stato possibile salvare il riepilogo." };
  }

  revalidatePath("/iva-e-incassi");
  return { success: "Riepilogo aggiornato." };
}
