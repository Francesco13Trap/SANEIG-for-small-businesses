import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

// Exchanges a Supabase recovery link for a session on the server, before the
// browser ever reaches /nuova-password. This works regardless of which
// device/browser opens the email link, because the exchange happens here
// (with the verifier cookie sent on this request) and the resulting session
// is handed to the browser via Set-Cookie on the redirect below — the
// client-side recovery check on /nuova-password then just finds an existing
// session instead of racing to process the link itself.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/nuova-password";

  const redirectTo = new URL(next, request.url);
  const supabase = await createClient();

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      return NextResponse.redirect(redirectTo);
    }
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(redirectTo);
    }
  }

  redirectTo.searchParams.set("error", "link_invalid");
  return NextResponse.redirect(redirectTo);
}
