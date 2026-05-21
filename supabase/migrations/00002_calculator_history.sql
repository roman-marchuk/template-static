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

grant select, insert, delete on public.calculator_history to authenticated;
grant all on public.calculator_history to service_role;
