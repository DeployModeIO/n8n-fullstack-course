# N8N Full Stack Course

Learning platform for the complete N8N automation course, built with Next.js 14, TypeScript, Tailwind CSS and Supabase.

## Requirements

- Node.js 18+
- npm or pnpm

## Installation

```bash
git clone <repository>
cd n8n-fullstack-course
npm install
```

## Configuration

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase project URL, the anon key and the service role key.
You can find all of them in **Supabase Dashboard -> Project Settings -> API**.

## Database

The platform uses its own email/password auth (no Supabase Auth needed), so the
only thing required in a fresh project is the schema:

1. Open **SQL Editor** in the Supabase dashboard.
2. Run the whole contents of [`supabase/schema.sql`](supabase/schema.sql).
3. Create a new project with the Supabase Management API if you prefer (see
   `docs/supabase-setup.md`).

The schema creates:

| Table | Purpose |
| --- | --- |
| `users` | Login accounts (bcrypt `password_hash`, `student` / `instructor` / `admin` roles) |
| `invitations` | Admin-created invite tokens |
| `modules` / `lessons` | Optional DB mirror of the course content |
| `user_progress` | Completed lessons per user |
| `quiz_results` | Per-lesson quiz attempts |
| `submissions` | Lab submissions |
| `enrollments` | Final exam attempt counter (3 attempts, then access is blocked) |
| `certificates` | Verifiable certificates issued to students |

The default admin account seeded by `schema.sql` is `luisriverosu@gmail.com`
(password `AdminN8N2026!`, change it right after the first login).

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploying to Vercel

1. Connect this repository at [vercel.com](https://vercel.com).
2. Add the environment variables from the Vercel dashboard (same keys as `.env.local`).
3. The deployment runs automatically on every push to `main`.

Remember to set `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_SITE_URL` to the production
domain so certificate verification links point to the right host.
