export type SupabaseEnv = { url: string; anonKey: string };

// Temporary public fallback for deployment stability: some Vercel
// deployments have failed to pass through NEXT_PUBLIC_SUPABASE_URL /
// NEXT_PUBLIC_SUPABASE_ANON_KEY, which are public frontend values (not
// service_role secrets). Remove this fallback once project-level Vercel
// env vars are confirmed reliable across deployments.
const FALLBACK_SUPABASE_URL = "https://rkhjkzqwaglreidmhfkb.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "sb_publishable_fLp9PzKRzyuQzMMm7Ddf_g_z-M3nlFF";

// Centralized check so every Supabase client (browser, server, proxy) fails
// the same way instead of crashing on a missing env var.
export function getSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}
