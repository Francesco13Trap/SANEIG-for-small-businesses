-- Impresa Viva — seed sample staff payment reminders for the demo account
-- only (DEV/TEST project).
--
-- The demo account (see DEMO_ACCOUNT_EMAIL in src/lib/oggi/demo-account.ts)
-- is the one account shown to prospects, so it should always look like a
-- real, active business. Every other account starts genuinely empty.
--
-- These are plain internal payment reminders, not payroll records: no
-- taxes, contributions, or official salary figures are involved.
--
-- Safe to run repeatedly: it only inserts if the demo business currently
-- has zero staff payment reminders, so it never duplicates rows and never
-- touches any reminder a real user added themselves. Nothing is ever
-- dropped, deleted, or truncated.

with demo_business as (
  select bm.business_id
  from public.business_members bm
  join auth.users u on u.id = bm.profile_id
  where u.email = 'andreadigiova09+impresaviva-test@gmail.com'
  limit 1
)
insert into public.staff_payments (
  business_id, person_name, role, amount, month, due_date, status, note
)
select
  demo_business.business_id,
  v.person_name,
  v.role,
  v.amount,
  v.month,
  case when v.due_offset is null then null else current_date + v.due_offset end,
  v.status,
  v.note
from demo_business
cross join (
  values
    ('Marco Rossi', 'Collaboratore', 1200.00, 'Giugno 2026', 5, 'to_pay', null),
    ('Giulia Bianchi', 'Assistente', 850.00, 'Maggio 2026', null, 'paid', null),
    ('Luca Verdi', 'Collaboratore esterno', 600.00, 'Aprile 2026', -10, 'delayed', 'Da controllare con il collaboratore.')
) as v(person_name, role, amount, month, due_offset, status, note)
where not exists (
  select 1 from public.staff_payments sp where sp.business_id = demo_business.business_id
);
