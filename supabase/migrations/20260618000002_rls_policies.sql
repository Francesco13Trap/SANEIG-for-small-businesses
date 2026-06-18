-- Impresa Viva — initial Row Level Security policies (DEV/TEST project)
--
-- First draft: every business-scoped table is readable only by members of
-- that business; writes are limited to owner/staff (Commercialista stays
-- read-only, matching PRODUCT.md). Fine-grained permission rules will be
-- revisited in the dedicated roles & permissions phase (ARCHITECTURE.md
-- phase 3) once auth is wired up.
--
-- business_members cannot check membership by querying itself directly in
-- its own policy (or any policy on a table whose policy in turn queries
-- business_members) — Postgres re-applies the same RLS policy to that
-- inner query and recurses forever. The fix is the helper functions below:
-- security definer functions run as their owner (postgres, a superuser),
-- which bypasses RLS for the lookup inside the function body.

create function public.is_business_member(target_business_id uuid)
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

create function public.business_role(target_business_id uuid)
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
alter table public.payments enable row level security;
alter table public.deadlines enable row level security;
alter table public.subscriptions enable row level security;
alter table public.reminders enable row level security;

-- profiles: a user can only see and edit their own profile row.
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());

create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

-- roles: static lookup table, readable by any authenticated user.
create policy "roles_select_authenticated" on public.roles
  for select to authenticated using (true);

-- businesses: visible to its members. Created only via the
-- create_business() function (security definer, bypasses RLS), so there is
-- no direct insert policy here.
create policy "businesses_select_member" on public.businesses
  for select using (public.is_business_member(id));

-- business_members: members can see who else is in their businesses.
create policy "business_members_select_same_business" on public.business_members
  for select using (public.is_business_member(business_id));

-- Only an existing owner can add, change, or remove memberships.
create policy "business_members_owner_manages" on public.business_members
  for all using (public.business_role(business_id) = 'owner');

-- Domain tables: any member of the business can read; only owner/staff can
-- write (Commercialista is read-only on financial sections per PRODUCT.md).
create policy "clients_select_member" on public.clients
  for select using (public.is_business_member(business_id));

create policy "clients_write_owner_staff" on public.clients
  for all using (public.business_role(business_id) in ('owner', 'staff'));

create policy "payments_select_member" on public.payments
  for select using (public.is_business_member(business_id));

create policy "payments_write_owner_staff" on public.payments
  for all using (public.business_role(business_id) in ('owner', 'staff'));

create policy "deadlines_select_member" on public.deadlines
  for select using (public.is_business_member(business_id));

create policy "deadlines_write_owner_staff" on public.deadlines
  for all using (public.business_role(business_id) in ('owner', 'staff'));

create policy "subscriptions_select_member" on public.subscriptions
  for select using (public.is_business_member(business_id));

create policy "subscriptions_write_owner_staff" on public.subscriptions
  for all using (public.business_role(business_id) in ('owner', 'staff'));

create policy "reminders_select_member" on public.reminders
  for select using (public.is_business_member(business_id));

create policy "reminders_write_owner_staff" on public.reminders
  for all using (public.business_role(business_id) in ('owner', 'staff'));
