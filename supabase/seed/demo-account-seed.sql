-- Impresa Viva — sample data for the sales/demo account.
--
-- NOT a migration: lives in supabase/seed/, not supabase/migrations/, so it
-- never runs automatically. Run manually, once
-- andreadigiova09+impresaviva-test@gmail.com has signed up and created its
-- business in the app.
--
-- Scoped entirely to that account's own business_id — never touches any
-- other business. Idempotent: every insert is guarded by an existence
-- check, so running this script again changes nothing. Nothing is ever
-- dropped, deleted, or truncated.

do $$
declare
  demo_business_id uuid;
  cliente_giulia_id uuid;
  cliente_anna_id uuid;
  cliente_davide_id uuid;
begin
  select bm.business_id into demo_business_id
  from auth.users u
  join public.business_members bm on bm.profile_id = u.id
  where u.email = 'andreadigiova09+impresaviva-test@gmail.com'
  order by bm.created_at asc
  limit 1;

  if demo_business_id is null then
    raise notice 'Demo account not found (or has no business yet) — nothing seeded. Sign up with andreadigiova09+impresaviva-test@gmail.com and create a business first, then re-run this script.';
    return;
  end if;

  -- Demo clienti, used only to give the demo payments below a real name.
  select id into cliente_giulia_id from public.clients
    where business_id = demo_business_id and name = 'Giulia Bianchi';
  if cliente_giulia_id is null then
    insert into public.clients (business_id, name, phone, status, note)
    values (demo_business_id, 'Giulia Bianchi', '347 9876543', 'new', 'Non si presenta da un mese.')
    returning id into cliente_giulia_id;
  end if;

  select id into cliente_anna_id from public.clients
    where business_id = demo_business_id and name = 'Anna Colombo';
  if cliente_anna_id is null then
    insert into public.clients (business_id, name, phone, status, note)
    values (demo_business_id, 'Anna Colombo', '338 2223344', 'new', 'Abbonamento scaduto, non rinnovato.')
    returning id into cliente_anna_id;
  end if;

  select id into cliente_davide_id from public.clients
    where business_id = demo_business_id and name = 'Davide Romano';
  if cliente_davide_id is null then
    insert into public.clients (business_id, name, phone, status, note)
    values (demo_business_id, 'Davide Romano', '328 1112233', 'new', 'Ha chiesto un preventivo, non ha risposto.')
    returning id into cliente_davide_id;
  end if;

  -- Demo pagamenti: one overdue, one to_check, one already paid.
  if not exists (
    select 1 from public.payments
    where business_id = demo_business_id
      and client_id = cliente_giulia_id
      and due_date < current_date
  ) then
    insert into public.payments (business_id, client_id, amount, due_date, status)
    values (demo_business_id, cliente_giulia_id, 45.00, current_date - 10, 'to_check');
  end if;

  if not exists (
    select 1 from public.payments
    where business_id = demo_business_id
      and client_id = cliente_anna_id
      and status = 'to_check'
      and due_date >= current_date
  ) then
    insert into public.payments (business_id, client_id, amount, due_date, status)
    values (demo_business_id, cliente_anna_id, 60.00, current_date + 30, 'to_check');
  end if;

  if not exists (
    select 1 from public.payments
    where business_id = demo_business_id
      and client_id = cliente_davide_id
      and status = 'paid'
  ) then
    insert into public.payments (business_id, client_id, amount, due_date, status)
    values (demo_business_id, cliente_davide_id, 35.00, current_date - 5, 'paid');
  end if;
end $$;
