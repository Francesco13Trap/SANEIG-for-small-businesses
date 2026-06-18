export type SupabaseEnv = { url: string; anonKey: string };

// Centralized check so every Supabase client (browser, server, proxy) fails
// the same way instead of crashing on a missing env var.
export function getSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}
