-- Impresa Viva — seed sample reminders for the demo account only (DEV/TEST project).
--
-- The demo account (see DEMO_ACCOUNT_EMAIL in src/lib/oggi/demo-account.ts)
-- is the one account shown to prospects, so it should always look like a
-- real, active business. Every other account starts genuinely empty.
--
-- Safe to run repeatedly: it only inserts if the demo business currently
-- has zero reminders, so it never duplicates rows and never touches any
-- reminder a real user added themselves. Nothing is ever dropped, deleted,
-- or truncated.

with demo_business as (
  select bm.business_id
  from public.business_members bm
  join auth.users u on u.id = bm.profile_id
  where u.email = 'andreadigiova09+impresaviva-test@gmail.com'
  limit 1
)
insert into public.reminders (business_id, title, detail, due_date, important, done)
select demo_business.business_id, v.title, v.detail, current_date + v.offset_days, v.important, false
from demo_business
cross join (
  values
    ('Richiamare Giulia Bianchi', 'Pagamento di 45 € ancora da sollecitare.', 0, true),
    ('Avvisare Paolo Greco', 'Il suo abbonamento è in scadenza tra pochi giorni.', 0, true),
    ('Ordinare materiale di consumo', 'In magazzino ne restano pochi.', 5, false),
    ('Rispondere alla recensione di Chiara Marini', 'Ha lasciato una recensione di recente.', 5, false),
    ('Rinnovo assicurazione attività', 'Scadenza importante da non perdere.', 14, true)
) as v(title, detail, offset_days, important)
where not exists (
  select 1 from public.reminders r where r.business_id = demo_business.business_id
);
