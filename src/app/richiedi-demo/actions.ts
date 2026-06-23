"use server";

import { createClient } from "@/lib/supabase/server";

export type DemoRequestState = { error?: string; success?: string } | undefined;

export async function submitDemoRequest(
  _prevState: DemoRequestState,
  formData: FormData,
): Promise<DemoRequestState> {
  const name = String(formData.get("name") ?? "").trim();
  const businessName = String(formData.get("businessName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !businessName || !phone || !email) {
    return { error: "Non è stato possibile inviare la richiesta. Riprova." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("demo_requests").insert({
    name,
    business_name: businessName,
    phone,
    email,
    message: message || null,
  });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[richiedi-demo] insert error:", error.message);
    }
    return { error: "Non è stato possibile inviare la richiesta. Riprova." };
  }

  return { success: "Richiesta inviata. Ti ricontatteremo appena possibile." };
}
