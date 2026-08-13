# EnglishAI Pro

> Learn English Smarter with Artificial Intelligence.

A premium SaaS-grade English learning platform (A1–C1, CEFR-aligned) built with a feature-based architecture.

## Stack

- **React 19** + **TypeScript** (strict) + **Vite**
- **Tailwind CSS v4** with semantic design tokens (light/dark)
- **React Router v7** (lazy routes) · **TanStack Query** · **Zustand**
- **Framer Motion** (micro-animations) · **Recharts** (analytics) · **Lucide** (icons)
- Design intelligence via the `ui-ux-pro-max` skill (`.claude/skills/`)

## Getting started

```bash
npm install
npm run dev        # http://localhost:5199
npm run build      # production build
npm run typecheck  # strict TS check
```

## Architecture

```
src/
  app/          # router
  components/   # ui/ (reusable primitives) + shared/
  data/         # mock data (swap for API services)
  features/     # one folder per module (dashboard, courses, ai-tutor, …)
  layouts/      # AppLayout, Sidebar, Topbar
  lib/          # cn() and utilities
  store/        # zustand stores (theme, sidebar)
  styles/       # Tailwind v4 tokens
  types/        # shared domain types
```

## Modules

Dashboard · My Courses · Vocabulary · Grammar · Listening · Speaking Lab · Reading · Writing Studio · AI Tutor · Flashcards · Games (Quiz Battle playable) · Leaderboard · Achievements · Certificates · Settings

## Next steps (backend)

The UI currently runs on typed mock data in `src/data/mock.ts`. The planned backend is NestJS + Prisma + PostgreSQL + Redis with OpenAI/Claude/Whisper/ElevenLabs integrations — replace `data/` with `services/` API clients when it lands.
