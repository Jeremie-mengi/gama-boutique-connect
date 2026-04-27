
-- Enum des rôles
create type public.app_role as enum ('admin', 'vendeur');

-- Table boutiques
create table public.boutiques (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  adresse text,
  telephone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table profils
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  boutique_id uuid references public.boutiques(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table user_roles (séparée pour sécurité)
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique(user_id, role)
);

-- Activer RLS
alter table public.boutiques enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;

-- Fonction security definer pour vérifier rôle
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Trigger updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger boutiques_updated_at before update on public.boutiques
  for each row execute function public.set_updated_at();

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Trigger création profil
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email
  );
  -- Premier user = admin
  if (select count(*) from public.user_roles) = 0 then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'vendeur');
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS boutiques
create policy "Admins gèrent toutes boutiques" on public.boutiques
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Vendeurs voient leur boutique" on public.boutiques
  for select to authenticated
  using (id in (select boutique_id from public.profiles where id = auth.uid()));

-- RLS profiles
create policy "Voir son propre profil" on public.profiles
  for select to authenticated
  using (id = auth.uid());

create policy "Mettre à jour son profil" on public.profiles
  for update to authenticated
  using (id = auth.uid());

create policy "Admins voient tous profils" on public.profiles
  for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins modifient tous profils" on public.profiles
  for update to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- RLS user_roles
create policy "Voir ses propres rôles" on public.user_roles
  for select to authenticated
  using (user_id = auth.uid());

create policy "Admins gèrent rôles" on public.user_roles
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
