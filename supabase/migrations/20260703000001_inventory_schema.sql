-- Impresa Viva — idempotent Magazzino setup (DEV/TEST project).
--
-- Creates public.inventory_items, the table the Magazzino page reads and
-- writes: a simple inventory tracker with an optional link to a supplier.
-- This does not create purchase orders, does not create invoices, and
-- does not implement any advanced warehouse logic.
--
-- Safe to run on:
--   - a completely empty database,
--   - a database where public.inventory_items already exists in this shape,
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

-- Inventory items — the table the Magazzino page reads and writes.
-- supplier_id is optional: items can exist with no supplier at all, and
-- deleting a supplier never deletes the items linked to it (it just clears
-- the link).
create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  supplier_id uuid references public.suppliers (id) on delete set null,
  name text not null,
  quantity numeric not null default 0,
  minimum_quantity numeric,
  unit text,
  category text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- In case public.inventory_items already existed in a partial shape.
alter table public.inventory_items
  add column if not exists supplier_id uuid references public.suppliers (id) on delete set null;
alter table public.inventory_items
  add column if not exists minimum_quantity numeric;
alter table public.inventory_items
  add column if not exists unit text;
alter table public.inventory_items
  add column if not exists category text;
alter table public.inventory_items
  add column if not exists note text;
alter table public.inventory_items
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists inventory_items_set_updated_at on public.inventory_items;
create trigger inventory_items_set_updated_at
  before update on public.inventory_items
  for each row
  execute function public.set_updated_at();

create index if not exists inventory_items_business_id_idx on public.inventory_items (business_id);
create index if not exists inventory_items_supplier_id_idx on public.inventory_items (supplier_id);

-- Row Level Security: any member of a business can read its inventory;
-- only owner/staff can write (same shape as clients/payments/suppliers).
alter table public.inventory_items enable row level security;

drop policy if exists "inventory_items_select_member" on public.inventory_items;
create policy "inventory_items_select_member" on public.inventory_items
  for select using (public.is_business_member(business_id));

drop policy if exists "inventory_items_write_owner_staff" on public.inventory_items;
create policy "inventory_items_write_owner_staff" on public.inventory_items
  for all using (public.business_role(business_id) in ('owner', 'staff'));
