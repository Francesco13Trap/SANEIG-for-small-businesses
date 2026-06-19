-- Additive change: the MVP Clienti page needs an email field and a
-- last-modified timestamp on clients. Existing clients table/data/policies
-- are left untouched (no drops, no renames, no destructive changes).

alter table public.clients
  add column if not exists email text,
  add column if not exists updated_at timestamptz not null default now();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists clients_set_updated_at on public.clients;

create trigger clients_set_updated_at
  before update on public.clients
  for each row
  execute function public.set_updated_at();
