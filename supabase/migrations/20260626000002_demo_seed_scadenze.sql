-- Impresa Viva — seed sample deadlines for the demo account only (DEV/TEST project).
--
-- The demo account (see DEMO_ACCOUNT_EMAIL in src/lib/oggi/demo-account.ts)
-- is the one account shown to prospects, so it should always look like a
-- real, active business. Every other account starts genuinely empty.
--
-- Safe to run repeatedly: it only inserts if the demo business currently
-- has zero deadlines, so it never duplicates rows and never touches any
-- deadline a real user added themselves. Nothing is ever dropped, deleted,
-- or truncated.

with demo_business as (
  select bm.business_id
  from public.business_members bm
  join auth.users u on u.id = bm.profile_id
  where u.email = 'andreadigiova09+impresaviva-test@gmail.com'
  limit 1
)
insert into public.deadlines (business_id, title, category, due_date, status)
select demo_business.business_id, v.title, v.category, current_date + v.offset_days, v.status
from demo_business
cross join (
  values
    ('Rinnovo assicurazione attività', 'Assicurazione', 5, 'todo'),
    ('Controllo periodico attrezzature', 'Manutenzione', 15, 'in_progress'),
    ('Rinnovo certificazione sicurezza', 'Sicurezza', -20, 'done'),
    ('Pagamento canone locale', 'Affitto', 6, 'todo')
) as v(title, category, offset_days, status)
where not exists (
  select 1 from public.deadlines d where d.business_id = demo_business.business_id
);
