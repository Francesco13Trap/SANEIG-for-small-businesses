import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

const PUBLIC_PATHS = [
  "/accedi",
  "/registrati",
  "/presentazione",
  "/richiedi-demo",
];
// /auth/confirm exchanges the recovery link for a session before the user
// has any cookie-based session at all, so it must stay reachable like the
// rest of the password-reset flow.
const PASSWORD_RESET_PATHS = [
  "/password-dimenticata",
  "/nuova-password",
  "/auth/confirm",
];
const CONFIG_MISSING_PATH = "/configurazione-mancante";

export async function proxy(request: NextRequest) {
  const { response, user, configured } = await updateSession(request);

  if (!configured) {
    if (request.nextUrl.pathname === CONFIG_MISSING_PATH) {
      return response;
    }
    return NextResponse.rewrite(new URL(CONFIG_MISSING_PATH, request.url));
  }

  const isPublicPath = PUBLIC_PATHS.includes(request.nextUrl.pathname);
  const isPasswordResetPath = PASSWORD_RESET_PATHS.includes(
    request.nextUrl.pathname,
  );

  if (!user && !isPublicPath && !isPasswordResetPath) {
    return NextResponse.redirect(new URL("/accedi", request.url));
  }

  if (user && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
