# Well Labs Platform

Admin console for **Well Labs** (`well-labs-platform`), based on a Shadcnblocks admin kit template.

## Getting Started

```bash
pnpm install
```

Copy env vars (see `.env.example`), then:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app redirects to the primary dashboard (`/ecommerce/dashboard-1`).

## Template pages

This repo ships many demo page variants from the original kit. To hide ones you do not need (without deleting files), see **[TEMPLATE.md](./TEMPLATE.md)**.

## Database

- **Supabase** — migrations, Auth, and Studio (browse/edit data in the Supabase dashboard).
- **Drizzle ORM** — optional typed server queries (`src/db`). Schema sync helper: `pnpm db:pull`.
- Do **not** use Drizzle Studio; use Supabase Studio instead.

```bash
pnpm db:migration   # create a new Supabase migration
pnpm db:push        # apply migrations
pnpm db:types       # regenerate TypeScript types from the linked project
pnpm db:pull        # introspect public schema into drizzle/ (reconcile by hand)
```

## Branding

Global name, logos, and header titles live in `src/data/site.ts`. Update that file to rebrand the shell, auth pages, and metadata.

## Tech Stack

- Next.js 16 · React 19 · TypeScript
- shadcn/ui 4 · TailwindCSS v4
- Supabase · Drizzle ORM
- ESLint 9 · Prettier · pnpm

## License

Template portions are covered by the license at https://www.shadcnblocks.com/license
