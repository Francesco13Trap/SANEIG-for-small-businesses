# Supabase migrations — Impresa Viva

Migrations live in `supabase/migrations/`, applied in filename order:

1. `20260618000001_initial_schema.sql` — tables (profiles, roles, businesses,
   business_members, clients, payments, deadlines, subscriptions, reminders).
2. `20260618000002_rls_policies.sql` — Row Level Security for every table.
3. `20260619000001_clients_contact_fields.sql` — idempotent setup for
   Clienti: creates profiles, roles, businesses, business_members, and
   clients (with `email`/`updated_at`) if they don't exist yet, plus RLS for
   all of them. Safe to run even if some or all of this already exists —
   it only creates what's missing, never drops or deletes anything.

The first two were validated against a local Postgres instance (schema
applies cleanly; a two-tenant smoke test confirmed read/write isolation and
the Commercialista read-only role) before being committed.

**If you only need Clienti working on a real project**, running migration 3
alone is enough — it includes everything it depends on. Migrations 1 and 2
remain here for when payments/deadlines/subscriptions/reminders get
connected to real data later.

## Applying them to a real project

### Option A — SQL Editor (recommended for now, no secrets needed)

1. Open the Supabase dashboard for `impresa-viva-dev` → **SQL Editor**.
2. Paste the contents of `20260618000001_initial_schema.sql`, run it.
3. Paste the contents of `20260618000002_rls_policies.sql`, run it.
4. Paste the contents of `20260619000001_clients_contact_fields.sql`, run it.

This only needs dashboard access — no API keys or database password.

If you hit `relation "public.clients" does not exist` (or any other table
in this script), it means the earlier migrations were never actually run
against this project — paste and run migration 3 by itself; it creates
everything Clienti needs from scratch and is safe to run regardless of
what already exists.

### Option B — Supabase CLI (later, needs the DB password)

```bash
npm run supabase:link    # supabase link --project-ref <ref>
npm run supabase:push    # supabase db push
```

`supabase link` will prompt for the database password (Project Settings →
Database). Use this path once the project is linked for ongoing migration
work; not required for the first deploy.

## Checking the app can see the project

```bash
npm run check:supabase
```

Reads `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` from
`.env.local`, confirms the project is reachable, and confirms the anon key
is correctly blocked from reading tenant data (RLS working as intended).
Never prints the key itself.
