-- Impresa Viva — idempotent Commercialista schema setup (DEV/TEST project).
--
-- Creates public.missing_documents and adds a "notes" column to the
-- existing public.monthly_revenue_summaries table, so the Commercialista
-- page can read and write real, per-business data instead of the
-- placeholder sample list/notes.
--
-- Safe to run on:
--   - a completely empty database,
--   - a database where these objects already exist,
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

-- "Note del mese" lives alongside the monthly incassi/spese figures, in the
-- same per-business-per-month table created for IVA e incassi.
alter table public.monthly_revenue_summaries
  add column if not exists notes text not null default '';

-- Missing documents — a simple per-business checklist of documents the
-- owner still needs to find before talking to the accountant.
create table if not exists public.missing_documents (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists missing_documents_set_updated_at on public.missing_documents;
create trigger missing_documents_set_updated_at
  before update on public.missing_documents
  for each row
  execute function public.set_updated_at();

create index if not exists missing_documents_business_id_idx on public.missing_documents (business_id);

-- Row Level Security: any member of a business can read its missing
-- documents; only owner/staff can write (same shape as
-- clients/payments/subscriptions/reminders/deadlines/promotions/reviews).
alter table public.missing_documents enable row level security;

drop policy if exists "missing_documents_select_member" on public.missing_documents;
create policy "missing_documents_select_member" on public.missing_documents
  for select using (public.is_business_member(business_id));

drop policy if exists "missing_documents_write_owner_staff" on public.missing_documents;
create policy "missing_documents_write_owner_staff" on public.missing_documents
  for all using (public.business_role(business_id) in ('owner', 'staff'));
