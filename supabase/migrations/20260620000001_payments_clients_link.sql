-- Impresa Viva — idempotent Pagamenti setup (DEV/TEST project).
--
-- Brings public.payments to the shape the Pagamenti page needs (linked to
-- clients, with updated_at) regardless of whether the table already exists
-- from the original draft migration, and regardless of whether that draft
-- was ever run at all.
--
-- Safe to run on:
--   - a completely empty database,
--   - a database where public.payments already exists (with or without
--     updated_at) from the original draft,
--   - a database where everything below already exists.
-- Every statement only creates what's missing, or replaces a function/
-- trigger/policy definition with itself — nothing is ever dropped, deleted,
-- or truncated.

create extension if not exists "pgcrypto";

-- Re-declare the shared helpers in case this script runs on a database
-- where the Clienti setup hasn't been applied yet.

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

-- Payments — the table the Pagamenti page reads and writes. Status values
-- used by the app: 'to_check', 'to_remind', 'paid'.
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  client_id uuid references public.clients (id) on delete set null,
  amount numeric(10, 2) not null,
  due_date date,
  status text not null default 'to_check',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- In case payments already existed (from the original draft migration)
-- without updated_at.
alter table public.payments
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at
  before update on public.payments
  for each row
  execute function public.set_updated_at();

create index if not exists payments_business_id_idx on public.payments (business_id);
create index if not exists payments_client_id_idx on public.payments (client_id);

-- Row Level Security: any member of a business can read its payments;
-- only owner/staff can write (same shape as clients).
alter table public.payments enable row level security;

drop policy if exists "payments_select_member" on public.payments;
create policy "payments_select_member" on public.payments
  for select using (public.is_business_member(business_id));

drop policy if exists "payments_write_owner_staff" on public.payments;
create policy "payments_write_owner_staff" on public.payments
  for all using (public.business_role(business_id) in ('owner', 'staff'));
