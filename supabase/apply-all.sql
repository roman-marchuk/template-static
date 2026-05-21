-- Run this once in Supabase Dashboard → SQL Editor
-- Applies both migrations (profiles + calculator_history)

-- === 00001_profiles.sql ===

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- === 00002_calculator_history.sql ===

create table public.calculator_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  expression text not null,
  result text not null,
  created_at timestamptz not null default now()
);

create index calculator_history_user_id_created_at_idx
  on public.calculator_history (user_id, created_at desc);

alter table public.calculator_history enable row level security;

create policy "Users can select own calculator history"
  on public.calculator_history
  for select
  using (user_id = auth.uid());

create policy "Users can insert own calculator history"
  on public.calculator_history
  for insert
  with check (user_id = auth.uid());

create policy "Users can delete own calculator history"
  on public.calculator_history
  for delete
  using (user_id = auth.uid());

grant usage on schema public to postgres, anon, authenticated, service_role;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, delete on public.calculator_history to authenticated;
grant all on public.profiles to service_role;
grant all on public.calculator_history to service_role;
