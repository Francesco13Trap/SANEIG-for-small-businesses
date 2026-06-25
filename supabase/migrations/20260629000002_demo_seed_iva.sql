-- Impresa Viva — seed IVA settings and this month's revenue summary for the
-- demo account only (DEV/TEST project).
--
-- The demo account (see DEMO_ACCOUNT_EMAIL in src/lib/oggi/demo-account.ts)
-- is the one account shown to prospects, so it should always look like a
-- real, active business. Every other account starts genuinely empty.
--
-- Safe to run repeatedly: it only inserts if the demo business has no IVA
-- settings / no summary for the current month yet, so it never duplicates
-- rows and never overwrites anything a real user entered. Nothing is ever
-- dropped, deleted, or truncated.

with demo_business as (
  select bm.business_id
  from public.business_members bm
  join auth.users u on u.id = bm.profile_id
  where u.email = 'andreadigiova09+impresaviva-test@gmail.com'
  limit 1
)
insert into public.iva_settings (business_id, regime, accountant_note)
select
  demo_business.business_id,
  'forfettario',
  'Verificare le spese di marzo prima di mandare i documenti.'
from demo_business
where not exists (
  select 1 from public.iva_settings s where s.business_id = demo_business.business_id
);

with demo_business as (
  select bm.business_id
  from public.business_members bm
  join auth.users u on u.id = bm.profile_id
  where u.email = 'andreadigiova09+impresaviva-test@gmail.com'
  limit 1
)
insert into public.monthly_revenue_summaries (business_id, period, incassi_segnati, spese_segnate)
select
  demo_business.business_id,
  date_trunc('month', current_date)::date,
  4280,
  1150
from demo_business
where not exists (
  select 1 from public.monthly_revenue_summaries m
  where m.business_id = demo_business.business_id
    and m.period = date_trunc('month', current_date)::date
);
