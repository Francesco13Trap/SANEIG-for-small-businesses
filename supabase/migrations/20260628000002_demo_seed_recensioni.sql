-- Impresa Viva — seed sample reviews for the demo account only (DEV/TEST project).
--
-- The demo account (see DEMO_ACCOUNT_EMAIL in src/lib/oggi/demo-account.ts)
-- is the one account shown to prospects, so it should always look like a
-- real, active business. Every other account starts genuinely empty.
--
-- Safe to run repeatedly: it only inserts if the demo business currently
-- has zero reviews, so it never duplicates rows and never touches any
-- review a real user added themselves. Nothing is ever dropped, deleted,
-- or truncated.

with demo_business as (
  select bm.business_id
  from public.business_members bm
  join auth.users u on u.id = bm.profile_id
  where u.email = 'andreadigiova09+impresaviva-test@gmail.com'
  limit 1
)
insert into public.reviews (business_id, client_name, rating, comment, review_date, responded)
select demo_business.business_id, v.client_name, v.rating, v.comment, v.review_date, v.responded
from demo_business
cross join (
  values
    ('Marco Rossi', 5, 'Sempre gentili e puntuali, consigliato!', date '2026-06-12', true),
    ('Sara Esposito', 5, 'Servizio ottimo, ambiente curato.', date '2026-06-08', true),
    ('Chiara Marini', 4, 'Molto bene, un po'' di attesa in più del previsto.', date '2026-06-16', false),
    ('Davide Romano', 3, 'Nella media, mi aspettavo qualcosa in più.', date '2026-06-17', false)
) as v(client_name, rating, comment, review_date, responded)
where not exists (
  select 1 from public.reviews r where r.business_id = demo_business.business_id
);
