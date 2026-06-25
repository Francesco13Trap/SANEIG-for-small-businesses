-- Impresa Viva — idempotent Promemoria (reminders) schema setup (DEV/TEST project).
--
-- Brings public.reminders into existence so the Promemoria page and the
-- Oggi page's "Promemoria importanti" card can read and write real,
-- per-business data instead of the placeholder sample list.
--
-- Safe to run on:
--   - a completely empty database,
--   - a database where public.reminders already exists,
--   - a database where everything below already exists.
-- Every statement only creates what's missing, or replaces a
-- function/trigger/policy definition with itself — nothing is ever
-- dropped, deleted, or truncated.

create extension if not exists "pgcrypto";

-- Re-declare the shared helpers in case this script runs on a database
-- where the Clienti/Pagamenti/Abbonamenti setup hasn't been applied yet.

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

-- Reminders — the table the Promemoria page (and the Oggi page's
-- "Promemoria importanti" card) read and write.
create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  title text not null,
  detail text,
  due_date date,
  important boolean not null default false,
  done boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists reminders_set_updated_at on public.reminders;
create trigger reminders_set_updated_at
  before update on public.reminders
  for each row
  execute function public.set_updated_at();

create index if not exists reminders_business_id_idx on public.reminders (business_id);

-- Row Level Security: any member of a business can read its reminders;
-- only owner/staff can write (same shape as clients/payments/subscriptions).
alter table public.reminders enable row level security;

drop policy if exists "reminders_select_member" on public.reminders;
create policy "reminders_select_member" on public.reminders
  for select using (public.is_business_member(business_id));

drop policy if exists "reminders_write_owner_staff" on public.reminders;
create policy "reminders_write_owner_staff" on public.reminders
  for all using (public.business_role(business_id) in ('owner', 'staff'));
