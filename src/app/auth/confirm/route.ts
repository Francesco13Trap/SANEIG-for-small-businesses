import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

// Exchanges the token from a Supabase password-recovery email link for a
// session. Cookies can only be written here (a Route Handler) or in a
// Server Action, not while rendering a page — so this step can't move into
// the /nuova-password page itself.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  const supabase = await createClient();

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  } else if (tokenHash && type === "recovery") {
    await supabase.auth.verifyOtp({ type: "recovery", token_hash: tokenHash });
  }

  return NextResponse.redirect(new URL("/nuova-password", origin));
}
