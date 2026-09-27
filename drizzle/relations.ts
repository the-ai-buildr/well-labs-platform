import { relations } from "drizzle-orm/relations";
import { usersInAuth, clients } from "./schema";

export const clientsRelations = relations(clients, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [clients.ownerId],
		references: [usersInAuth.id]
	}),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	clients: many(clients),
}));