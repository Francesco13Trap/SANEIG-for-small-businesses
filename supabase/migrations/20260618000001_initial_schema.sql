-- Impresa Viva — initial foundation schema (DEV/TEST project)
--
-- Multi-tenant model: every business-owned row carries a business_id.
-- auth.users (managed by Supabase Auth) is extended with a public.profiles row.

create extension if not exists "pgcrypto";

-- 1. Profiles: one row per auth user, created automatically on signup.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Roles: fixed lookup of membership roles (Titolare / Collaboratore / Commercialista).
create table public.roles (
  id text primary key,
  label text not null
);

insert into public.roles (id, label) values
  ('owner', 'Titolare'),
  ('staff', 'Collaboratore'),
  ('accountant', 'Commercialista');

-- 3. Businesses: the tenant root.
create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);

-- 4. Business members: who belongs to which business, with which role.
create table public.business_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  role_id text not null references public.roles (id),
  created_at timestamptz not null default now(),
  unique (business_id, profile_id)
);

-- Creates a business and its owner membership in one transaction, so a
-- business can never exist without an owner (and vice versa).
create function public.create_business(business_name text)
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

-- 5. Domain tables, each scoped to a business.

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  name text not null,
  phone text,
  last_contact_at date,
  status text not null default 'new',
  note text,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  client_id uuid references public.clients (id) on delete set null,
  amount numeric(10, 2) not null,
  due_date date,
  status text not null default 'to_check',
  created_at timestamptz not null default now()
);

create table public.deadlines (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  title text not null,
  category text,
  due_date date,
  status text not null default 'todo',
  created_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  client_id uuid references public.clients (id) on delete set null,
  name text not null,
  start_date date,
  end_date date,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  title text not null,
  detail text,
  due_date date,
  is_important boolean not null default false,
  created_at timestamptz not null default now()
);

-- 6. Indexes for the business_id lookups every query will filter on.
create index clients_business_id_idx on public.clients (business_id);
create index payments_business_id_idx on public.payments (business_id);
create index deadlines_business_id_idx on public.deadlines (business_id);
create index subscriptions_business_id_idx on public.subscriptions (business_id);
create index reminders_business_id_idx on public.reminders (business_id);
create index business_members_profile_id_idx on public.business_members (profile_id);
