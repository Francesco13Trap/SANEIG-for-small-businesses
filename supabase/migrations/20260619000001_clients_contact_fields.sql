-- Impresa Viva — idempotent Clienti setup (DEV/TEST project).
--
-- This replaces the previous version of this file, which assumed
-- public.clients already existed and only added columns to it. That
-- assumption was wrong for the real Supabase project (the table — and
-- possibly its dependencies — was never created there), which caused:
--   ERROR: 42P01: relation "public.clients" does not exist
--
-- This script is safe to run on:
--   - a completely empty database,
--   - a database where some of this foundation already exists,
--   - a database where everything below already exists.
-- Every statement only creates what's missing, or replaces a function/
-- trigger/policy definition with itself — nothing is ever dropped, deleted,
-- or truncated.

create extension if not exists "pgcrypto";

-- 1. Profiles: one row per auth user (needed because business_members and
-- businesses both reference profiles).
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: anyone who signed up before this table/trigger existed still
-- needs a profile row, otherwise business_members can never reference them.
insert into public.profiles (id, full_name)
select u.id, u.raw_user_meta_data ->> 'full_name'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- 2. Roles: fixed lookup of membership roles.
create table if not exists public.roles (
  id text primary key,
  label text not null
);

insert into public.roles (id, label) values
  ('owner', 'Titolare'),
  ('staff', 'Collaboratore'),
  ('accountant', 'Commercialista')
on conflict (id) do nothing;

-- 3. Businesses: the tenant root.
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);

-- 4. Business members: who belongs to which business, with which role.
create table if not exists public.business_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  role_id text not null references public.roles (id),
  created_at timestamptz not null default now(),
  unique (business_id, profile_id)
);

create or replace function public.create_business(business_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_business_id uuid;
begin
  insert into public.businesses (name, created_by)
  values (business_name, auth.uid())
  returning id into new_business_id;

  insert into public.business_members (business_id, profile_id, role_id)
  values (new_business_id, auth.uid(), 'owner');

  return new_business_id;
end;
$$;

-- 5. Clients — the table the Clienti page reads and writes. Includes the
-- email/updated_at fields the page needs, so there's no separate
-- "add columns later" step.
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  name text not null,
  phone text,
  email text,
  last_contact_at date,
  status text not null default 'new',
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- In case clients already existed without these two columns.
alter table public.clients
  add column if not exists email text,
  add column if not exists updated_at timestamptz not null default now();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists clients_set_updated_at on public.clients;
create trigger clients_set_updated_at
  before update on public.clients
  for each row
  execute function public.set_updated_at();

create index if not exists clients_business_id_idx on public.clients (business_id);
create index if not exists business_members_profile_id_idx on public.business_members (profile_id);

-- 6. Row Level Security: any member of a business can read its clients;
-- only owner/staff can write (Commercialista stays read-only, per
-- PRODUCT.md). Helper functions are security definer + stable so the
-- policies that use them don't recurse into themselves.

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

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.businesses enable row level security;
alter table public.business_members enable row level security;
alter table public.clients enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

drop policy if exists "roles_select_authenticated" on public.roles;
create policy "roles_select_authenticated" on public.roles
  for select to authenticated using (true);

drop policy if exists "businesses_select_member" on public.businesses;
create policy "businesses_select_member" on public.businesses
  for select using (public.is_business_member(id));

drop policy if exists "business_members_select_same_business" on public.business_members;
create policy "business_members_select_same_business" on public.business_members
  for select using (public.is_business_member(business_id));

drop policy if exists "business_members_owner_manages" on public.business_members;
create policy "business_members_owner_manages" on public.business_members
  for all using (public.business_role(business_id) = 'owner');

drop policy if exists "clients_select_member" on public.clients;
create policy "clients_select_member" on public.clients
  for select using (public.is_business_member(business_id));

drop policy if exists "clients_write_owner_staff" on public.clients;
create policy "clients_write_owner_staff" on public.clients
  for all using (public.business_role(business_id) in ('owner', 'staff'));
