-- Impresa Viva — idempotent Fornitori setup (DEV/TEST project).
--
-- Creates public.suppliers, the table the Fornitori page reads and
-- writes: a simple supplier/contact tracker. This does not connect to
-- Magazzino, does not create purchase orders, and does not create
-- invoices.
--
-- Safe to run on:
--   - a completely empty database,
--   - a database where public.suppliers already exists in this shape,
--   - a database where everything below already exists.
-- Every statement only creates what's missing, or replaces a function/
-- trigger/policy definition with itself — nothing is ever dropped, deleted,
-- or truncated.

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

-- Suppliers — the table the Fornitori page reads and writes.
create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  name text not null,
  contact_name text,
  phone text,
  email text,
  category text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- In case public.suppliers already existed in a partial shape.
alter table public.suppliers
  add column if not exists contact_name text;
alter table public.suppliers
  add column if not exists phone text;
alter table public.suppliers
  add column if not exists email text;
alter table public.suppliers
  add column if not exists category text;
alter table public.suppliers
  add column if not exists note text;
alter table public.suppliers
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists suppliers_set_updated_at on public.suppliers;
create trigger suppliers_set_updated_at
  before update on public.suppliers
  for each row
  execute function public.set_updated_at();

create index if not exists suppliers_business_id_idx on public.suppliers (business_id);

-- Row Level Security: any member of a business can read its suppliers;
-- only owner/staff can write (same shape as clients/payments/subscriptions).
alter table public.suppliers enable row level security;

drop policy if exists "suppliers_select_member" on public.suppliers;
create policy "suppliers_select_member" on public.suppliers
  for select using (public.is_business_member(business_id));

drop policy if exists "suppliers_write_owner_staff" on public.suppliers;
create policy "suppliers_write_owner_staff" on public.suppliers
  for all using (public.business_role(business_id) in ('owner', 'staff'));
