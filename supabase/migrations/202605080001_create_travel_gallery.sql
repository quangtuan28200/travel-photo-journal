create extension if not exists "pgcrypto";

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  location text,
  started_at date,
  ended_at date,
  description text,
  cover_photo_id uuid,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trips_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint trips_date_order check (started_at is null or ended_at is null or started_at <= ended_at)
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  r2_original_key text not null,
  r2_large_key text not null,
  r2_thumb_key text not null,
  width integer,
  height integer,
  blur_data_url text,
  caption text,
  taken_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.trips
  add constraint trips_cover_photo_id_fkey
  foreign key (cover_photo_id)
  references public.photos(id)
  on delete set null;

create index if not exists trips_is_published_started_at_idx
  on public.trips (is_published, started_at desc);

create index if not exists trips_slug_idx
  on public.trips (slug);

create index if not exists photos_trip_id_sort_order_idx
  on public.photos (trip_id, sort_order asc, created_at asc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_trips_updated_at on public.trips;

create trigger set_trips_updated_at
before update on public.trips
for each row
execute function public.set_updated_at();

alter table public.trips enable row level security;
alter table public.photos enable row level security;

drop policy if exists "Public can read published trips" on public.trips;
create policy "Public can read published trips"
on public.trips
for select
using (is_published = true);

drop policy if exists "Public can read photos for published trips" on public.photos;
create policy "Public can read photos for published trips"
on public.photos
for select
using (
  exists (
    select 1
    from public.trips
    where trips.id = photos.trip_id
      and trips.is_published = true
  )
);
