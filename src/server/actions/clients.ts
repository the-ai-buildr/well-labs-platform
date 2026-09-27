"use server";

import { revalidatePath } from "next/cache";

import { clientInputSchema } from "@/lib/validation/clients";
import { createClientRecord } from "@/server/dal/clients";

export async function createClientAction(input: unknown) {
  const parsed = clientInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, issues: parsed.error.issues };
  }
  const client = await createClientRecord(parsed.data);
  revalidatePath("/", "layout");
  return { ok: true as const, client };
}
