-- Clients: reference table for the data layer (src/server/dal/clients.ts).
-- Rows are owned by the user who created them and protected by RLS.

create type public.client_status as enum (
  'prospect',
  'active',
  'on_hold',
  'completed',
  'archived'
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 200),
  status public.client_status not null default 'prospect',
  industry text,
  website text,
  location text,
  account_owner text,
  primary_contact_name text,
  primary_contact_email text,
  notes text,
  segment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index clients_owner_id_idx on public.clients (owner_id);
create index clients_owner_status_idx on public.clients (owner_id, status);

-- Keep updated_at current.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger clients_set_updated_at
before update on public.clients
for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.clients enable row level security;

-- `(select auth.uid())` is evaluated once per statement instead of per row.
create policy "Users can read their own clients"
on public.clients for select
to authenticated
using ((select auth.uid()) = owner_id);

create policy "Users can create their own clients"
on public.clients for insert
to authenticated
with check ((select auth.uid()) = owner_id);

create policy "Users can update their own clients"
on public.clients for update
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "Users can delete their own clients"
on public.clients for delete
to authenticated
using ((select auth.uid()) = owner_id);
