-- Impresa Viva — idempotent Abbonamenti/Scadenze setup (DEV/TEST project).
--
-- Brings public.subscriptions to the shape the Abbonamenti page needs
-- (linked to clients, with expiry_date/note/updated_at) regardless of
-- whether the table already exists from the original draft migration
-- (which only had start_date/end_date, no note/updated_at), and
-- regardless of whether that draft was ever run at all.
--
-- Safe to run on:
--   - a completely empty database,
--   - a database where public.subscriptions already exists (with or
--     without expiry_date/note/updated_at) from the original draft,
--   - a database where everything below already exists.
-- Every statement only creates what's missing, or replaces a function/
-- trigger/policy definition with itself — nothing is ever dropped, deleted,
-- or truncated. The legacy end_date column from the draft migration is
-- left in place, unused.

create extension if not exists "pgcrypto";

-- Re-declare the shared helpers in case this script runs on a database
-- where the Clienti/Pagamenti setup hasn't been applied yet.

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

-- Subscriptions — the table the Abbonamenti page reads and writes. Status
-- values used by the app: 'active', 'expiring', 'expired', 'cancelled'.
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  client_id uuid references public.clients (id) on delete set null,
  name text not null,
  start_date date,
  expiry_date date not null default current_date,
  status text not null default 'active',
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- In case subscriptions already existed (from the original draft
-- migration) without these columns.
alter table public.subscriptions
  add column if not exists expiry_date date not null default current_date;
alter table public.subscriptions
  add column if not exists note text;
alter table public.subscriptions
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row
  execute function public.set_updated_at();

create index if not exists subscriptions_business_id_idx on public.subscriptions (business_id);
create index if not exists subscriptions_client_id_idx on public.subscriptions (client_id);

-- Row Level Security: any member of a business can read its subscriptions;
-- only owner/staff can write (same shape as clients/payments).
alter table public.subscriptions enable row level security;

drop policy if exists "subscriptions_select_member" on public.subscriptions;
create policy "subscriptions_select_member" on public.subscriptions
  for select using (public.is_business_member(business_id));

drop policy if exists "subscriptions_write_owner_staff" on public.subscriptions;
create policy "subscriptions_write_owner_staff" on public.subscriptions
  for all using (public.business_role(business_id) in ('owner', 'staff'));
