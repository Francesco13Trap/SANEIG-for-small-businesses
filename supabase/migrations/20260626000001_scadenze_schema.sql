-- Impresa Viva — idempotent Scadenze attività (deadlines) schema setup (DEV/TEST project).
--
-- Brings public.deadlines fully in line with the other real-data tables
-- (adds the `updated_at` column + trigger that clients/payments/
-- subscriptions/reminders already have) so the Scadenze attività page can
-- read and write real, per-business data instead of the placeholder
-- sample list.
--
-- Safe to run on:
--   - a completely empty database,
--   - a database where public.deadlines already exists (it does, since
--     the very first migration created it),
--   - a database where everything below already exists.
-- Every statement only creates what's missing, or replaces a
-- function/trigger/policy definition with itself — nothing is ever
-- dropped, deleted, or truncated.

create extension if not exists "pgcrypto";

-- Re-declare the shared helpers in case this script runs on a database
-- where the Clienti/Pagamenti/Abbonamenti/Promemoria setup hasn't been
-- applied yet.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_business_member(target_business_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.business_members
    where business_id = target_business_id
      and profile_id = auth.uid()
  );
$$;

create or replace function public.business_role(target_business_id uuid)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role_id from public.business_members
  where business_id = target_business_id
    and profile_id = auth.uid()
  limit 1;
$$;

revoke execute on function public.is_business_member(uuid) from public;
revoke execute on function public.business_role(uuid) from public;
grant execute on function public.is_business_member(uuid) to authenticated;
grant execute on function public.business_role(uuid) to authenticated;

-- Deadlines — the table the Scadenze attività page reads and writes. The
-- very first migration in this project (20260618000001) already created
-- public.deadlines, but without an `updated_at` column, so that column
-- (and its trigger) is added separately here, same as for every other
-- real-data table.
create table if not exists public.deadlines (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  title text not null,
  category text,
  due_date date,
  status text not null default 'todo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.deadlines
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists deadlines_set_updated_at on public.deadlines;
create trigger deadlines_set_updated_at
  before update on public.deadlines
  for each row
  execute function public.set_updated_at();

create index if not exists deadlines_business_id_idx on public.deadlines (business_id);

-- Row Level Security: any member of a business can read its deadlines;
-- only owner/staff can write (same shape as clients/payments/
-- subscriptions/reminders). These policies already exist from the very
-- first migration, but are re-declared here so this script is self-
-- contained and safe to run on its own.
alter table public.deadlines enable row level security;

drop policy if exists "deadlines_select_member" on public.deadlines;
create policy "deadlines_select_member" on public.deadlines
  for select using (public.is_business_member(business_id));

drop policy if exists "deadlines_write_owner_staff" on public.deadlines;
create policy "deadlines_write_owner_staff" on public.deadlines
  for all using (public.business_role(business_id) in ('owner', 'staff'));
