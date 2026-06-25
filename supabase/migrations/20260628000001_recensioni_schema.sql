-- Impresa Viva — idempotent Recensioni schema setup (DEV/TEST project).
--
-- Creates public.reviews so the Recensioni page can read and write real,
-- per-business reviews instead of the placeholder sample cards.
--
-- Safe to run on:
--   - a completely empty database,
--   - a database where public.reviews already exists,
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

-- Reviews — the table the Recensioni page reads and writes. The client is
-- kept as free text rather than linked to public.clients, since a review
-- can come from anyone (e.g. a Google review) and not just a saved
-- client. "responded" is a simple flag: the owner marks a review as
-- answered once they've thanked or replied to the customer.
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  client_name text not null,
  rating integer not null default 5,
  comment text not null,
  review_date date,
  responded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at
  before update on public.reviews
  for each row
  execute function public.set_updated_at();

create index if not exists reviews_business_id_idx on public.reviews (business_id);

-- Row Level Security: any member of a business can read its reviews;
-- only owner/staff can write (same shape as clients/payments/
-- subscriptions/reminders/deadlines/promotions).
alter table public.reviews enable row level security;

drop policy if exists "reviews_select_member" on public.reviews;
create policy "reviews_select_member" on public.reviews
  for select using (public.is_business_member(business_id));

drop policy if exists "reviews_write_owner_staff" on public.reviews;
create policy "reviews_write_owner_staff" on public.reviews
  for all using (public.business_role(business_id) in ('owner', 'staff'));
