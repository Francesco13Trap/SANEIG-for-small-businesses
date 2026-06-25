-- Impresa Viva — idempotent IVA e incassi schema setup (DEV/TEST project).
--
-- Creates public.iva_settings and public.monthly_revenue_summaries so the
-- IVA e incassi page can read and write real, per-business data instead of
-- the placeholder sample numbers.
--
-- Safe to run on:
--   - a completely empty database,
--   - a database where these tables already exist,
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

-- IVA settings — one row per business: the IVA regime the owner uses as a
-- reference, and a free-text note to remember things to ask the
-- accountant. Both fields are simple preferences, not accounting records.
create table if not exists public.iva_settings (
  business_id uuid primary key references public.businesses (id) on delete cascade,
  regime text not null default 'non-lo-so' check (regime in ('ordinario', 'forfettario', 'non-lo-so')),
  accountant_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists iva_settings_set_updated_at on public.iva_settings;
create trigger iva_settings_set_updated_at
  before update on public.iva_settings
  for each row
  execute function public.set_updated_at();

-- Monthly revenue summaries — one row per business per calendar month, the
-- totals the owner notes down before talking to the accountant. "period"
-- is always the first day of the month it represents.
create table if not exists public.monthly_revenue_summaries (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  period date not null,
  incassi_segnati numeric(12, 2) not null default 0,
  spese_segnate numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, period)
);

drop trigger if exists monthly_revenue_summaries_set_updated_at on public.monthly_revenue_summaries;
create trigger monthly_revenue_summaries_set_updated_at
  before update on public.monthly_revenue_summaries
  for each row
  execute function public.set_updated_at();

create index if not exists monthly_revenue_summaries_business_id_idx on public.monthly_revenue_summaries (business_id);

-- Row Level Security: any member of a business can read its IVA settings
-- and monthly summaries; only owner/staff can write (same shape as
-- clients/payments/subscriptions/reminders/deadlines/promotions/reviews).
alter table public.iva_settings enable row level security;
alter table public.monthly_revenue_summaries enable row level security;

drop policy if exists "iva_settings_select_member" on public.iva_settings;
create policy "iva_settings_select_member" on public.iva_settings
  for select using (public.is_business_member(business_id));

drop policy if exists "iva_settings_write_owner_staff" on public.iva_settings;
create policy "iva_settings_write_owner_staff" on public.iva_settings
  for all using (public.business_role(business_id) in ('owner', 'staff'));

drop policy if exists "monthly_revenue_summaries_select_member" on public.monthly_revenue_summaries;
create policy "monthly_revenue_summaries_select_member" on public.monthly_revenue_summaries
  for select using (public.is_business_member(business_id));

drop policy if exists "monthly_revenue_summaries_write_owner_staff" on public.monthly_revenue_summaries;
create policy "monthly_revenue_summaries_write_owner_staff" on public.monthly_revenue_summaries
  for all using (public.business_role(business_id) in ('owner', 'staff'));
