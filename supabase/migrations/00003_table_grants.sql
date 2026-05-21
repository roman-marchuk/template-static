-- Supabase requires explicit grants in addition to RLS policies.
-- Without these, authenticated users see "permission denied for table …".

grant usage on schema public to postgres, anon, authenticated, service_role;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, delete on public.calculator_history to authenticated;

grant all on public.profiles to service_role;
grant all on public.calculator_history to service_role;
