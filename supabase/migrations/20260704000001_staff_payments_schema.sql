-- Impresa Viva — idempotent Stipendi setup (DEV/TEST project).
--
-- Creates public.staff_payments, the table the Stipendi page reads and
-- writes: a simple internal reminder/list for payments to collaborators or
-- staff. This is NOT payroll software — it does not calculate taxes, INPS,
-- IRPEF, contributions, or generate payslips or any official salary
-- document. It only stores a name, an amount, a reference month and a
-- status, so a business owner can remember who still needs to be paid.
--
-- Safe to run on:
--   - a completely empty database,
--   - a database where public.staff_payments already exists in this shape,
--   - a database where everything below already exists.
-- Every statement only creates what's missing, or replaces a function/
-- trigger/policy definition with itself — nothing is ever dropped, deleted,
-- or truncated.

create extension if not exists "pgcrypto";

-- Re-declare the shared helpers in case this script runs on a database
-- where the rest of the schema setup hasn't been applied yet.

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

-- Staff payments — the table the Stipendi page reads and writes.
-- person_name is plain free text (not a link to any employee/HR record):
-- this section only tracks a payment reminder, nothing more.
create table if not exists public.staff_payments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  person_name text not null,
  role text,
  amount numeric not null,
  month text not null,
  due_date date,
  status text not null default 'to_pay',
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- In case public.staff_payments already existed in a partial shape.
alter table public.staff_payments
  add column if not exists role text;
alter table public.staff_payments
  add column if not exists due_date date;
alter table public.staff_payments
  add column if not exists status text not null default 'to_pay';
alter table public.staff_payments
  add column if not exists note text;
alter table public.staff_payments
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists staff_payments_set_updated_at on public.staff_payments;
create trigger staff_payments_set_updated_at
  before update on public.staff_payments
  for each row
  execute function public.set_updated_at();

create index if not exists staff_payments_business_id_idx on public.staff_payments (business_id);

-- Row Level Security: any member of a business can read its staff payment
-- reminders; only owner/staff can write (same shape as the other sections).
alter table public.staff_payments enable row level security;

drop policy if exists "staff_payments_select_member" on public.staff_payments;
create policy "staff_payments_select_member" on public.staff_payments
  for select using (public.is_business_member(business_id));

drop policy if exists "staff_payments_write_owner_staff" on public.staff_payments;
create policy "staff_payments_write_owner_staff" on public.staff_payments
  for all using (public.business_role(business_id) in ('owner', 'staff'));
