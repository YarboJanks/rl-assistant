# RL Assistant

Raid roster and build management for Elder Scrolls Online. Raid leads create rosters and assign builds on the web — players import and apply them in-game with one click.

## The Problem

ESO raid setup is slow. Raid leads post assignments in Discord, players read them manually, then manually configure gear, skills, and champion points before every raid. Mistakes happen. Raids start late.

## The Solution

1. **Raid leads** create a roster on the website, assign builds to each player, and publish it.
2. **Players** open the addon in-game, paste their import code, and click Apply. Gear, skills, and CP are configured automatically.

## Features

### Website
- Discord login
- Create and manage raid rosters
- Build template library (gear, skills, CP)
- Assign builds to players by role
- Generate per-player import codes

### ESO Addon
- Paste import code to sync assigned build
- One-click apply: equips gear, sets skills, allocates CP
- Validation: shows missing gear, unavailable skills, insufficient CP

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Auth | NextAuth.js + Discord OAuth |
| Database | Supabase (PostgreSQL) |
| Hosting | Vercel |
| Addon | ESO Lua |

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/YarboJanks/rl-assistant.git
cd rl-assistant
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

| Variable | Where to get it |
|----------|----------------|
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `DISCORD_CLIENT_ID` | [Discord Developer Portal](https://discord.com/developers/applications) |
| `DISCORD_CLIENT_SECRET` | Discord Developer Portal |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project settings |

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    api/
      auth/        # NextAuth Discord OAuth
      raids/       # Raid CRUD endpoints
      builds/      # Build template endpoints
    (dashboard)/   # Authenticated pages
    login/         # Discord sign-in page
  lib/
    auth.ts        # NextAuth config
    supabase.ts    # Supabase clients
  types/
    index.ts       # Shared types (Raid, Build, RosterEntry)
addon/             # ESO Lua addon (coming soon)
```

## Roadmap

- [x] Project scaffold
- [x] Discord auth
- [x] Raid and build API
- [ ] Raid roster UI
- [ ] Build template editor
- [ ] Import code generator
- [ ] ESO addon -- import + apply
- [ ] ESO addon -- validation UI
