-- Impresa Viva — "Richiedi una demo" public interest requests (DEV/TEST project).
--
-- Stores requests submitted from the public /richiedi-demo page. Visitors
-- there are never logged in, so only the anon role can insert. There is no
-- select policy at all, so nobody — not even authenticated app users — can
-- read these rows through the API; staff read them from the Supabase
-- dashboard (which uses the project's service role, bypassing RLS).
--
-- Safe to run on a database where this table already exists or not: every
-- statement only creates what's missing or replaces a policy with itself.
-- Nothing is ever dropped, deleted, or truncated.

create extension if not exists "pgcrypto";

create table if not exists public.demo_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  business_name text,
  phone text,
  email text not null,
  message text,
  created_at timestamptz not null default now()
);

alter table public.demo_requests
  add column if not exists business_name text;
alter table public.demo_requests
  add column if not exists phone text;
alter table public.demo_requests
  add column if not exists message text;

alter table public.demo_requests enable row level security;

drop policy if exists "demo_requests_insert_anon" on public.demo_requests;
create policy "demo_requests_insert_anon" on public.demo_requests
  for insert
  to anon
  with check (true);
