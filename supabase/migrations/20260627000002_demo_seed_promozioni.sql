-- Impresa Viva — seed sample promotions for the demo account only (DEV/TEST project).
--
-- The demo account (see DEMO_ACCOUNT_EMAIL in src/lib/oggi/demo-account.ts)
-- is the one account shown to prospects, so it should always look like a
-- real, active business. Every other account starts genuinely empty.
--
-- Safe to run repeatedly: it only inserts if the demo business currently
-- has zero promotions, so it never duplicates rows and never touches any
-- promotion a real user added themselves. Nothing is ever dropped,
-- deleted, or truncated.

with demo_business as (
  select bm.business_id
  from public.business_members bm
  join auth.users u on u.id = bm.profile_id
  where u.email = 'andreadigiova09+impresaviva-test@gmail.com'
  limit 1
)
insert into public.promotions (business_id, title, description, period, status)
select demo_business.business_id, v.title, v.description, v.period, v.status
from demo_business
cross join (
  values
    ('Sconto del 10% per i nuovi clienti', 'Valido sul primo appuntamento prenotato.', '1 - 30 giugno 2026', 'active'),
    ('Porta un amico', 'Uno sconto per chi porta un nuovo cliente.', '15 giugno - 15 luglio 2026', 'active'),
    ('Promozione estiva', 'Offerta speciale per i mesi di luglio e agosto.', '1 luglio - 31 agosto 2026', 'scheduled'),
    ('Promozione di primavera', 'Sconto sui rinnovi degli abbonamenti.', '1 - 30 aprile 2026', 'ended')
) as v(title, description, period, status)
where not exists (
  select 1 from public.promotions p where p.business_id = demo_business.business_id
);
