import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseEnv } from "@/lib/supabase/env";

// Server Components can't write cookies, so setAll() may throw there.
// That's fine as long as the proxy refreshes the session.
export async function createClient() {
  const env = getSupabaseEnv();
  if (!env) {
    throw new Error("Supabase non è configurato: variabili d'ambiente mancanti.");
  }

  const cookieStore = await cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Ignored: called from a Server Component without write access.
        }
      },
    },
  });
}
