-- Impresa Viva — seed sample suppliers for the demo account only
-- (DEV/TEST project).
--
-- The demo account (see DEMO_ACCOUNT_EMAIL in src/lib/oggi/demo-account.ts)
-- is the one account shown to prospects, so it should always look like a
-- real, active business. Every other account starts genuinely empty.
--
-- Safe to run repeatedly: it only inserts if the demo business currently
-- has zero suppliers, so it never duplicates rows and never touches any
-- supplier a real user added themselves. Nothing is ever dropped,
-- deleted, or truncated.

with demo_business as (
  select bm.business_id
  from public.business_members bm
  join auth.users u on u.id = bm.profile_id
  where u.email = 'andreadigiova09+impresaviva-test@gmail.com'
  limit 1
)
insert into public.suppliers (business_id, name, contact_name, phone, email, category, note)
select demo_business.business_id, v.name, v.contact_name, v.phone, v.email, v.category, v.note
from demo_business
cross join (
  values
    ('Distribuzione Nord Srl', 'Marco Bianchi', '02 1234567', 'ordini@distribuzionenord.it', 'Prodotti di consumo', null),
    ('Forniture Italia', 'Giulia Conti', '06 7654321', 'info@fornitureitalia.it', 'Materiale tecnico', null),
    ('EcoPulizie', null, '011 9988776', null, 'Pulizia e igiene', 'Da richiamare per il nuovo listino.')
) as v(name, contact_name, phone, email, category, note)
where not exists (
  select 1 from public.suppliers s where s.business_id = demo_business.business_id
);
