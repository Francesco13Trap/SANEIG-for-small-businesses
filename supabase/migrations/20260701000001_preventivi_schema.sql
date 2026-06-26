-- Impresa Viva — idempotent Preventivi setup (DEV/TEST project).
--
-- Creates public.quotes, the table the Preventivi page reads and writes:
-- a simple quote/proposal tracker linked to clients. This does not
-- generate invoices, does not handle real billing (fatturazione
-- elettronica), and does not process payments.
--
-- Safe to run on:
--   - a completely empty database,
--   - a database where public.quotes already exists in this shape,
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

-- Quotes — the table the Preventivi page reads and writes. Status values
-- used by the app: 'draft', 'sent', 'accepted', 'rejected'.
create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  client_id uuid references public.clients (id) on delete set null,
  title text not null,
  description text,
  amount numeric(10, 2) not null default 0,
  status text not null default 'draft',
  valid_until date,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- In case public.quotes already existed in a partial shape.
alter table public.quotes
  add column if not exists description text;
alter table public.quotes
  add column if not exists valid_until date;
alter table public.quotes
  add column if not exists note text;
alter table public.quotes
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists quotes_set_updated_at on public.quotes;
create trigger quotes_set_updated_at
  before update on public.quotes
  for each row
  execute function public.set_updated_at();

create index if not exists quotes_business_id_idx on public.quotes (business_id);
create index if not exists quotes_client_id_idx on public.quotes (client_id);

-- Row Level Security: any member of a business can read its quotes; only
-- owner/staff can write (same shape as clients/payments/subscriptions).
alter table public.quotes enable row level security;

drop policy if exists "quotes_select_member" on public.quotes;
create policy "quotes_select_member" on public.quotes
  for select using (public.is_business_member(business_id));

drop policy if exists "quotes_write_owner_staff" on public.quotes;
create policy "quotes_write_owner_staff" on public.quotes
  for all using (public.business_role(business_id) in ('owner', 'staff'));
