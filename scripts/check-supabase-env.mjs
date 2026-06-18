// Checks that the app can read its Supabase DEV config and reach the
// project, without ever printing a key value. Run with: npm run check:supabase

import { existsSync, readFileSync } from "node:fs";

function loadEnvLocal() {
  const path = ".env.local";
  if (!existsSync(path)) return {};

  const vars = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    vars[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return vars;
}

const fileVars = loadEnvLocal();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || fileVars.NEXT_PUBLIC_SUPABASE_URL;
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || fileVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("NEXT_PUBLIC_SUPABASE_URL:", url ? "present" : "MISSING");
console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", anonKey ? "present" : "MISSING");

if (!url || !anonKey) {
  console.log("\nMissing required values. Fill them in .env.local, then run this again.");
  process.exit(1);
}

const healthCheck = await fetch(new URL("/auth/v1/health", url)).catch((err) => err);
if (!(healthCheck instanceof Response) || !healthCheck.ok) {
  console.log("\nCould not reach the project URL. Check NEXT_PUBLIC_SUPABASE_URL.");
  process.exit(1);
}
console.log("Project URL is reachable.");

const restCheck = await fetch(new URL("/rest/v1/roles?select=id&limit=1", url), {
  headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
}).catch((err) => err);

if (!(restCheck instanceof Response)) {
  console.log("\nCould not reach the REST API.");
  process.exit(1);
}

if (restCheck.status === 401) {
  console.log("\nProject rejected the anon key (401). Check NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  process.exit(1);
}

if (restCheck.status === 404) {
  console.log(
    "\nProject reachable, but the 'roles' table was not found (404).\n" +
      "Migrations have not been applied to this project yet.",
  );
  process.exit(1);
}

if (!restCheck.ok) {
  console.log(`\nUnexpected response from REST API: ${restCheck.status}`);
  process.exit(1);
}

const rows = await restCheck.json();
console.log(
  rows.length === 0
    ? "Schema is deployed and RLS correctly blocks anon access to 'roles' (expected)."
    : "Warning: anon key can read 'roles' rows — RLS may be misconfigured.",
);
console.log("\nSupabase DEV connection looks healthy.");
