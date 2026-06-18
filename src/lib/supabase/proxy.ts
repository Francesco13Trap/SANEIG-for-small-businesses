import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getSupabaseEnv } from "@/lib/supabase/env";

// Refreshes the Supabase auth cookie on every request so Server Components
// always see a valid session. getUser() (not getSession()) is used because
// it revalidates against the auth server instead of trusting the cookie.
//
// `configured: false` means the env vars are missing — the caller (proxy.ts)
// is responsible for showing a safe page instead of letting any Supabase
// client construction throw.
export async function updateSession(request: NextRequest) {
  const env = getSupabaseEnv();
  if (!env) {
    return {
      response: NextResponse.next({ request }),
      user: null,
      configured: false as const,
    };
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user, configured: true as const };
}
