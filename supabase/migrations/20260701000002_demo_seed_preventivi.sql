-- Impresa Viva — seed sample quotes/preventivi for the demo account only
-- (DEV/TEST project).
--
-- The demo account (see DEMO_ACCOUNT_EMAIL in src/lib/oggi/demo-account.ts)
-- is the one account shown to prospects, so it should always look like a
-- real, active business. Every other account starts genuinely empty.
--
-- Each sample quote is linked to one of the demo business's own clients
-- (picked by creation order), so the Preventivi page can show a real
-- client name exactly as it would for a real user.
--
-- Safe to run repeatedly: the insert only fires if the demo business has
-- no quotes yet, and only as many sample rows are inserted as there are
-- demo clients to link them to. Nothing is ever dropped, deleted, or
-- truncated.

with demo_business as (
  select bm.business_id
  from public.business_members bm
  join auth.users u on u.id = bm.profile_id
  where u.email = 'andreadigiova09+impresaviva-test@gmail.com'
  limit 1
),
demo_clients as (
  select
    c.id,
    row_number() over (order by c.created_at) as rn
  from public.clients c
  join demo_business on c.business_id = demo_business.business_id
)
insert into public.quotes (
  business_id, client_id, title, description, amount, status, valid_until, note
)
select
  demo_business.business_id,
  demo_clients.id,
  q.title,
  q.description,
  q.amount,
  q.status,
  case when q.valid_offset is null then null else current_date + q.valid_offset end,
  q.note
from demo_business
cross join (
  values
    (1, 'Sito web vetrina', 'Sito vetrina con 5 pagine e modulo contatti.', 850.00, 'sent', 14, null),
    (1, 'Gestione social media', 'Pacchetto mensile per la gestione delle pagine social.', 250.00, 'accepted', null, null),
    (2, 'Logo e immagine del brand', 'Logo, palette colori e biglietti da visita.', 320.00, 'draft', 10, 'Da rivedere con il cliente prima di inviare.')
) as q(client_rn, title, description, amount, status, valid_offset, note)
join demo_clients on demo_clients.rn = q.client_rn
where not exists (
  select 1 from public.quotes qq where qq.business_id = demo_business.business_id
);
