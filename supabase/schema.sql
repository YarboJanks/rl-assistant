-- RL Assistant — Database Schema
-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/_/sql

-- ── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Builds ───────────────────────────────────────────────────────────────────
create table if not exists builds (
  id          uuid primary key default uuid_generate_v4(),
  owner_id    text        not null,            -- Discord user ID
  name        text        not null,
  role        text        not null check (role in ('tank', 'healer', 'dps')),
  class       text        not null,
  gear        jsonb       not null default '[]',
  skills      jsonb       not null default '[]',
  cp          jsonb       not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Raids ─────────────────────────────────────────────────────────────────────
create table if not exists raids (
  id          uuid primary key default uuid_generate_v4(),
  leader_id   text        not null,            -- Discord user ID of raid lead
  name        text        not null,
  description text,
  date        timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Roster Entries ────────────────────────────────────────────────────────────
create table if not exists roster_entries (
  id           uuid primary key default uuid_generate_v4(),
  raid_id      uuid        not null references raids(id) on delete cascade,
  discord_id   text        not null,           -- Discord user ID of the player
  display_name text        not null,
  role         text        not null check (role in ('tank', 'healer', 'dps')),
  build_id     uuid        references builds(id) on delete set null,
  created_at   timestamptz not null default now(),
  unique (raid_id, discord_id)                 -- one slot per player per raid
);

-- ── Auto-update updated_at ────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger builds_updated_at
  before update on builds
  for each row execute function update_updated_at();

create trigger raids_updated_at
  before update on raids
  for each row execute function update_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────────
-- All writes go through Next.js API routes using the service role key,
-- which bypasses RLS. These policies cover any future direct client access.

alter table builds         enable row level security;
alter table raids          enable row level security;
alter table roster_entries enable row level security;

-- Builds: owners can read/write their own; anyone can read builds assigned to them via roster
create policy "builds: owner full access"
  on builds for all
  using (owner_id = current_setting('app.discord_id', true));

-- Raids: leaders can read/write their own
create policy "raids: leader full access"
  on raids for all
  using (leader_id = current_setting('app.discord_id', true));

-- Roster entries: raid leader can manage; player can read their own entry
create policy "roster: leader full access"
  on roster_entries for all
  using (
    raid_id in (
      select id from raids
      where leader_id = current_setting('app.discord_id', true)
    )
  );

create policy "roster: player can read own entry"
  on roster_entries for select
  using (discord_id = current_setting('app.discord_id', true));

-- ── Indexes ───────────────────────────────────────────────────────────────────
create index if not exists builds_owner_id_idx         on builds(owner_id);
create index if not exists raids_leader_id_idx         on raids(leader_id);
create index if not exists roster_entries_raid_id_idx  on roster_entries(raid_id);
create index if not exists roster_entries_discord_id_idx on roster_entries(discord_id);
