import type { SupabaseClient } from "@supabase/supabase-js";

// Every real-data section needs to know which business the logged-in user
// is currently acting for. For now a user belongs to a single business, so
// the first membership row is the active one.
export async function getActiveBusinessId(
  supabase: SupabaseClient,
): Promise<string | null> {
  const { data } = await supabase
    .from("business_members")
    .select("business_id")
    .limit(1)
    .maybeSingle();

  return data?.business_id ?? null;
}

// Extra app-level guard on top of RLS: confirms a client id actually
// belongs to the given business before it gets linked to a payment,
// subscription or quote.
export async function clientBelongsToBusiness(
  supabase: SupabaseClient,
  clientId: string,
  businessId: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("clients")
    .select("id")
    .eq("id", clientId)
    .eq("business_id", businessId)
    .maybeSingle();

  return Boolean(data);
}
