-- Impresa Viva — seed missing documents and this month's note for the
-- demo account only (DEV/TEST project).
--
-- The demo account (see DEMO_ACCOUNT_EMAIL in src/lib/oggi/demo-account.ts)
-- is the one account shown to prospects, so it should always look like a
-- real, active business. Every other account starts genuinely empty.
--
-- Safe to run repeatedly: the documents insert only fires if the demo
-- business has no missing documents yet, and the notes backfill only
-- touches the row's "notes" column while it's still empty (the row itself
-- was already inserted by the IVA e incassi demo seed, before "notes"
-- existed). Nothing is ever dropped, deleted, or truncated.

with demo_business as (
  select bm.business_id
  from public.business_members bm
  join auth.users u on u.id = bm.profile_id
  where u.email = 'andreadigiova09+impresaviva-test@gmail.com'
  limit 1
)
insert into public.missing_documents (business_id, description)
select demo_business.business_id, doc.description
from demo_business
cross join (
  values
    ('Fattura fornitore prodotti (maggio)'),
    ('Scontrino acquisto attrezzatura')
) as doc(description)
where not exists (
  select 1 from public.missing_documents d where d.business_id = demo_business.business_id
);

with demo_business as (
  select bm.business_id
  from public.business_members bm
  join auth.users u on u.id = bm.profile_id
  where u.email = 'andreadigiova09+impresaviva-test@gmail.com'
  limit 1
)
update public.monthly_revenue_summaries m
set notes = 'Spese più alte del solito per l''acquisto di materiale nuovo.'
from demo_business
where m.business_id = demo_business.business_id
  and m.period = date_trunc('month', current_date)::date
  and m.notes = '';
