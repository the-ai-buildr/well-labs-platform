// Mirrors supabase/migrations. Regenerate with `pnpm db:pull` — don't hand-edit.
import { sql } from "drizzle-orm";
import {
  check,
  index,
  pgEnum,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authenticatedRole, authUsers } from "drizzle-orm/supabase";

export const clientStatus = pgEnum("client_status", [
  "prospect",
  "active",
  "on_hold",
  "completed",
  "archived",
]);

export const clients = pgTable(
  "clients",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    ownerId: uuid("owner_id")
      .default(sql`auth.uid()`)
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    name: text().notNull(),
    status: clientStatus().default("prospect").notNull(),
    industry: text(),
    website: text(),
    location: text(),
    accountOwner: text("account_owner"),
    primaryContactName: text("primary_contact_name"),
    primaryContactEmail: text("primary_contact_email"),
    notes: text(),
    segment: text(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("clients_owner_id_idx").on(table.ownerId),
    index("clients_owner_status_idx").on(table.ownerId, table.status),
    check(
      "clients_name_check",
      sql`char_length(${table.name}) >= 1 AND char_length(${table.name}) <= 200`,
    ),
    pgPolicy("Users can read their own clients", {
      for: "select",
      to: authenticatedRole,
      using: sql`(select auth.uid()) = ${table.ownerId}`,
    }),
    pgPolicy("Users can create their own clients", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`(select auth.uid()) = ${table.ownerId}`,
    }),
    pgPolicy("Users can update their own clients", {
      for: "update",
      to: authenticatedRole,
      using: sql`(select auth.uid()) = ${table.ownerId}`,
      withCheck: sql`(select auth.uid()) = ${table.ownerId}`,
    }),
    pgPolicy("Users can delete their own clients", {
      for: "delete",
      to: authenticatedRole,
      using: sql`(select auth.uid()) = ${table.ownerId}`,
    }),
  ],
).enableRLS();
