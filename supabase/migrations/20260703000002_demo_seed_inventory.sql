-- Impresa Viva — seed sample inventory items for the demo account only
-- (DEV/TEST project).
--
-- The demo account (see DEMO_ACCOUNT_EMAIL in src/lib/oggi/demo-account.ts)
-- is the one account shown to prospects, so it should always look like a
-- real, active business. Every other account starts genuinely empty.
--
-- Two sample items are linked to one of the demo business's own suppliers
-- (picked by creation order); one sample item has no supplier at all, to
-- show that the link is optional and items work fine without it.
--
-- Safe to run repeatedly: it only inserts if the demo business currently
-- has zero inventory items, so it never duplicates rows and never touches
-- any item a real user added themselves. Nothing is ever dropped,
-- deleted, or truncated.

with demo_business as (
  select bm.business_id
  from public.business_members bm
  join auth.users u on u.id = bm.profile_id
  where u.email = 'andreadigiova09+impresaviva-test@gmail.com'
  limit 1
),
demo_suppliers as (
  select
    s.id,
    row_number() over (order by s.created_at) as rn
  from public.suppliers s
  join demo_business on s.business_id = demo_business.business_id
)
insert into public.inventory_items (
  business_id, supplier_id, name, quantity, minimum_quantity, unit, category, note
)
select
  demo_business.business_id,
  demo_suppliers.id,
  v.name,
  v.quantity,
  v.minimum_quantity,
  v.unit,
  v.category,
  v.note
from demo_business
cross join (
  values
    (1, 'Prodotto base trattamento', 18, 5, 'pezzi', 'Materiale di consumo', null),
    (2, 'Guanti monouso', 4, 10, 'scatole', 'Materiale tecnico', 'Da riordinare al più presto.'),
    (null, 'Asciugamani', 32, 10, 'pezzi', 'Pulizia e igiene', null)
) as v(supplier_rn, name, quantity, minimum_quantity, unit, category, note)
left join demo_suppliers on demo_suppliers.rn = v.supplier_rn
where not exists (
  select 1 from public.inventory_items i where i.business_id = demo_business.business_id
);
