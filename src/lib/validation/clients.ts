import { z } from "zod";

/** Shared by Route Handlers, Server Actions and client-side forms. */
export const clientInputSchema = z.object({
  name: z.string().trim().min(1).max(200),
  status: z
    .enum(["prospect", "active", "on_hold", "completed", "archived"])
    .optional(),
  industry: z.string().nullish(),
  website: z.url().nullish(),
  location: z.string().nullish(),
  account_owner: z.string().nullish(),
  primary_contact_name: z.string().nullish(),
  primary_contact_email: z.email().nullish(),
  notes: z.string().nullish(),
  segment: z.string().nullish(),
});

export type ClientInput = z.infer<typeof clientInputSchema>;
