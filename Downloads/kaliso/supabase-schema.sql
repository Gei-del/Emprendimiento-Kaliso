create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null,
  collection text,
  material text,
  description text not null,
  images text[] not null default '{}',
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  badge text,
  price integer,
  active boolean not null default true,
  customizable boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.products enable row level security;
drop policy if exists "catalogo publico" on public.products;
drop policy if exists "admin crea" on public.products;
drop policy if exists "admin actualiza" on public.products;
drop policy if exists "admin elimina" on public.products;
create policy "catalogo publico" on public.products for select using (active = true or lower(auth.jwt()->>'email') in ('pontongeidy@gmail.com','karenmorales12386@gmail.com'));
create policy "admin crea" on public.products for insert to authenticated with check (lower(auth.jwt()->>'email') in ('pontongeidy@gmail.com','karenmorales12386@gmail.com'));
create policy "admin actualiza" on public.products for update to authenticated using (lower(auth.jwt()->>'email') in ('pontongeidy@gmail.com','karenmorales12386@gmail.com')) with check (lower(auth.jwt()->>'email') in ('pontongeidy@gmail.com','karenmorales12386@gmail.com'));
create policy "admin elimina" on public.products for delete to authenticated using (lower(auth.jwt()->>'email') in ('pontongeidy@gmail.com','karenmorales12386@gmail.com'));
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types) values ('product-images','product-images',true,5242880,array['image/jpeg','image/png','image/webp']) on conflict (id) do nothing;
drop policy if exists "fotos publicas" on storage.objects;
drop policy if exists "admin sube fotos" on storage.objects;
drop policy if exists "admin elimina fotos" on storage.objects;
create policy "fotos publicas" on storage.objects for select using (bucket_id='product-images');
create policy "admin sube fotos" on storage.objects for insert to authenticated with check (bucket_id='product-images' and lower(auth.jwt()->>'email') in ('pontongeidy@gmail.com','karenmorales12386@gmail.com'));
create policy "admin elimina fotos" on storage.objects for delete to authenticated using (bucket_id='product-images' and lower(auth.jwt()->>'email') in ('pontongeidy@gmail.com','karenmorales12386@gmail.com'));
