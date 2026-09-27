# Template pages — hide what you do not need

This project started as a **Shadcnblocks Admin Kit** template. It includes many demo page variants (Dashboard 1–9, multiple product lists, payment screens, etc.). Most of that UI is still useful as reference; you usually only need to **hide** unused entries from the sidebar rather than delete files.

Branding for the live shell is centralized in `src/data/site.ts` (**Well Labs** / `well-labs-platform`).

---

## Quick method (recommended)

Edit **`src/data/sidebar-data.tsx`**.

1. Find the section marked with a `// ── TEMPLATE: …` comment.
2. Comment out the whole `navGroups` object (or a single nested `{ title, url }` item).
3. Save — the route disappears from the sidebar and command palette (both read this file).

### Example: hide an entire product area

```tsx
navGroups: [
  // ── TEMPLATE: Ecommerce ── (keep)
  { title: "Ecommerce", items: [ /* … */ ] },

  // ── TEMPLATE: Project Management ── hide for now
  // {
  //   title: "Project Management",
  //   items: [ /* … */ ],
  // },

  // ── TEMPLATE: Payment Processor ──
  { title: "Payment Processor", items: [ /* … */ ] },
],
```

### Example: hide one page variant

```tsx
{
  title: "Dashboard",
  icon: IconLayoutDashboard,
  items: [
    { title: "Dashboard 1", url: "/ecommerce/dashboard-1" },
    // { title: "Dashboard 2", url: "/ecommerce/dashboard-2" },
    // { title: "Dashboard 3", url: "/ecommerce/dashboard-3" },
  ],
},
```

Commenting nav items does **not** delete the page. Direct URLs still work until you remove the route folder (see below).

---

## File map

| Sidebar section | App routes | UI components |
| --- | --- | --- |
| Ecommerce | `src/app/(admin)/ecommerce/**` | `src/components/ecommerce/**` |
| Project Management | `src/app/(admin)/project-management/**` | `src/components/project-management/**` |
| Payment Processor | `src/app/(admin)/payment-processor/**` | `src/components/payment-processor/**` |
| Todo | `src/app/(admin)/todo/**` | Colocated under the route + shared UI |
| Original | `src/app/(admin)/original/**` | Mix of route-local + `src/components/tasks` etc. |
| Developers | `src/app/(admin)/developers/**` | Colocated under the route |
| Auth / Errors | `src/app/(auth)/**`, `src/app/(errors)/**` | `src/components/errors/**` |

Each page is typically a thin `page.tsx` that imports a component, e.g.:

```
src/app/(admin)/ecommerce/(dashboard)/dashboard-1/page.tsx
  → @/components/ecommerce/dashboard-1
```

Home (`src/app/page.tsx`) redirects to `/ecommerce/dashboard-1`. If you retire that dashboard, update the redirect.

---

## Harder cleanup (optional)

Use this when you want unused templates out of the build entirely.

1. Comment out (or remove) the nav entries in `sidebar-data.tsx`.
2. Delete or move the matching route folder under `src/app/(admin)/…`.
3. Delete the matching component under `src/components/…` if nothing else imports it.
4. Search for leftover imports: `rg "dashboard-2" src` (example).
5. Run `pnpm lint` and `pnpm build`.

Do **not** delete `src/components/ui/**` or `src/components/layout/**` — those power the shared shell.

---

## Default entry & branding

| Concern | File |
| --- | --- |
| Product name, logos, header titles | `src/data/site.ts` |
| Sidebar teams / user / all template links | `src/data/sidebar-data.tsx` |
| Landing redirect | `src/app/page.tsx` |
| Document `<title>` / description | `src/app/layout.tsx` (reads `site`) |

---

## Database note

Schema and data browsing: **Supabase** (migrations + Supabase Studio).

Typed server SQL helper: **Drizzle ORM** (`src/db`, `drizzle/schema.ts`). `pnpm db:pull` can refresh the Drizzle schema from Postgres. **Drizzle Studio is not used** in this project.
