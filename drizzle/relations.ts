import { relations } from "drizzle-orm/relations";
import { authUsers } from "drizzle-orm/supabase";

import { clients } from "./schema";

export const clientsRelations = relations(clients, ({ one }) => ({
  owner: one(authUsers, {
    fields: [clients.ownerId],
    references: [authUsers.id],
  }),
}));

export const authUsersRelations = relations(authUsers, ({ many }) => ({
  clients: many(clients),
}));
